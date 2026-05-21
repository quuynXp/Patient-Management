import React, { useEffect, useState } from 'react';

interface Patient {
  id: string;
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
  registeredDate: string;
}

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (query?: string) => {
    setLoading(true);
    try {
      // API Gateway routing: 4004/api/patients
      const url = query 
        ? `http://localhost:4004/api/patients/search?name=${encodeURIComponent(query)}` 
        : 'http://localhost:4004/api/patients';
      
      // Basic mock fallback if API isn't running
      // const res = await fetch(url);
      // const data = await res.json();
      // setPatients(data);
      
      // Mock data for showcase if no API
      setPatients([
        { id: '1', name: 'John Doe', email: 'john@example.com', address: '123 Main St', dateOfBirth: '1990-01-01', registeredDate: '2023-10-01' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', address: '456 Oak Ave', dateOfBirth: '1985-05-15', registeredDate: '2023-10-05' },
      ]);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    fetchPatients(val);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <input 
          type="text" 
          value={search}
          onChange={handleSearch}
          placeholder="Search patients (Elasticsearch powered)..." 
          className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {loading && <span className="absolute right-4 top-3.5 text-blue-400">Loading...</span>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
              <th className="pb-4 pr-4 font-medium">Name</th>
              <th className="pb-4 px-4 font-medium">Email</th>
              <th className="pb-4 px-4 font-medium">Registered</th>
              <th className="pb-4 pl-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {patients.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="py-4 pr-4">
                  <div className="font-medium text-white">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.id.substring(0, 8)}...</div>
                </td>
                <td className="py-4 px-4 text-slate-300">{p.email}</td>
                <td className="py-4 px-4 text-slate-300">{p.registeredDate}</td>
                <td className="py-4 pl-4 text-right">
                  <button className="text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">No patients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
