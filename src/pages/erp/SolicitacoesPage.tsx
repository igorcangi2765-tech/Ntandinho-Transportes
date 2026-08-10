import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  MessageSquare, 
  Truck, 
  Eye, 
  AlertTriangle 
} from 'lucide-react';
import { Pagination } from '../../components/ui/Pagination.js';
import { SkeletonTable } from '../../components/ui/SkeletonLoader.js';

export const SolicitacoesPage: FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingBooking, setViewingBooking] = useState<any | null>(null);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientId: '',
    pickupLocation: '',
    destination: '',
    pickupDate: new Date().toISOString().split('T')[0],
    cargoDescription: '',
    weight: '30 Toneladas',
    price: 150000,
    status: 'Novo'
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([
        fetch('/api/operations/bookings').then(r => r.json()).catch(() => []),
        fetch('/api/operations/clients').then(r => r.json()).catch(() => [])
      ]);
      if (Array.isArray(bRes)) setBookings(bRes);
      if (Array.isArray(cRes)) setClients(cRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenModal = (booking?: any) => {
    if (booking) {
      setEditingBooking(booking);
      setFormData({
        clientId: booking.clientId || '',
        pickupLocation: booking.pickupLocation || '',
        destination: booking.destination || '',
        pickupDate: booking.pickupDate ? new Date(booking.pickupDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        cargoDescription: booking.cargoDescription || '',
        weight: booking.weight || '30 Toneladas',
        price: booking.price || 150000,
        status: booking.status || 'Novo'
      });
    } else {
      setEditingBooking(null);
      setFormData({
        clientId: clients[0]?.id || '',
        pickupLocation: '',
        destination: '',
        pickupDate: new Date().toISOString().split('T')[0],
        cargoDescription: '',
        weight: '30 Toneladas',
        price: 150000,
        status: 'Novo'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = editingBooking ? 'PUT' : 'POST';
    const url = editingBooking ? `/api/operations/bookings/${editingBooking.id}` : '/api/operations/bookings';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    setIsModalOpen(false);
    fetchBookings();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await fetch(`/api/operations/bookings/${deletingId}`, { method: 'DELETE' });
    setDeletingId(null);
    fetchBookings();
  };

  const handleConvertToTrip = async (booking: any) => {
    try {
      await fetch('/api/operations/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          driverId: 'd1',
          vehicleId: 'v1',
          departure: new Date().toISOString(),
          distance: 450,
          fuelCost: 25000,
          otherExpenses: 5000,
          status: 'Em Curso',
          notes: `${booking.pickupLocation} -> ${booking.destination} (${booking.cargoDescription})`
        })
      });
      // Update booking status to Approved
      await fetch(`/api/operations/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Aprovado' })
      });
      alert(`Solicitação convertida em Viagem de Transporte com sucesso!`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchesSearch = b.client?.companyName?.toLowerCase().includes(q) ||
      b.pickupLocation?.toLowerCase().includes(q) ||
      b.destination?.toLowerCase().includes(q) ||
      b.cargoDescription?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'Todos' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1628] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="text-[#F5A300]" />
            <span>Gestão de Solicitações & Reservas</span>
          </h1>
          <p className="text-[#A5B4C7] text-xs mt-1">
            Receção de cotações, solicitações do site, aprovação de fretes e conversão direta em viagens.
          </p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-extrabold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Nova Solicitação</span>
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D1628] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5B4C7]" />
          <input 
            type="text"
            placeholder="Pesquisar por empresa, origem, destino ou carga..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#060B17] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-[#A5B4C7]/50 focus:border-[#F5A300] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-[#A5B4C7]" />
          <span className="text-xs text-[#A5B4C7]">Estado:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#060B17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#F5A300] focus:outline-none"
          >
            <option value="Todos">Todos os Estados</option>
            <option value="Novo">Novo</option>
            <option value="Em análise">Em análise</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Concluído">Concluído</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : (
        <div className="bg-[#0D1628] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A5B4C7]">
              <thead className="bg-[#08101F] text-white uppercase tracking-wider font-semibold border-b border-white/5">
                <tr>
                  <th className="p-4">Empresa / Contacto</th>
                  <th className="p-4">Rota (Origem -&gt; Destino)</th>
                  <th className="p-4">Carga / Peso</th>
                  <th className="p-4">Valor Estimado</th>
                  <th className="p-4">Data Solicitação</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acções Operacionais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedBookings.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#13203A] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{item.client?.companyName || 'Cliente Corporativo'}</div>
                      <div className="text-[11px] text-[#A5B4C7]">{item.client?.contactPerson} ({item.client?.phone})</div>
                    </td>
                    <td className="p-4 font-medium text-white">
                      {item.pickupLocation} -&gt; {item.destination}
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium">{item.cargoDescription}</span>
                      <div className="text-[10px] text-[#F5A300] font-bold">{item.weight}</div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      {item.price?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                    </td>
                    <td className="p-4 text-[#A5B4C7] font-mono">
                      {new Date(item.pickupDate || item.createdAt).toLocaleDateString('pt-MZ')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'Novo'
                          ? 'bg-[#F5A300]/20 text-[#F5A300] border border-[#F5A300]/30'
                          : item.status === 'Aprovado' || item.status === 'Concluído'
                          ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button 
                        onClick={() => setViewingBooking(item)}
                        title="Visualizar Detalhes"
                        className="text-[#A5B4C7] hover:text-white p-1.5 rounded-lg hover:bg-[#13203A]"
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        onClick={() => handleConvertToTrip(item)}
                        title="Converter em Viagem"
                        className="text-[#A5B4C7] hover:text-[#F5A300] p-1.5 rounded-lg hover:bg-[#13203A]"
                      >
                        <Truck size={15} />
                      </button>
                      <a 
                        href={`https://wa.me/${item.client?.phone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Contactar WhatsApp"
                        className="text-[#A5B4C7] hover:text-[#22C55E] p-1.5 rounded-lg hover:bg-[#13203A] inline-block"
                      >
                        <MessageSquare size={15} />
                      </a>
                      <button 
                        onClick={() => handleOpenModal(item)}
                        title="Editar Solicitação"
                        className="text-[#A5B4C7] hover:text-blue-400 p-1.5 rounded-lg hover:bg-[#13203A]"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        onClick={() => setDeletingId(item.id)}
                        title="Eliminar"
                        className="text-[#A5B4C7] hover:text-[#EF4444] p-1.5 rounded-lg hover:bg-[#13203A]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredBookings.length}
          />
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewingBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1628] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-white">
            <button onClick={() => setViewingBooking(null)} className="absolute right-4 top-4 text-[#A5B4C7] hover:text-white">
              <X size={18} />
            </button>
            <h3 className="text-base font-bold text-[#F5A300]">Detalhes da Solicitação de Frete</h3>

            <div className="space-y-2 text-xs divide-y divide-white/5">
              <div className="pt-2 flex justify-between"><span className="text-[#A5B4C7]">Cliente:</span> <strong className="text-white">{viewingBooking.client?.companyName}</strong></div>
              <div className="pt-2 flex justify-between"><span className="text-[#A5B4C7]">Contacto:</span> <span>{viewingBooking.client?.contactPerson} ({viewingBooking.client?.phone})</span></div>
              <div className="pt-2 flex justify-between"><span className="text-[#A5B4C7]">Origem:</span> <span className="text-white font-semibold">{viewingBooking.pickupLocation}</span></div>
              <div className="pt-2 flex justify-between"><span className="text-[#A5B4C7]">Destino:</span> <span className="text-white font-semibold">{viewingBooking.destination}</span></div>
              <div className="pt-2 flex justify-between"><span className="text-[#A5B4C7]">Carga:</span> <span>{viewingBooking.cargoDescription} ({viewingBooking.weight})</span></div>
              <div className="pt-2 flex justify-between"><span className="text-[#A5B4C7]">Valor Estimado:</span> <span className="text-emerald-400 font-bold">{viewingBooking.price?.toLocaleString('pt-MZ')} MZN</span></div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
              <button onClick={() => setViewingBooking(null)} className="px-4 py-2 bg-[#13203A] text-[#A5B4C7] hover:text-white rounded-xl text-xs">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1628] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-white">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-[#A5B4C7] hover:text-white">
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold">{editingBooking ? 'Editar Solicitação' : 'Registar Nova Solicitação'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A5B4C7]">Cliente Associado *</label>
                <select
                  value={formData.clientId}
                  onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                >
                  <option value="">Selecione o cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName} ({c.contactPerson})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A5B4C7]">Origem *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Porto de Nacala"
                    value={formData.pickupLocation}
                    onChange={e => setFormData({ ...formData, pickupLocation: e.target.value })}
                    className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A5B4C7]">Destino *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Blantyre (Malawi)"
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A5B4C7]">Descrição da Carga *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Contentor 40ft com Equipamento Industrial"
                  value={formData.cargoDescription}
                  onChange={e => setFormData({ ...formData, cargoDescription: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A5B4C7]">Peso da Carga</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A5B4C7]">Valor Estimado (MZN)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#13203A] text-[#A5B4C7] rounded-xl text-xs">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-bold rounded-xl text-xs">
                  {editingBooking ? 'Atualizar' : 'Guardar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1628] border border-white/10 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 text-white">
            <AlertTriangle size={36} className="text-[#EF4444] mx-auto" />
            <h3 className="text-base font-bold">Eliminar Solicitação?</h3>
            <p className="text-xs text-[#A5B4C7]">Esta acção removerá o registo permanentemente.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setDeletingId(null)} className="px-4 py-2 bg-[#13203A] text-[#A5B4C7] rounded-xl text-xs">Cancelar</button>
              <button onClick={handleDelete} className="px-5 py-2 bg-[#EF4444] text-white rounded-xl text-xs font-bold">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
