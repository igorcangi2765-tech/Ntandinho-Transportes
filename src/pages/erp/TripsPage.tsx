import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit2, 
  Trash2, 
  X, 
  AlertTriangle,
  ChevronRight,
  CheckCircle,
  FileText,
  Clock,
  Play,
  LayoutGrid,
  List,
  MessageSquare,
  Send,
  User
} from 'lucide-react';
import { Trip, Driver, Vehicle } from '../../types/index.js';
import { SkeletonTable } from '../../components/ui/SkeletonLoader.js';
import { Pagination } from '../../components/ui/Pagination.js';
import { useToast } from '../../context/ToastContext.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { z } from 'zod';

export type TripWorkflowStage = 
  | 'Cotação' 
  | 'Confirmada' 
  | 'Planeada' 
  | 'Em carregamento' 
  | 'Em viagem' 
  | 'Na fronteira' 
  | 'Entregue' 
  | 'Concluída';

const WORKFLOW_STAGES: TripWorkflowStage[] = [
  'Cotação',
  'Confirmada',
  'Planeada',
  'Em carregamento',
  'Em viagem',
  'Na fronteira',
  'Entregue',
  'Concluída'
];

const tripSchema = z.object({
  driverId: z.string().min(1, 'Selecione um motorista'),
  vehicleId: z.string().min(1, 'Selecione um veículo'),
  departure: z.string().min(1, 'Data de saída é obrigatória'),
  distance: z.number().min(0, 'Distância deve ser maior ou igual a 0'),
  fuelCost: z.number().min(0),
  otherExpenses: z.number().min(0),
  status: z.string(),
  notes: z.string().optional()
});

