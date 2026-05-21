import React from 'react';
import PatientList from './PatientList';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Patient Management
            </h1>
            <p className="text-slate-400 mt-2">Enterprise Healthcare Dashboard</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 transition-colors px-6 py-2 rounded-full font-medium shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            + New Patient
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
                Patient Roster
              </h2>
              <PatientList />
            </div>
          </div>
          <div className="space-y-8">
             <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl">
               <h2 className="text-xl font-semibold mb-4">System Status</h2>
               <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                    <span className="text-slate-400">PostgreSQL</span>
                    <span className="flex items-center gap-2 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online</span>
                 </div>
                 <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                    <span className="text-slate-400">Elasticsearch</span>
                    <span className="flex items-center gap-2 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online</span>
                 </div>
                 <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                    <span className="text-slate-400">Redis Cache</span>
                    <span className="flex items-center gap-2 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online</span>
                 </div>
                 <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                    <span className="text-slate-400">Kafka Broker</span>
                    <span className="flex items-center gap-2 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online</span>
                 </div>
               </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
