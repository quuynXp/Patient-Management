package com.pm.patientservice.service;

import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.exception.EmailAlreadyExistsException;
import com.pm.patientservice.exception.PatientNotFoundException;
import com.pm.patientservice.grpc.BillingServiceGrpcClient;
import com.pm.patientservice.kafka.KafkaProducer;
import com.pm.patientservice.mapper.PatientMapper;
import com.pm.patientservice.model.Patient;
import com.pm.patientservice.model.PatientDocument;
import com.pm.patientservice.repository.PatientRepository;
import com.pm.patientservice.repository.PatientSearchRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final PatientSearchRepository patientSearchRepository;
    private final BillingServiceGrpcClient billingServiceGrpcClient;
    private final KafkaProducer kafkaProducer;

    public PatientService(PatientRepository patientRepository, PatientSearchRepository patientSearchRepository, BillingServiceGrpcClient billingServiceGrpcClient, KafkaProducer kafkaProducer) {
        this.patientRepository = patientRepository;
        this.patientSearchRepository = patientSearchRepository;
        this.billingServiceGrpcClient = billingServiceGrpcClient;
        this.kafkaProducer = kafkaProducer;
    }

    public List<PatientResponseDTO> getPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream().map(PatientMapper::toDTO).toList();
    }

    @Cacheable(value = "patient", key = "#id")
    public PatientResponseDTO getPatientById(UUID id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + id));
        return PatientMapper.toDTO(patient);
    }

    public List<PatientResponseDTO> searchPatients(String name) {
        return patientSearchRepository.findByNameContainingIgnoreCase(name).stream()
                .map(doc -> {
                    PatientResponseDTO dto = new PatientResponseDTO();
                    dto.setId(doc.getId().toString());
                    dto.setName(doc.getName());
                    dto.setEmail(doc.getEmail());
                    dto.setAddress(doc.getAddress());
                    dto.setDateOfBirth(doc.getDateOfBirth().toString());
                    dto.setRegisteredDate(doc.getRegisteredDate().toString());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public PatientResponseDTO createPatient(PatientRequestDTO patientRequestDTO) {
        if(patientRepository.existsByEmail(patientRequestDTO.getEmail())) {
            throw new EmailAlreadyExistsException("A patient with this email already exists" + patientRequestDTO.getEmail());
        }
        Patient newPatient = patientRepository.save(PatientMapper.toPatient(patientRequestDTO));

        // Sync to Elasticsearch
        syncToElasticsearch(newPatient);

        billingServiceGrpcClient.createBillingAccount(newPatient.getId().toString(), newPatient.getName(), newPatient.getEmail());
        kafkaProducer.sendEvent(newPatient);

        return PatientMapper.toDTO(newPatient);
    }

    @CachePut(value = "patient", key = "#id")
    public PatientResponseDTO updatePatient(UUID id, PatientRequestDTO patientRequestDTO) {
        Patient patient = patientRepository.findById(id).orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: "+ id));

        if(patientRepository.existsByEmailAndIdNot(patientRequestDTO.getEmail(), id)) {
            throw new EmailAlreadyExistsException("A patient with this email already exists" + patientRequestDTO.getEmail());
        }

        patient.setName(patientRequestDTO.getName());
        patient.setAddress(patientRequestDTO.getAddress());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setDateOfBirth(LocalDate.parse(patientRequestDTO.getDateOfBirth()));

        Patient updatedPatient = patientRepository.save(patient);

        // Sync to Elasticsearch
        syncToElasticsearch(updatedPatient);
        
        kafkaProducer.sendEvent(updatedPatient);

        return PatientMapper.toDTO(updatedPatient);
    }

    @CacheEvict(value = "patient", key = "#id")
    public void deletePatient(UUID id) {
        patientRepository.deleteById(id);
        patientSearchRepository.deleteById(id);
    }

    private void syncToElasticsearch(Patient patient) {
        PatientDocument doc = new PatientDocument();
        doc.setId(patient.getId());
        doc.setName(patient.getName());
        doc.setEmail(patient.getEmail());
        doc.setAddress(patient.getAddress());
        doc.setDateOfBirth(patient.getDateOfBirth());
        doc.setRegisteredDate(patient.getRegisteredDate());
        patientSearchRepository.save(doc);
    }
}
