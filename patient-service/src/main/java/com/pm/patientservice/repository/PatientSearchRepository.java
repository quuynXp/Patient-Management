package com.pm.patientservice.repository;

import com.pm.patientservice.model.PatientDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PatientSearchRepository extends ElasticsearchRepository<PatientDocument, UUID> {
    List<PatientDocument> findByNameContainingIgnoreCase(String name);
}
