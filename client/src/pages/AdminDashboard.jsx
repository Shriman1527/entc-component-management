// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { componentService, userService, issueService } from '../api/services';
// import toast from 'react-hot-toast';
// import { 
//   LayoutDashboard, Package, History, Users, LogOut, 
//   Plus, Search, Trash2, ArrowRightLeft, AlertCircle, Download, TrendingUp, UserPlus 
// } from 'lucide-react';

// export default function AdminDashboard() {
//   const { user, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState('dashboard');
  
//   // Data State
//   const [components, setComponents] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Modals State
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
//   const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false); // New Modal State

//   // Forms
//   const [newComponent, setNewComponent] = useState({
//     name: '', category: '', totalQuantity: '', description: '', location: ''
//   });
//   const [issueForm, setIssueForm] = useState({
//     studentId: '', componentId: '', quantityIssued: 1
//   });
//   const [newStudent, setNewStudent] = useState({ // New Student Form
//     name: '', email: '', rollNo: ''
//   });

//   useEffect(() => { fetchAllData(); }, []);

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const [comps, stus, trans] = await Promise.all([
//         componentService.getAll(),
//         userService.getAllStudents(),
//         issueService.getAllIssues()
//       ]);
//       setComponents(comps);
//       setStudents(stus);
//       setTransactions(trans);
//     } catch (error) {
//       console.error("Error loading data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- COMPONENT ACTIONS ---
//   const handleAddComponent = async (e) => {
//     e.preventDefault();
//     try {
//       await componentService.create(newComponent);
//       toast.success("Component added successfully!");
//       setIsAddModalOpen(false);
//       fetchAllData();
//       setNewComponent({ name: '', category: '', totalQuantity: '', description: '', location: '' });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error adding component");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this component?")) return;
//     try {
//       await componentService.delete(id);
//       toast.success("Component deleted");
//       setComponents(prev => prev.filter(c => c._id !== id));
//     } catch (error) {
//       toast.error("Failed to delete");
//     }
//   };

//   // --- TRANSACTION ACTIONS ---
//   const handleIssueComponent = async (e) => {
//     e.preventDefault();
//     try {
//       await issueService.issueComponent(issueForm);
//       toast.success("Component Issued Successfully!");
//       setIsIssueModalOpen(false);
//       fetchAllData();
//       setIssueForm({ studentId: '', componentId: '', quantityIssued: 1 });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to issue");
//     }
//   };

//   const handleReturn = async (issueId) => {
//     if (!window.confirm("Mark this item as returned?")) return;
//     try {
//       await issueService.returnComponent(issueId);
//       toast.success("Item returned!");
//       fetchAllData();
//     } catch (error) {
//       toast.error("Error processing return");
//     }
//   };

//   // --- STUDENT ACTIONS (NEW) ---
//   const handleAddStudent = async (e) => {
//     e.preventDefault();
//     try {
//       await userService.addStudent(newStudent);
//       toast.success("Student registered successfully!");
//       setIsAddStudentModalOpen(false);
//       // Refresh students list
//       const updatedStudents = await userService.getAllStudents();
//       setStudents(updatedStudents);
//       setNewStudent({ name: '', email: '', rollNo: '' });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error adding student");
//     }
//   };

//   const handleDeleteStudent = async (id) => {
//     if (!window.confirm("Are you sure? This will delete the student and their history.")) return;
//     try {
//       await userService.deleteStudent(id);
//       toast.success("Student deleted");
//       setStudents(prev => prev.filter(s => s._id !== id));
//     } catch (error) {
//       toast.error("Failed to delete student");
//     }
//   };

//   // Stats & Exports
//   const exportToCSV = () => {
//     const headers = ["Student Name", "Roll No", "Component", "Category", "Issued Date", "Status"];
//     const rows = transactions.map(t => [
//       t.studentId?.name || "Unknown",
//       t.studentId?.rollNo || "N/A",
//       t.componentId?.name || "Deleted",
//       t.componentId?.category || "N/A",
//       new Date(t.dateIssued).toLocaleDateString(),
//       t.status
//     ]);

//     let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "entc_transactions.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const isOverdue = (dateIssued) => {
//     const today = new Date();
//     const issued = new Date(dateIssued);
//     const diffDays = Math.ceil(Math.abs(today - issued) / (1000 * 60 * 60 * 24)); 
//     return diffDays > 7;
//   };

//   const totalStock = components.reduce((acc, curr) => acc + (curr.totalQuantity || 0), 0);
//   const activeIssuesCount = transactions.filter(t => t.status === 'Issued').length;
//   const overdueCount = transactions.filter(t => t.status === 'Issued' && isOverdue(t.dateIssued)).length;

//   const popularComponents = transactions.reduce((acc, curr) => {
//     const name = curr.componentId?.name || 'Unknown';
//     acc[name] = (acc[name] || 0) + 1;
//     return acc;
//   }, {});
//   const sortedPopular = Object.entries(popularComponents).sort((a, b) => b[1] - a[1]).slice(0, 3);

//   const filteredComponents = components.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
//   const filteredTransactions = transactions.filter(t => t.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || t.componentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
//   const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

//   return (
//     <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      
//       <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm z-20">
//         <div className="p-6 border-b border-gray-100">
//           <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
//             <Package className="w-6 h-6" /> ENTC Admin
//           </h2>
//         </div>
//         <nav className="flex-1 p-4 space-y-2">
//           <NavButton icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
//           <NavButton icon={<Package size={20}/>} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
//           <NavButton icon={<History size={20}/>} label="Transactions" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
//           <NavButton icon={<Users size={20}/>} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
//         </nav>
//         <div className="p-4 border-t border-gray-100">
//           <button onClick={logout} className="flex items-center gap-3 text-gray-600 hover:text-red-600 w-full px-4 py-2 rounded-lg transition-colors"><LogOut size={20} /> Logout</button>
//         </div>
//       </aside>

//       <main className="flex-1 overflow-y-auto relative">
//         <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
//           <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
//           <div className="flex items-center gap-3">
//              <div className="text-right hidden sm:block"><span className="block text-sm font-medium text-gray-900">{user?.name}</span><span className="block text-xs text-gray-500">Administrator</span></div>
//              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{user?.name?.charAt(0)}</div>
//           </div>
//         </header>

//         <div className="p-8 max-w-7xl mx-auto">
          
//           {activeTab === 'dashboard' && (
//             <div className="space-y-8 animate-in fade-in duration-300">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <StatCard title="Total Components" value={totalStock} icon={<Package className="text-blue-600" />} color="bg-blue-50" />
//                 <StatCard title="Active Issues" value={activeIssuesCount} icon={<History className="text-purple-600" />} color="bg-purple-50" />
//                 <StatCard title="Overdue Items" value={overdueCount} icon={<AlertCircle className="text-red-600" />} color="bg-red-50" />
//                 <StatCard title="Students" value={students.length} icon={<Users className="text-green-600" />} color="bg-green-50" />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                      <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
//                      <div className="space-y-3">
//                         <button onClick={() => { setActiveTab('transactions'); setIsIssueModalOpen(true); }} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-left">
//                           <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><ArrowRightLeft size={18}/></div><span className="font-medium text-gray-700">Issue New Item</span>
//                         </button>
//                         <button onClick={() => { setActiveTab('inventory'); setIsAddModalOpen(true); }} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-left">
//                           <div className="bg-green-100 text-green-600 p-2 rounded-lg"><Plus size={18}/></div><span className="font-medium text-gray-700">Add Stock</span>
//                         </button>
//                      </div>
//                   </div>
//                   <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-blue-600"/> Most Issued Components</h3>
//                      <div className="space-y-4">
//                        {sortedPopular.length > 0 ? sortedPopular.map(([name, count]) => (
//                          <div key={name}>
//                            <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{name}</span><span className="text-gray-500">{count} issues</span></div>
//                            <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(count / (sortedPopular[0][1] || 1)) * 100}%` }}></div></div>
//                          </div>
//                        )) : <p className="text-gray-400 text-sm">No data available yet.</p>}
//                      </div>
//                   </div>
//               </div>
//             </div>
//           )}

//           {/* --- INVENTORY TAB --- */}
//           {activeTab === 'inventory' && (
//             <div className="space-y-6 animate-in fade-in duration-300">
//               <div className="flex flex-col md:flex-row justify-between gap-4">
//                 <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search components..." />
//                 <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm"><Plus size={20} /> Add Component</button>
//               </div>
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <table className="w-full text-left">
//                   <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
//                     <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Category</th><th className="px-6 py-4 text-center">Available</th><th className="px-6 py-4 text-center">Total</th><th className="px-6 py-4">Location</th><th className="px-6 py-4 text-right">Action</th></tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {filteredComponents.map((comp) => (
//                       <tr key={comp._id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-6 py-4 font-medium text-gray-900">{comp.name}</td>
//                         <td className="px-6 py-4 text-gray-500">{comp.category}</td>
//                         <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${comp.quantityAvailable > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{comp.quantityAvailable}</span></td>
//                         <td className="px-6 py-4 text-center text-gray-500">{comp.totalQuantity}</td>
//                         <td className="px-6 py-4 text-gray-500">{comp.location || '-'}</td>
//                         <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(comp._id)} className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={18} /></button></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* --- TRANSACTIONS TAB --- */}
//           {activeTab === 'transactions' && (
//              <div className="space-y-6 animate-in fade-in duration-300">
//                <div className="flex flex-col md:flex-row justify-between gap-4">
//                  <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search transactions..." />
//                  <div className="flex gap-2">
//                     <button onClick={exportToCSV} className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"><Download size={18} /> Export CSV</button>
//                     <button onClick={() => setIsIssueModalOpen(true)} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-all shadow-sm"><ArrowRightLeft size={20} /> Issue Item</button>
//                  </div>
//                </div>
//                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                  <table className="w-full text-left">
//                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
//                      <tr><th className="px-6 py-4">Student</th><th className="px-6 py-4">Component</th><th className="px-6 py-4">Date Issued</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Action</th></tr>
//                    </thead>
//                    <tbody className="divide-y divide-gray-100">
//                      {filteredTransactions.map((t) => (
//                         <tr key={t._id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4"><div className="font-medium text-gray-900">{t.studentId?.name || 'Unknown'}</div><div className="text-xs text-gray-500">{t.studentId?.rollNo}</div></td>
//                           <td className="px-6 py-4 text-gray-700">{t.componentId?.name || 'Deleted Item'}</td>
//                           <td className="px-6 py-4 text-sm text-gray-500">{new Date(t.dateIssued).toLocaleDateString()}</td>
//                           <td className="px-6 py-4">{t.status === 'Issued' ? (isOverdue(t.dateIssued) ? <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold border border-red-100">Overdue</span> : <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-100">Issued</span>) : <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold border border-green-100">Returned</span>}</td>
//                           <td className="px-6 py-4 text-right">{t.status === 'Issued' && <button onClick={() => handleReturn(t._id)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline">Mark Return</button>}</td>
//                         </tr>
//                      ))}
//                    </tbody>
//                  </table>
//                </div>
//              </div>
//           )}

//           {/* --- STUDENTS TAB (UPDATED) --- */}
//           {activeTab === 'students' && (
//             <div className="space-y-6 animate-in fade-in duration-300">
//               <div className="flex justify-between gap-4">
//                  <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search students..." />
//                  <button onClick={() => setIsAddStudentModalOpen(true)} className="bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-all shadow-sm">
//                    <UserPlus size={20} /> Register Student
//                  </button>
//               </div>
              
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                  <table className="w-full text-left">
//                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
//                      <tr>
//                        <th className="px-6 py-4">Name</th>
//                        <th className="px-6 py-4">Roll No</th>
//                        <th className="px-6 py-4">Email</th>
//                        <th className="px-6 py-4 text-right">Actions</th>
//                      </tr>
//                    </thead>
//                    <tbody className="divide-y divide-gray-100">
//                      {filteredStudents.map((student) => (
//                         <tr key={student._id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
//                           <td className="px-6 py-4 text-gray-500 font-mono">{student.rollNo}</td>
//                           <td className="px-6 py-4 text-gray-500">{student.email}</td>
//                           <td className="px-6 py-4 text-right">
//                              <button onClick={() => handleDeleteStudent(student._id)} className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
//                                <Trash2 size={18} />
//                              </button>
//                           </td>
//                         </tr>
//                      ))}
//                    </tbody>
//                  </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* --- ADD COMPONENT MODAL --- */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
//            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl transform transition-all">
//              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
//                 <h3 className="text-xl font-bold text-gray-800">Add New Component</h3>
//                 <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" size={24}/></button>
//              </div>
//              <form onSubmit={handleAddComponent} className="p-6 space-y-4">
//                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Component Name</label><input required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={newComponent.name} onChange={e => setNewComponent({...newComponent, name: e.target.value})} placeholder="e.g. Arduino Uno" /></div>
//                <div className="grid grid-cols-2 gap-4">
//                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Category</label><input required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={newComponent.category} onChange={e => setNewComponent({...newComponent, category: e.target.value})} placeholder="e.g. Sensor" /></div>
//                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label><input required type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={newComponent.totalQuantity} onChange={e => setNewComponent({...newComponent, totalQuantity: Number(e.target.value)})} placeholder="0" /></div>
//                </div>
//                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Location (Optional)</label><input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={newComponent.location} onChange={e => setNewComponent({...newComponent, location: e.target.value})} placeholder="e.g. Rack A1" /></div>
//                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Description</label><textarea rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" value={newComponent.description} onChange={e => setNewComponent({...newComponent, description: e.target.value})} placeholder="Additional details..." /></div>
//                <div className="flex justify-end gap-3 mt-6 pt-2">
//                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
//                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-500/30">Save Component</button>
//                </div>
//              </form>
//            </div>
//         </div>
//       )}

//       {/* --- ISSUE COMPONENT MODAL --- */}
//       {isIssueModalOpen && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
//            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl transform transition-all">
//              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
//                 <h3 className="text-xl font-bold text-gray-800">Issue Component</h3>
//                 <button onClick={() => setIsIssueModalOpen(false)} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" size={24}/></button>
//              </div>
//              <form onSubmit={handleIssueComponent} className="p-6 space-y-4">
//                <div>
//                  <label className="block text-sm font-semibold text-gray-700 mb-1">Select Student</label>
//                  <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={issueForm.studentId} onChange={e => setIssueForm({...issueForm, studentId: e.target.value})}>
//                    <option value="">-- Choose Student --</option>
//                    {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNo})</option>)}
//                  </select>
//                </div>
//                <div>
//                  <label className="block text-sm font-semibold text-gray-700 mb-1">Select Component</label>
//                  <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={issueForm.componentId} onChange={e => setIssueForm({...issueForm, componentId: e.target.value})}>
//                    <option value="">-- Choose Component --</option>
//                    {components.filter(c => c.quantityAvailable > 0).map(c => <option key={c._id} value={c._id}>{c.name} (Available: {c.quantityAvailable})</option>)}
//                  </select>
//                </div>
//                <div>
//                  <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity to Issue</label>
//                  <input type="number" min="1" max="5" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={issueForm.quantityIssued} onChange={e => setIssueForm({...issueForm, quantityIssued: e.target.value})} />
//                </div>
//                <div className="flex justify-end gap-3 mt-6 pt-2">
//                  <button type="button" onClick={() => setIsIssueModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
//                  <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-lg shadow-purple-500/30">Confirm Issue</button>
//                </div>
//              </form>
//            </div>
//         </div>
//       )}

//       {/* --- ADD STUDENT MODAL (NEW) --- */}
//       {isAddStudentModalOpen && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
//            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl transform transition-all">
//              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
//                 <h3 className="text-xl font-bold text-gray-800">Register New Student</h3>
//                 <button onClick={() => setIsAddStudentModalOpen(false)} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" size={24}/></button>
//              </div>
//              <form onSubmit={handleAddStudent} className="p-6 space-y-4">
//                <div>
//                  <label className="block text-sm font-semibold text-gray-700 mb-1">Student Name</label>
//                  <input required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" 
//                     value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} placeholder="e.g. Rahul Sharma" />
//                </div>
//                <div>
//                  <label className="block text-sm font-semibold text-gray-700 mb-1">Roll Number</label>
//                  <input required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" 
//                     value={newStudent.rollNo} onChange={e => setNewStudent({...newStudent, rollNo: e.target.value})} placeholder="e.g. ENTC21001" />
//                </div>
//                <div>
//                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
//                  <input required type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" 
//                     value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} placeholder="rahul@college.edu" />
//                </div>
               
//                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 mt-2">
//                  Note: The default password will be the student's Roll Number.
//                </div>

//                <div className="flex justify-end gap-3 mt-6 pt-2">
//                  <button type="button" onClick={() => setIsAddStudentModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
//                  <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-lg shadow-green-500/30">Register Student</button>
//                </div>
//              </form>
//            </div>
//         </div>
//       )}

//     </div>
//   );
// }

// // --- HELPER COMPONENTS ---
// function NavButton({ icon, label, active, onClick }) {
//   return <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>{icon}{label}</button>;
// }
// function StatCard({ title, value, icon, color }) {
//   return <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300"><div className={`p-4 rounded-full ${color}`}>{icon}</div><div><h4 className="text-2xl font-bold text-gray-900">{value}</h4><p className="text-sm text-gray-500">{title}</p></div></div>;
// }
// function SearchBar({ searchTerm, setSearchTerm, placeholder }) {
//   return <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder={placeholder} className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>;
// }

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { componentService, userService, issueService } from '../api/services';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, Package, History, Users, LogOut, 
  Plus, Search, Trash2, ArrowRightLeft, AlertCircle, Download, TrendingUp, UserPlus, Pencil 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data State
  const [components, setComponents] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  
  // --- EDIT STATE (New) ---
  const [editingStudentId, setEditingStudentId] = useState(null); 

  // Forms
  const [newComponent, setNewComponent] = useState({
    name: '', category: '', totalQuantity: '', description: '', location: ''
  });
  const [issueForm, setIssueForm] = useState({
    studentId: '', componentId: '', quantityIssued: 1
  });
  const [studentForm, setStudentForm] = useState({ 
    name: '', email: '', rollNo: ''
  });

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [comps, stus, trans] = await Promise.all([
        componentService.getAll(),
        userService.getAllStudents(),
        issueService.getAllIssues()
      ]);
      setComponents(comps);
      setStudents(stus);
      setTransactions(trans);
    } catch (error) {
      console.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  // --- COMPONENT ACTIONS ---
  const handleAddComponent = async (e) => {
    e.preventDefault();
    try {
      await componentService.create(newComponent);
      toast.success("Component added successfully!");
      setIsAddModalOpen(false);
      fetchAllData();
      setNewComponent({ name: '', category: '', totalQuantity: '', description: '', location: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding component");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this component?")) return;
    try {
      await componentService.delete(id);
      toast.success("Component deleted");
      setComponents(prev => prev.filter(c => c._id !== id));
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  // --- TRANSACTION ACTIONS ---
  const handleIssueComponent = async (e) => {
    e.preventDefault();
    try {
      await issueService.issueComponent(issueForm);
      toast.success("Component Issued Successfully!");
      setIsIssueModalOpen(false);
      fetchAllData();
      setIssueForm({ studentId: '', componentId: '', quantityIssued: 1 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to issue");
    }
  };

  const handleReturn = async (issueId) => {
    if (!window.confirm("Mark this item as returned?")) return;
    try {
      await issueService.returnComponent(issueId);
      toast.success("Item returned!");
      fetchAllData();
    } catch (error) {
      toast.error("Error processing return");
    }
  };

  // --- STUDENT ACTIONS (ADD & UPDATE) ---
  
  const openRegisterModal = () => {
    setEditingStudentId(null);
    setStudentForm({ name: '', email: '', rollNo: '' });
    setIsStudentModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudentId(student._id);
    setStudentForm({ name: student.name, email: student.email, rollNo: student.rollNo });
    setIsStudentModalOpen(true);
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudentId) {
        await userService.updateStudent(editingStudentId, studentForm);
        toast.success("Student updated!");
      } else {
        await userService.addStudent(studentForm);
        toast.success("Student registered!");
      }
      setIsStudentModalOpen(false);
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Delete student?")) return;
    try {
      await userService.deleteStudent(id);
      toast.success("Student deleted");
      fetchAllData();
    } catch (error) { toast.error("Failed to delete"); }
  };

  // Stats & Filter Logic...
  const exportToCSV = () => {
    const headers = ["Student Name", "Roll No", "Component", "Category", "Issued Date", "Status"];
    const rows = transactions.map(t => [
      t.studentId?.name || "Unknown",
      t.studentId?.rollNo || "N/A",
      t.componentId?.name || "Deleted",
      t.componentId?.category || "N/A",
      new Date(t.dateIssued).toLocaleDateString(),
      t.status
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "entc_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isOverdue = (dateIssued) => {
    const diffDays = Math.ceil(Math.abs(new Date() - new Date(dateIssued)) / (1000 * 60 * 60 * 24)); 
    return diffDays > 7;
  };

  const totalStock = components.reduce((acc, curr) => acc + (curr.totalQuantity || 0), 0);
  const activeIssuesCount = transactions.filter(t => t.status === 'Issued').length;
  const overdueCount = transactions.filter(t => t.status === 'Issued' && isOverdue(t.dateIssued)).length;

  const popularComponents = transactions.reduce((acc, curr) => {
    const name = curr.componentId?.name || 'Unknown';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const sortedPopular = Object.entries(popularComponents).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const filteredComponents = components.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredTransactions = transactions.filter(t => t.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || t.componentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm z-20">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2"><Package className="w-6 h-6" /> ENTC Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavButton icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavButton icon={<Package size={20}/>} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <NavButton icon={<History size={20}/>} label="Transactions" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
          <NavButton icon={<Users size={20}/>} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="flex items-center gap-3 text-gray-600 hover:text-red-600 w-full px-4 py-2 rounded-lg transition-colors"><LogOut size={20} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block"><span className="block text-sm font-medium text-gray-900">{user?.name}</span><span className="block text-xs text-gray-500">Administrator</span></div>
             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{user?.name?.charAt(0)}</div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          
          {activeTab === 'dashboard' && (
             <div className="space-y-8 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <StatCard title="Total Components" value={totalStock} icon={<Package className="text-blue-600" />} color="bg-blue-50" />
                 <StatCard title="Active Issues" value={activeIssuesCount} icon={<History className="text-purple-600" />} color="bg-purple-50" />
                 <StatCard title="Overdue Items" value={overdueCount} icon={<AlertCircle className="text-red-600" />} color="bg-red-50" />
                 <StatCard title="Students" value={students.length} icon={<Users className="text-green-600" />} color="bg-green-50" />
               </div>
               {/* Quick Actions & Chart */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                     <div className="space-y-3">
                        <button onClick={() => { setActiveTab('transactions'); setIsIssueModalOpen(true); }} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-left">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><ArrowRightLeft size={18}/></div><span className="font-medium text-gray-700">Issue New Item</span>
                        </button>
                        <button onClick={() => { setActiveTab('inventory'); setIsAddModalOpen(true); }} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-left">
                          <div className="bg-green-100 text-green-600 p-2 rounded-lg"><Plus size={18}/></div><span className="font-medium text-gray-700">Add Stock</span>
                        </button>
                     </div>
                  </div>
                  <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-blue-600"/> Most Issued Components</h3>
                     <div className="space-y-4">
                       {sortedPopular.length > 0 ? sortedPopular.map(([name, count]) => (
                         <div key={name}>
                           <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{name}</span><span className="text-gray-500">{count} issues</span></div>
                           <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(count / (sortedPopular[0][1] || 1)) * 100}%` }}></div></div>
                         </div>
                       )) : <p className="text-gray-400 text-sm">No data available yet.</p>}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'inventory' && (
              <div className="space-y-6">
                 <div className="flex justify-between gap-4">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search components..." />
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm"><Plus size={18}/> Add Component</button>
                 </div>
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                       <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider"><tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Category</th><th className="px-6 py-4 text-center">Available</th><th className="px-6 py-4 text-center">Total</th><th className="px-6 py-4">Location</th><th className="px-6 py-4 text-right">Action</th></tr></thead>
                       <tbody>{filteredComponents.map(c => (
                          <tr key={c._id} className="hover:bg-gray-50 border-t">
                             <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                             <td className="px-6 py-4 text-gray-500">{c.category}</td>
                             <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.quantityAvailable > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.quantityAvailable}</span></td>
                             <td className="px-6 py-4 text-center text-gray-500">{c.totalQuantity}</td>
                             <td className="px-6 py-4 text-gray-500">{c.location || '-'}</td>
                             <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(c._id)} className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={18}/></button></td>
                          </tr>
                       ))}</tbody>
                    </table>
                 </div>
              </div>
          )}

          {activeTab === 'transactions' && (
             <div className="space-y-6">
               <div className="flex justify-between gap-4">
                  <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search transactions..." />
                  <div className="flex gap-2">
                     <button onClick={exportToCSV} className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"><Download size={18} /> Export CSV</button>
                     <button onClick={() => setIsIssueModalOpen(true)} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-all shadow-sm"><ArrowRightLeft size={18}/> Issue Item</button>
                  </div>
               </div>
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider"><tr><th className="px-6 py-4">Student</th><th className="px-6 py-4">Component</th><th className="px-6 py-4">Date Issued</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Action</th></tr></thead>
                     <tbody>{filteredTransactions.map(t => (
                        <tr key={t._id} className="hover:bg-gray-50 border-t">
                           <td className="px-6 py-4"><div className="font-medium text-gray-900">{t.studentId?.name || 'Unknown'}</div><div className="text-xs text-gray-500">{t.studentId?.rollNo}</div></td>
                           <td className="px-6 py-4 text-gray-700">{t.componentId?.name || 'Deleted Item'}</td>
                           <td className="px-6 py-4 text-sm text-gray-500">{new Date(t.dateIssued).toLocaleDateString()}</td>
                           <td className="px-6 py-4">{t.status === 'Issued' ? (isOverdue(t.dateIssued) ? <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold border border-red-100">Overdue</span> : <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-100">Issued</span>) : <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold border border-green-100">Returned</span>}</td>
                           <td className="px-6 py-4 text-right">{t.status === 'Issued' && <button onClick={() => handleReturn(t._id)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline">Mark Return</button>}</td>
                        </tr>
                     ))}</tbody>
                  </table>
               </div>
             </div>
          )}

          {/* --- STUDENTS TAB (UPDATED) --- */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex justify-between gap-4">
                 <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search students..." />
                 <button onClick={openRegisterModal} className="bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-all shadow-sm">
                   <UserPlus size={20} /> Register Student
                 </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                 <table className="w-full text-left">
                   <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                     <tr>
                       <th className="px-6 py-4">Name</th>
                       <th className="px-6 py-4">Roll No</th>
                       <th className="px-6 py-4">Email</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {filteredStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 text-gray-500 font-mono">{student.rollNo}</td>
                          <td className="px-6 py-4 text-gray-500">{student.email}</td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                             {/* EDIT BUTTON (NEW) */}
                             <button onClick={() => openEditModal(student)} className="text-blue-500 hover:text-blue-700 mr-2 p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Edit Student">
                               <Pencil size={18} />
                             </button>
                             {/* DELETE BUTTON */}
                             <button onClick={() => handleDeleteStudent(student._id)} className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Delete Student">
                               <Trash2 size={18} />
                             </button>
                          </td>
                        </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- ADD COMPONENT MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
           <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl transform transition-all">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Add New Component</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" size={24}/></button>
             </div>
             <form onSubmit={handleAddComponent} className="p-6 space-y-4">
               <div><label className="block text-sm font-semibold text-gray-700 mb-1">Component Name</label><input required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={newComponent.name} onChange={e => setNewComponent({...newComponent, name: e.target.value})} placeholder="e.g. Arduino Uno" /></div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="block text-sm font-semibold text-gray-700 mb-1">Category</label><input required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={newComponent.category} onChange={e => setNewComponent({...newComponent, category: e.target.value})} placeholder="e.g. Sensor" /></div>
                 <div><label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label><input required type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={newComponent.totalQuantity} onChange={e => setNewComponent({...newComponent, totalQuantity: Number(e.target.value)})} placeholder="0" /></div>
               </div>
               <div><label className="block text-sm font-semibold text-gray-700 mb-1">Location (Optional)</label><input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={newComponent.location} onChange={e => setNewComponent({...newComponent, location: e.target.value})} placeholder="e.g. Rack A1" /></div>
               <div><label className="block text-sm font-semibold text-gray-700 mb-1">Description</label><textarea rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" value={newComponent.description} onChange={e => setNewComponent({...newComponent, description: e.target.value})} placeholder="Additional details..." /></div>
               <div className="flex justify-end gap-3 mt-6 pt-2">
                 <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                 <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-500/30">Save Component</button>
               </div>
             </form>
           </div>
        </div>
      )}

      {/* --- ISSUE COMPONENT MODAL --- */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
           <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl transform transition-all">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Issue Component</h3>
                <button onClick={() => setIsIssueModalOpen(false)} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" size={24}/></button>
             </div>
             <form onSubmit={handleIssueComponent} className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Select Student</label>
                 <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={issueForm.studentId} onChange={e => setIssueForm({...issueForm, studentId: e.target.value})}>
                   <option value="">-- Choose Student --</option>
                   {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNo})</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Select Component</label>
                 <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={issueForm.componentId} onChange={e => setIssueForm({...issueForm, componentId: e.target.value})}>
                   <option value="">-- Choose Component --</option>
                   {components.filter(c => c.quantityAvailable > 0).map(c => <option key={c._id} value={c._id}>{c.name} (Available: {c.quantityAvailable})</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity to Issue</label>
                 <input type="number" min="1" max="5" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={issueForm.quantityIssued} onChange={e => setIssueForm({...issueForm, quantityIssued: e.target.value})} />
               </div>
               <div className="flex justify-end gap-3 mt-6 pt-2">
                 <button type="button" onClick={() => setIsIssueModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                 <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-lg shadow-purple-500/30">Confirm Issue</button>
               </div>
             </form>
           </div>
        </div>
      )}

      {/* --- ADD/EDIT STUDENT MODAL --- */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
           <div className="bg-white rounded-xl w-full max-w-md shadow-2xl transform transition-all">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingStudentId ? 'Update Student Details' : 'Register New Student'}
                </h3>
                <button onClick={() => setIsStudentModalOpen(false)} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" size={24}/></button>
             </div>
             <form onSubmit={handleStudentSubmit} className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Student Name</label>
                 <input required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                    value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} placeholder="e.g. Rahul Sharma" />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Roll Number</label>
                 <input required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                    value={studentForm.rollNo} onChange={e => setStudentForm({...studentForm, rollNo: e.target.value})} placeholder="e.g. ENTC21001" />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                 <input required type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                    value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} placeholder="rahul@college.edu" />
               </div>
               
               <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 mt-2">
                 {editingStudentId 
                    ? "Updating will send an email notification to the student with their new details." 
                    : "Note: The default password will be the student's Roll Number."}
               </div>

               <div className="flex justify-end gap-3 mt-6 pt-2">
                 <button type="button" onClick={() => setIsStudentModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                 <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-lg shadow-green-500/30">
                    {editingStudentId ? 'Save Changes' : 'Register Student'}
                 </button>
               </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}

// --- HELPER COMPONENTS ---
function NavButton({ icon, label, active, onClick }) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>{icon}{label}</button>;
}
function StatCard({ title, value, icon, color }) {
  return <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300"><div className={`p-4 rounded-full ${color}`}>{icon}</div><div><h4 className="text-2xl font-bold text-gray-900">{value}</h4><p className="text-sm text-gray-500">{title}</p></div></div>;
}
function SearchBar({ searchTerm, setSearchTerm, placeholder }) {
  return <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder={placeholder} className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>;
}