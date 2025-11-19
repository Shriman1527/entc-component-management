import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { issueService } from '../api/services';
import toast from 'react-hot-toast';
import { 
  LogOut, Package, Clock, CheckCircle, AlertCircle, RefreshCw, Calendar 
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    setLoading(true);
    try {
      const data = await issueService.getMyIssues();
      // Ensure we always have an array, even if API returns null/undefined
      setMyIssues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch issues", error);
      // Only show error if it's a real network/server error, not just 404/empty
      if (error.response?.status !== 404) {
          toast.error("Could not sync your records");
      }
    } finally {
      setLoading(false);
    }
  };

  const activeIssues = myIssues.filter(i => i.status === 'Issued');
  const returnedIssues = myIssues.filter(i => i.status === 'Returned');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-800 leading-none">ENTC Portal</h1>
            <span className="text-xs text-gray-500 font-medium">Student Dashboard</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <span className="block text-sm font-bold text-gray-900">{user?.name}</span>
            <span className="block text-xs text-gray-500 font-mono tracking-wide">{user?.rollNo}</span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <button 
            onClick={logout} 
            className="text-gray-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>
      
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        
        {/* --- WELCOME BANNER --- */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h2>
              <p className="opacity-90 text-blue-100">
                You currently have <span className="font-bold text-yellow-300 text-lg mx-1">{activeIssues.length}</span> components in your possession.
              </p>
            </div>
            {/* Decorative Elements */}
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
              <Package size={180} />
            </div>
            <div className="absolute top-0 right-0 p-6">
               <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                  <p className="text-xs font-medium uppercase tracking-wider text-blue-100">Current Date</p>
                  <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
               </div>
            </div>
        </div>

        {/* --- ACTIVE ISSUES SECTION --- */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Clock className="text-amber-500" /> Currently Issued
            </h2>
            <button onClick={fetchMyIssues} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {loading ? (
             <div className="p-12 text-center text-gray-500">Loading your records...</div>
          ) : activeIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeIssues.map((issue) => (
                <div key={issue._id} className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{issue.componentId?.name || 'Unknown Item'}</h3>
                    <p className="text-sm text-gray-500 font-medium">{issue.componentId?.category || 'Hardware'}</p>
                    
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} className="text-gray-400" />
                      <span>Issued: <span className="font-semibold">{new Date(issue.dateIssued).toLocaleDateString()}</span></span>
                    </div>
                  </div>
                  <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-100">
                    <AlertCircle size={12} /> Return Pending
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-xl border-2 border-dashed border-gray-200 text-center">
              <div className="inline-flex p-4 bg-gray-50 rounded-full mb-3">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No Active Components</h3>
              <p className="text-gray-500">You don't have any equipment issued to you at the moment.</p>
            </div>
          )}
        </section>

        {/* --- HISTORY SECTION --- */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" /> Return History
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {returnedIssues.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Component</th>
                    <th className="px-6 py-4">Issued Date</th>
                    <th className="px-6 py-4">Returned Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {returnedIssues.map((issue) => (
                    <tr key={issue._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{issue.componentId?.name}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{new Date(issue.dateIssued).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{new Date(issue.dateReturned).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-green-100">
                          Returned
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
               <div className="p-8 text-center text-gray-400 text-sm">
                 No return history available.
               </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}