export const TripsPage: FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // View Mode: Table vs Kanban
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Chat Modal State
  const [activeChatTrip, setActiveChatTrip] = useState<Trip | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; role: string; text: string; time: string }>>([
    { sender: 'Operações (Admin)', role: 'Gestor', text: 'Carga despachada de Nampula. Motorista confirmou abastecimento completo.', time: '08:15' },
    { sender: 'Motorista (Carlos)', role: 'Motorista', text: 'Cheguei ao posto de Ressano Garcia. Aguardando carimbo de alfândega.', time: '11:40' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Full Ideal Form State
  const [formData, setFormData] = useState({
    driverId: '',
    vehicleId: '',
    clientName: 'Mozambique Logistics S.A.',
    origin: 'Terminal Nampula Central',
    destination: 'Porto de Nacala',
    cargoType: 'Carga Geral / Contentor 40ft',
    cargoWeight: '32 Toneladas',
    price: 65000,
    departure: new Date().toISOString().split('T')[0],
    departureTime: '08:00',
    distance: 185,
    fuelCost: 14500,
    otherExpenses: 2500,
    workflowStage: 'Em viagem' as TripWorkflowStage,
    notes: 'Transporte prioritário com guias de marcha emitidas.',
    documentsAttached: true
  });

  useEffect(() => {
    fetchTripsData();
  }, []);

  const fetchTripsData = async () => {
    setLoading(true);
    try {
      const [tripsRes, driversRes, vehiclesRes] = await Promise.all([
        fetch('/api/operations/trips').then(r => r.json()),
        fetch('/api/operations/drivers').then(r => r.json()),
        fetch('/api/operations/vehicles').then(r => r.json())
      ]);
      if (Array.isArray(tripsRes)) setTrips(tripsRes);
      if (Array.isArray(driversRes)) setDrivers(driversRes);
      if (Array.isArray(vehiclesRes)) setVehicles(vehiclesRes);
    } catch (err) {
      showToast('Erro ao carregar dados de expedição', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (trip?: Trip) => {
    setErrors({});
    if (trip) {
      setEditingTrip(trip);
      setFormData({
        driverId: trip.driverId,
        vehicleId: trip.vehicleId,
        clientName: (trip as any).booking?.client?.companyName || 'Cliente Corporativo',
        origin: (trip as any).booking?.pickupLocation || 'Nampula (Terminal)',
        destination: (trip as any).booking?.destination || 'Maputo (Porto)',
        cargoType: (trip as any).booking?.cargoDescription || 'Mercadoria Diversa',
        cargoWeight: (trip as any).booking?.weight || '30 Toneladas',
        price: (trip as any).booking?.price || 55000,
        departure: trip.departure ? new Date(trip.departure).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        departureTime: '08:00',
        distance: trip.distance || 200,
        fuelCost: trip.fuelCost || 12000,
        otherExpenses: trip.otherExpenses || 2000,
        workflowStage: (trip.status as any) || 'Em viagem',
        notes: trip.notes || '',
        documentsAttached: true
      });
    } else {
      setEditingTrip(null);
      setFormData({
        driverId: drivers[0]?.id || '',
        vehicleId: vehicles[0]?.id || '',
        clientName: 'Mozambique Logistics S.A.',
        origin: 'Terminal Nampula Central',
        destination: 'Porto de Nacala',
        cargoType: 'Carga Geral / Contentor 40ft',
        cargoWeight: '32 Toneladas',
        price: 65000,
        departure: new Date().toISOString().split('T')[0],
        departureTime: '08:00',
        distance: 185,
        fuelCost: 14500,
        otherExpenses: 2500,
        workflowStage: 'Cotação',
        notes: 'Guia de marcha e seguro de carga em ordem.',
        documentsAttached: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent, startTripNow = false) => {
    e.preventDefault();
    setErrors({});

    const stageToSave = startTripNow ? 'Em viagem' : formData.workflowStage;
    const result = tripSchema.safeParse({ ...formData, status: stageToSave });
    
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) formattedErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(formattedErrors);
      showToast('Por favor, verifique os campos do formulário.', 'error');
      return;
    }

    try {
      const url = editingTrip 
        ? `/api/operations/trips/${editingTrip.id}`
        : '/api/operations/trips';
      const method = editingTrip ? 'PUT' : 'POST';

      const payload = {
        driverId: formData.driverId,
        vehicleId: formData.vehicleId,
        departure: `${formData.departure}T${formData.departureTime}:00Z`,
        distance: formData.distance,
        fuelCost: formData.fuelCost,
        otherExpenses: formData.otherExpenses,
        status: stageToSave,
        notes: formData.notes
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Falha ao gravar viagem');

      showToast(
        startTripNow ? 'Viagem Iniciada e Despachada!' : editingTrip ? 'Viagem atualizada com sucesso!' : 'Nova viagem agendada com sucesso!', 
        'success'
      );
      setIsModalOpen(false);
      fetchTripsData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao guardar dados', 'error');
    }
  };

  const handleAdvanceStage = async (trip: Trip) => {
    const currentIdx = WORKFLOW_STAGES.indexOf(trip.status as any);
    const nextStage = currentIdx >= 0 && currentIdx < WORKFLOW_STAGES.length - 1 
      ? WORKFLOW_STAGES[currentIdx + 1] 
      : 'Concluída';

    try {
      const res = await fetch(`/api/operations/trips/${trip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStage })
      });
      if (!res.ok) throw new Error('Falha ao atualizar estado');
      showToast(`Estado da viagem ${trip.trackingCode} alterado para "${nextStage}"`, 'success');
      fetchTripsData();
    } catch (err: any) {
      showToast('Erro ao avançar etapa da viagem', 'error');
    }
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'Operações (Eu)',
        role: 'Gestor ERP',
        text: chatInput,
        time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/operations/trips/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao eliminar viagem');
      showToast('Viagem removida com sucesso!', 'success');
      setDeletingTripId(null);
      fetchTripsData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao eliminar viagem', 'error');
    }
  };

  // Export PDF & Excel
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("N' Tandinho Transportes - Relatório de Viagens Logísticas", 14, 15);
    const tableData = filteredTrips.map(t => [
      t.trackingCode,
      t.driver?.name || 'N/A',
      t.vehicle?.plateNumber || 'N/A',
      t.distance ? `${t.distance} KM` : '0 KM',
      t.status,
      new Date(t.departure).toLocaleDateString('pt-PT')
    ]);
    autoTable(doc, {
      head: [['Código', 'Motorista', 'Camião', 'Distância', 'Estado', 'Partida']],
      body: tableData,
      startY: 20
    });
    doc.save('relatorio-viagens-ntandinho.pdf');
    showToast('Exportado PDF com sucesso!', 'info');
  };

  const exportToExcel = () => {
    const excelData = filteredTrips.map(t => ({
      Codigo: t.trackingCode,
      Motorista: t.driver?.name,
      Placa: t.vehicle?.plateNumber,
      DistanciaKM: t.distance,
      CustoCombustivel: t.fuelCost,
      OutrasDespesas: t.otherExpenses,
      Estado: t.status,
      DataPartida: new Date(t.departure).toLocaleDateString('pt-PT')
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Viagens");
    XLSX.writeFile(workbook, 'viagens-ntandinho.xlsx');
    showToast('Exportado Excel com sucesso!', 'info');
  };

  // Filter Logic
  const filteredTrips = trips.filter(t => {
    const matchesSearch = 
      t.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      t.driver?.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.vehicle?.plateNumber?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 tracking-wider uppercase">
            <Truck className="h-4 w-4 text-orange-500" />
            <span>Coração do ERP • Gestão de Expedição</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Gestão & Workflow de Viagens
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Acompanhamento de cotações, despachos, fronteiras e entregas da frota N' Tandinho.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* View Toggle Buttons (Table vs Kanban) */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Tabela"
            >
              <List size={16} />
              <span className="hidden sm:inline">Tabela</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'kanban' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Quadro Kanban"
            >
              <LayoutGrid size={16} />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          <button 
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
          >
            <Plus size={16} /> Nova Viagem
          </button>
        </div>
      </div>

      {/* Workflow Stepper Preview Header Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-xl">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Workflow Automático de Viagens (8 Etapas)
        </span>
        <div className="flex items-center justify-between min-w-[760px] gap-2">
          {WORKFLOW_STAGES.map((stage, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                <span>{stage}</span>
              </div>
              {idx < WORKFLOW_STAGES.length - 1 && (
                <ChevronRight className="h-4 w-4 text-slate-600 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Export */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Pesquisar por código, motorista ou matrícula..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400">
            <Filter size={14} className="text-orange-500" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Todos" className="bg-slate-900">Todas as Etapas</option>
              {WORKFLOW_STAGES.map((st, i) => (
                <option key={i} value={st} className="bg-slate-900">{st}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={exportToPDF}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            title="Exportar PDF"
          >
            <Download size={16} />
          </button>

          <button 
            onClick={exportToExcel}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            title="Exportar Excel"
          >
            <FileText size={16} />
          </button>
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <SkeletonTable />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/80">
                    <th className="p-4">Código / Tracking</th>
                    <th className="p-4">Motorista</th>
                    <th className="p-4">Veículo</th>
                    <th className="p-4">Partida</th>
                    <th className="p-4">Distância</th>
                    <th className="p-4">Etapa do Workflow</th>
                    <th className="p-4 text-right">Ações & Chat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {paginatedTrips.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                        Nenhuma viagem encontrada com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    paginatedTrips.map(trip => (
                      <tr key={trip.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-orange-400">
                          {trip.trackingCode}
                        </td>
                        <td className="p-4 font-semibold text-slate-200">
                          {trip.driver?.name || 'Motorista N\' Tandinho'}
                        </td>
                        <td className="p-4 font-mono text-slate-300">
                          {trip.vehicle?.plateNumber || 'Frota N/A'}
                        </td>
                        <td className="p-4 text-slate-400">
                          {new Date(trip.departure).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="p-4 font-mono text-slate-300">
                          {trip.distance ? `${trip.distance} KM` : '180 KM'}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-orange-950/80 text-orange-400 border border-orange-500/40">
                            <Clock size={12} />
                            {trip.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setActiveChatTrip(trip)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors"
                              title="Chat Interno da Viagem"
                            >
                              <MessageSquare size={14} />
                            </button>
                            <button
                              onClick={() => handleAdvanceStage(trip)}
                              className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                              title="Avançar para a próxima etapa do Workflow"
                            >
                              <CheckCircle size={12} />
                              Avançar
                            </button>
                            <button 
                              onClick={() => handleOpenModal(trip)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => setDeletingTripId(trip.id)}
                              className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-red-400 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              totalItems={filteredTrips.length}
            />
          )}
        </div>
      )}

      {/* VIEW 2: KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex items-start gap-4 overflow-x-auto pb-6 pt-2 min-h-[500px]">
          {WORKFLOW_STAGES.slice(0, 6).map((stage) => {
            const stageTrips = filteredTrips.filter(t => (t.status as string) === stage || (stage === 'Em viagem' && ((t.status as string) === 'Em Curso' || (t.status as string) === 'Em viagem')));
            return (
              <div 
                key={stage} 
                className="w-72 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shrink-0 flex flex-col justify-between space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-extrabold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    {stage}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {stageTrips.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[350px]">
                  {stageTrips.length === 0 ? (
                    <div className="p-6 text-center text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl">
                      Sem viagens nesta etapa.
                    </div>
                  ) : (
                    stageTrips.map(trip => (
                      <div 
                        key={trip.id}
                        className="p-3.5 bg-slate-950 border border-slate-800 hover:border-orange-500/50 rounded-xl space-y-2.5 transition-all shadow-md group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-orange-400">{trip.trackingCode}</span>
                          <button
                            onClick={() => handleAdvanceStage(trip)}
                            className="p-1 rounded bg-slate-800 hover:bg-emerald-950 text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Avançar Etapa"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>

                        <div className="text-xs space-y-1">
                          <p className="font-semibold text-white">{trip.driver?.name || 'Motorista N\' Tandinho'}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{trip.vehicle?.plateNumber || 'Camião N/A'}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                          <span>{new Date(trip.departure).toLocaleDateString('pt-PT')}</span>
                          <button onClick={() => setActiveChatTrip(trip)} className="text-blue-400 hover:underline flex items-center gap-1">
                            <MessageSquare size={10} /> Chat
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Chat Interno da Viagem */}
      {activeChatTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare size={16} className="text-orange-500" />
                  Chat Interno: Viagem {activeChatTrip.trackingCode}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Operações • Motorista • Comercial • Financeiro</p>
              </div>
              <button onClick={() => setActiveChatTrip(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="h-64 overflow-y-auto space-y-3 p-2 bg-slate-950 rounded-xl border border-slate-800/80">
              {chatMessages.map((msg, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-orange-400 flex items-center gap-1">
                      <User size={10} /> {msg.sender}
                    </span>
                    <span className="text-slate-500 font-mono">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Escreva uma mensagem ou nota para a expedição..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              />
              <button 
                onClick={handleSendChatMessage}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold p-2 rounded-xl text-xs transition-all shadow"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Formulário Moderno de Nova Viagem */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck size={18} className="text-orange-500" />
                {editingTrip ? 'Editar Dados da Viagem' : 'Formulário de Nova Viagem / Despacho'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={e => handleSubmit(e, false)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Cliente Corporativo *</label>
                  <input 
                    type="text" 
                    value={formData.clientName}
                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Motorista Atribuído *</label>
                  <select 
                    value={formData.driverId}
                    onChange={e => setFormData({ ...formData, driverId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none cursor-pointer"
                  >
                    <option value="">Selecione um Motorista</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                    ))}
                  </select>
                  {errors.driverId && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.driverId}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Camião da Frota *</label>
                  <select 
                    value={formData.vehicleId}
                    onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none cursor-pointer"
                  >
                    <option value="">Selecione um Camião</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.plateNumber} - {v.brand} {v.model}</option>
                    ))}
                  </select>
                  {errors.vehicleId && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.vehicleId}</span>}
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Etapa Inicial do Workflow</label>
                  <select 
                    value={formData.workflowStage}
                    onChange={e => setFormData({ ...formData, workflowStage: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none cursor-pointer font-bold text-orange-400"
                  >
                    {WORKFLOW_STAGES.map((st, i) => (
                      <option key={i} value={st} className="bg-slate-900 text-white">{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Local de Origem *</label>
                  <input 
                    type="text" 
                    value={formData.origin}
                    onChange={e => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Local de Destino *</label>
                  <input 
                    type="text" 
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Tipo de Carga</label>
                  <input 
                    type="text" 
                    value={formData.cargoType}
                    onChange={e => setFormData({ ...formData, cargoType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Peso Estimado</label>
                  <input 
                    type="text" 
                    value={formData.cargoWeight}
                    onChange={e => setFormData({ ...formData, cargoWeight: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Valor do Frete (MZN)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none font-bold text-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Data Partida *</label>
                  <input 
                    type="date" 
                    value={formData.departure}
                    onChange={e => setFormData({ ...formData, departure: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Hora Estimada</label>
                  <input 
                    type="time" 
                    value={formData.departureTime}
                    onChange={e => setFormData({ ...formData, departureTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">KM Previstos</label>
                  <input 
                    type="number" 
                    value={formData.distance}
                    onChange={e => setFormData({ ...formData, distance: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Observações & Documentos Emitidos</label>
                <textarea 
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancelar
                </button>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    type="submit" 
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700"
                  >
                    Guardar Rascunho
                  </button>
                  <button 
                    type="button"
                    onClick={e => handleSubmit(e as any, true)} 
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg shadow-orange-600/20 flex items-center justify-center gap-1.5"
                  >
                    <Play size={14} /> Iniciar Viagem
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirmar Exclusão */}
      {deletingTripId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Confirmar Exclusão</h3>
              <p className="text-xs text-slate-400 mt-1">Deseja realmente cancelar e eliminar este registo de viagem?</p>
            </div>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setDeletingTripId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deletingTripId)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500"
              >
                Eliminar Viagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
