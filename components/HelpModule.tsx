
import React, { useState } from 'react';
import { BookOpen, LifeBuoy, Activity, Search, Plus, FileText, ChevronRight, AlertTriangle, CheckCircle, XCircle, Clock, Server, Monitor, MessageSquare } from 'lucide-react';
import { MOCK_HELP_ARTICLES, MOCK_SUPPORT_TICKETS, MOCK_SYSTEM_STATUS } from '../services/mockData';
import { HelpArticle, SupportTicket, TicketPriority, TicketStatus } from '../types';

const HelpModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'KNOWLEDGE' | 'TICKETS' | 'STATUS'>('KNOWLEDGE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  
  // Ticket State
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<Partial<SupportTicket>>({ category: 'SOFTWARE', priority: TicketPriority.MEDIUM, subject: '', description: '' });

  const filteredArticles = MOCK_HELP_ARTICLES.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.tags.some(t => t.includes(searchQuery.toLowerCase()))
  );

  const handleCreateTicket = () => {
     if (!newTicket.subject || !newTicket.description) return;
     const ticket: SupportTicket = {
        ...newTicket as SupportTicket,
        id: `TKT-${Date.now()}`,
        status: TicketStatus.OPEN,
        createdAt: new Date().toLocaleString(),
        userId: 'current_user' // Mock
     };
     setTickets([ticket, ...tickets]);
     setIsNewTicketOpen(false);
     setNewTicket({ category: 'SOFTWARE', priority: TicketPriority.MEDIUM, subject: '', description: '' });
     alert('Zgłoszenie zostało wysłane do działu IT.');
  };

  const getPriorityColor = (p: TicketPriority) => {
     switch(p) {
        case TicketPriority.CRITICAL: return 'bg-red-100 text-red-700 border-red-200';
        case TicketPriority.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
        case TicketPriority.MEDIUM: return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
     }
  };

  const getStatusIcon = (status: string) => {
     switch(status) {
        case 'OPERATIONAL': return <CheckCircle className="text-green-500" size={20}/>;
        case 'DEGRADED': return <AlertTriangle className="text-amber-500" size={20}/>;
        case 'OUTAGE': return <XCircle className="text-red-500" size={20}/>;
        default: return <Activity className="text-slate-400" size={20}/>;
     }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LifeBuoy className="text-blue-600" /> Centrum Pomocy
          </h2>
          <p className="text-xs text-slate-500">Etap 44: Baza Wiedzy, Wsparcie IT, Status Systemów</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('KNOWLEDGE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'KNOWLEDGE' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Baza Wiedzy (Wiki)
          </button>
          <button 
            onClick={() => setActiveTab('TICKETS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'TICKETS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Moje Zgłoszenia
          </button>
          <button 
            onClick={() => setActiveTab('STATUS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'STATUS' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Status Systemów
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
         
         {/* === KNOWLEDGE BASE === */}
         {activeTab === 'KNOWLEDGE' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
               {/* Sidebar: Search & List */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                        <input 
                           type="text" 
                           placeholder="Szukaj procedury..." 
                           className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                        />
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                     {filteredArticles.map(article => (
                        <button 
                           key={article.id}
                           onClick={() => setSelectedArticle(article)}
                           className={`w-full text-left p-3 rounded-lg transition hover:bg-slate-50 border border-transparent ${selectedArticle?.id === article.id ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : ''}`}
                        >
                           <h4 className="font-bold text-sm text-slate-700">{article.title}</h4>
                           <div className="flex justify-between mt-1">
                              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">{article.category}</span>
                              <span className="text-[10px] text-slate-400">{article.views} wyświetleń</span>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>

               {/* Article Content */}
               <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8 overflow-y-auto">
                  {selectedArticle ? (
                     <div className="animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 uppercase font-bold tracking-wider">
                           <BookOpen size={14}/> {selectedArticle.category}
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-6">{selectedArticle.title}</h1>
                        
                        <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                           {selectedArticle.content}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex gap-2">
                           {selectedArticle.tags.map(tag => (
                              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">#{tag}</span>
                           ))}
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                           Ostatnia aktualizacja: {selectedArticle.lastUpdated}
                        </div>
                     </div>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <BookOpen size={64} className="mb-4 opacity-20"/>
                        <p>Wybierz artykuł z listy, aby zobaczyć szczegóły.</p>
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* === TICKETS === */}
         {activeTab === 'TICKETS' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
               <div className="flex justify-between items-center bg-blue-50 border border-blue-200 p-6 rounded-xl">
                  <div>
                     <h3 className="font-bold text-blue-900 text-lg">Helpdesk IT</h3>
                     <p className="text-sm text-blue-700">Zgłaszaj problemy techniczne i sprzętowe.</p>
                  </div>
                  <button 
                     onClick={() => setIsNewTicketOpen(true)}
                     className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md flex items-center gap-2"
                  >
                     <Plus size={18}/> Nowe Zgłoszenie
                  </button>
               </div>

               {isNewTicketOpen && (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg mb-6 animate-in slide-in-from-top-4">
                     <h4 className="font-bold text-slate-800 mb-4">Formularz Zgłoszeniowy</h4>
                     <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-1">Temat</label>
                           <input 
                              type="text" 
                              className="w-full border p-2 rounded bg-white"
                              value={newTicket.subject}
                              onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                              placeholder="Krótki opis problemu..."
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Kategoria</label>
                              <select 
                                 className="w-full border p-2 rounded bg-white"
                                 value={newTicket.category}
                                 onChange={e => setNewTicket({...newTicket, category: e.target.value as any})}
                              >
                                 <option value="HARDWARE">Sprzęt (Drukarki, PC)</option>
                                 <option value="SOFTWARE">Oprogramowanie / Błędy</option>
                                 <option value="ACCESS">Dostępy / Hasła</option>
                              </select>
                           </div>
                           <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Priorytet</label>
                              <select 
                                 className="w-full border p-2 rounded bg-white"
                                 value={newTicket.priority}
                                 onChange={e => setNewTicket({...newTicket, priority: e.target.value as any})}
                              >
                                 {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                           </div>
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-1">Szczegółowy Opis</label>
                           <textarea 
                              className="w-full border p-2 rounded bg-white h-24 resize-none"
                              value={newTicket.description}
                              onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                              placeholder="Opisz dokładnie sytuację, komunikaty błędów..."
                           ></textarea>
                        </div>
                        <div className="flex gap-2 justify-end">
                           <button onClick={() => setIsNewTicketOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded">Anuluj</button>
                           <button onClick={handleCreateTicket} className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Wyślij Zgłoszenie</button>
                        </div>
                     </div>
                  </div>
               )}

               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                     Twoje Otwarte Zgłoszenia
                  </div>
                  <table className="w-full text-left text-sm">
                     <thead className="bg-white text-slate-500 uppercase text-xs border-b border-slate-200">
                        <tr>
                           <th className="p-4">ID</th>
                           <th className="p-4">Temat</th>
                           <th className="p-4">Kategoria</th>
                           <th className="p-4">Priorytet</th>
                           <th className="p-4">Status</th>
                           <th className="p-4">Data</th>
                           <th className="p-4">Przypisany</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {tickets.map(ticket => (
                           <tr key={ticket.id} className="hover:bg-slate-50">
                              <td className="p-4 font-mono font-bold text-slate-600">{ticket.id}</td>
                              <td className="p-4 font-medium text-slate-800">{ticket.subject}</td>
                              <td className="p-4"><span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-500">{ticket.category}</span></td>
                              <td className="p-4">
                                 <span className={`text-[10px] uppercase font-bold border px-2 py-1 rounded ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                 </span>
                              </td>
                              <td className="p-4">
                                 <span className="text-xs font-bold text-blue-600">{ticket.status}</span>
                              </td>
                              <td className="p-4 text-slate-500 text-xs">{ticket.createdAt}</td>
                              <td className="p-4 text-xs font-mono">{ticket.assignedTo || '-'}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* === SYSTEM STATUS === */}
         {activeTab === 'STATUS' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <Activity className="text-green-500"/> Status Usług Systemowych
                  </h3>
                  
                  <div className="space-y-4">
                     {MOCK_SYSTEM_STATUS.map((status, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                           <div className="flex items-center gap-4">
                              {getStatusIcon(status.status)}
                              <div>
                                 <div className="font-bold text-slate-800">{status.serviceName}</div>
                                 <div className="text-xs text-slate-500 flex gap-2">
                                    <span>Uptime: {status.uptime}%</span>
                                    <span>Ost. sprawdzenie: {status.lastCheck}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              {status.status === 'OPERATIONAL' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">DZIAŁA</span>}
                              {status.status === 'DEGRADED' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded text-xs font-bold">PROBLEMY</span>}
                              {status.status === 'OUTAGE' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold">AWARIA</span>}
                              
                              <button className="text-xs text-blue-600 font-bold hover:underline">Szczegóły</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Server size={18}/> Serwery</h4>
                     <div className="text-sm text-slate-600 space-y-2">
                        <div className="flex justify-between"><span>CPU Load</span><span className="font-mono font-bold">34%</span></div>
                        <div className="flex justify-between"><span>Memory</span><span className="font-mono font-bold">12GB / 32GB</span></div>
                        <div className="flex justify-between"><span>Disk Space</span><span className="font-mono font-bold text-amber-600">85% Used</span></div>
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Monitor size={18}/> Klienci</h4>
                     <div className="text-sm text-slate-600 space-y-2">
                        <div className="flex justify-between"><span>Active Sessions</span><span className="font-mono font-bold">42</span></div>
                        <div className="flex justify-between"><span>Mobile Collectors</span><span className="font-mono font-bold">8 Online</span></div>
                        <div className="flex justify-between"><span>Kioski Samoobsługowe</span><span className="font-mono font-bold text-green-600">WSZYSTKIE OK</span></div>
                     </div>
                  </div>
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default HelpModule;
