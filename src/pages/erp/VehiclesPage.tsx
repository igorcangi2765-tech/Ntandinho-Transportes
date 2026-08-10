import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  Wrench, 
  Download, 
  Edit2, 
  Trash2, 
  X, 
  AlertTriangle, 
  Eye,
  MapPin,
  Fuel,
  Activity
} from 'lucide-react';
import { Vehicle } from '../../types/index.js';
import { FleetMapVehicle } from '../../types/dashboard.types.js';
import { SkeletonCard } from '../../components/ui/SkeletonLoader.js';
import { Pagination } from '../../components/ui/Pagination.js';
import { useToast } from '../../context/ToastContext.js';
import { OperationalMapSection } from '../../components/dashboard/OperationalMap.js';
import { z } from 'zod';

const vehicleSchema = z.object({
  plateNumber: z.string().min(3, 'Placa é obrigatória'),
  brand: z.string().min(2, 'Marca é obrigatória'),
  model: z.string().min(2, 'Modelo é obrigatório'),
  year: z.number().min(2000).max(2030),
  capacity: z.string().min(2, 'Capacidade é obrigatória'),
  fuelType: z.string().default('Diesel'),
  currentKm: z.number().min(0),
  status: z.enum(['Disponivel', 'Em Viagem', 'Manutencao', 'Inativo']),
  photo: z.string().optional()
});

export const VehiclesPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'fleet';

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    plateNumber: '',
    brand: '',
    model: '',
    year: 2023,
    capacity: '34 Toneladas',
    fuelType: 'Diesel',
    currentKm: 0,
    status: 'Disponivel' as const,
    photo: '/assets/Trans_Ntandinho (1)-jvI6WQC_.jpeg'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/operations/vehicles');
      const data = await res.json();
      if (Array.isArray(data)) setVehicles(data);
    } catch (err) {
      showToast('Erro ao carregar veículos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (veh?: Vehicle) => {
    setErrors({});
    if (veh) {
      setEditingVehicle(veh);
      setFormData({
        plateNumber: veh.plateNumber,
        brand: veh.brand,
        model: veh.model,
        year: veh.year,
        capacity: veh.capacity,
        fuelType: veh.fuelType || 'Diesel',
        currentKm: veh.currentKm,
        status: veh.status as any,
        photo: veh.photo || '/assets/Trans_Ntandinho (1)-jvI6WQC_.jpeg'
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        plateNumber: '',
        brand: '',
        model: '',
        year: 2023,
        capacity: '34 Toneladas',
        fuelType: 'Diesel',
        currentKm: 0,
        status: 'Disponivel',
        photo: '/assets/Trans_Ntandinho (1)-jvI6WQC_.jpeg'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = vehicleSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) formattedErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(formattedErrors);
      showToast('Por favor, corrija os erros do formulário.', 'error');
      return;
    }

    try {
      const url = editingVehicle 
        ? `/api/operations/vehicles/${editingVehicle.id}`
        : '/api/operations/vehicles';
      const method = editingVehicle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Falha ao salvar veículo');

      showToast(
        editingVehicle ? 'Veículo atualizado com sucesso!' : 'Novo veículo cadastrado com sucesso!', 
        'success'
      );
      setIsModalOpen(false);
      fetchVehicles();
    } catch (err: any) {
      showToast(err.message || 'Erro ao processar solicitação', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/operations/vehicles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao eliminar veículo');
      showToast('Veículo removido com sucesso!', 'success');
      setDeletingVehicleId(null);
      fetchVehicles();
    } catch (err: any) {
      showToast(err.message || 'Erro ao eliminar veículo', 'error');
    }
  };

  // Filter Logic
  const filteredVehicles = vehicles.filter(veh => {
    const matchesSearch = 
      veh.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      veh.brand.toLowerCase().includes(search.toLowerCase()) ||
      veh.model.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || veh.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const setTab = (tabName: string) => {
    setSearchParams({ tab: tabName });
  };

  const telemetryMapVehicles: FleetMapVehicle[] = vehicles.map((v, i) => ({
    id: v.id,
    plateNumber: v.plateNumber,
    brand: v.brand,
    model: v.model,
    capacity: v.capacity,
    status: v.status,
    mapStatus: (v.status === 'Em Viagem' ? 'in_transit' : v.status === 'Manutencao' ? 'issue' : 'stopped') as any,
    driverName: `Motorista ${i + 1}`,
    currentKm: v.currentKm,
    origin: 'Nampula Central',
    destination: v.status === 'Em Viagem' ? 'Corredor Nacala' : "Pátio N'Tandinho",
    speed: v.status === 'Em Viagem' ? `${70 + (i * 3) % 25} km/h` : '0 km/h',
    ignition: v.status === 'Em Viagem' ? 'ON' : 'OFF',
    lastPing: `${(i * 2) % 10}m atrás`,
    lat: -15.1167 + (i * 0.12),
    lng: 39.2667 + (i * 0.18),
    tripCode: v.status === 'Em Viagem' ? `TRN-2026-0${i + 1}` : null
  }));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 tracking-wider uppercase">
            <Truck className="h-4 w-4 text-orange-500" />
            <span>Módulo de Frota & Logística Pesada</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Gestão da Frota & Telemetria
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitorização de camiões Volvo e Scania, cadastro de reboques, telemetria GPS e manutenção.
          </p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus size={16} /> Cadastrar Novo Veículo
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setTab('fleet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            activeTab === 'fleet'
              ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
          }`}
        >
          <Truck size={16} />
          <span>Frota de Veículos ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setTab('telemetry')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            activeTab === 'telemetry'
              ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
          }`}
        >
          <MapPin size={16} />
          <span>Telemetria GPS Live</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        <button
          onClick={() => setTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            activeTab === 'maintenance'
              ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
          }`}
        >
          <Wrench size={16} />
          <span>Oficina & Manutenção</span>
        </button>

        <button
          onClick={() => setTab('fuel')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            activeTab === 'fuel'
              ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
          }`}
        >
          <Fuel size={16} />
          <span>Controlo de Combustível</span>
        </button>
      </div>

      {/* TAB CONTENT 1: Telemetry GPS Live */}
      {activeTab === 'telemetry' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Sincronização Ativa de Satélite GPS (Corredores Nacala, Beira & Maputo)</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">100% Online</span>
          </div>
          <OperationalMapSection vehicles={telemetryMapVehicles} />
        </div>
      )}

      {/* TAB CONTENT 2: Maintenance */}
      {activeTab === 'maintenance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="text-orange-500" size={18} />
              Ordens de Serviço & Manutenção Preventiva
            </h3>
            <span className="text-xs text-slate-400">Oficina N' Tandinho</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Em Oficina</span>
              <div className="text-2xl font-bold text-red-400">2 Veículos</div>
              <p className="text-[11px] text-slate-400">Troca de pastilhas de travão e calibração de injetores.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Inspeção Periódica</span>
              <div className="text-2xl font-bold text-amber-400">4 Agendadas</div>
              <p className="text-[11px] text-slate-400">Inspeções de rotina previstas para esta semana.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Operacionais sem Alerta</span>
              <div className="text-2xl font-bold text-emerald-400">{vehicles.length > 2 ? vehicles.length - 2 : 8} Camiões</div>
              <p className="text-[11px] text-slate-400">Frota pronta para carregamento imediato.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Fuel */}
      {activeTab === 'fuel' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Fuel className="text-amber-500" size={18} />
              Gestão de Combustível & Abastecimentos
            </h3>
            <span className="text-xs text-slate-400">Média de Consumo: 38.5 L/100km</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Consumo Total do Mês</span>
              <div className="text-2xl font-bold text-white">14.850 Litros</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Custo Total de Diesel (MZN)</span>
              <div className="text-2xl font-bold text-orange-400">1.262.250,00 MZN</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: Fleet Cards & Table */}
      {activeTab === 'fleet' && (
        <>
          {/* Filters & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar por placa, marca ou modelo..."
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
                  <option value="Todos" className="bg-slate-900">Todos os Status</option>
                  <option value="Disponivel" className="bg-slate-900">Disponível</option>
                  <option value="Em Viagem" className="bg-slate-900">Em Viagem</option>
                  <option value="Manutencao" className="bg-slate-900">Em Manutenção</option>
                </select>
              </div>

              <button 
                onClick={() => showToast('Relatório de frota exportado com sucesso!', 'info')}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
                title="Exportar Frota em Excel/PDF"
              >
                <Download size={16} />
              </button>
            </div>
          </div>

          {/* Grid View */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : paginatedVehicles.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Truck size={48} className="mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-white">Nenhum veículo encontrado</h3>
              <p className="text-xs text-slate-400">Ajuste os filtros de pesquisa ou cadastre um novo camião na frota.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedVehicles.map(veh => (
                <div 
                  key={veh.id} 
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    {/* Image Header */}
                    <div className="h-40 bg-slate-950 relative overflow-hidden">
                      <img 
                        src={veh.photo || '/assets/Trans_Ntandinho (1)-jvI6WQC_.jpeg'} 
                        alt={veh.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', '/assets/Trans_Ntandinho (1)-jvI6WQC_.jpeg');
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shadow-md ${
                          veh.status === 'Disponivel' 
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' 
                            : veh.status === 'Em Viagem'
                            ? 'bg-orange-950/80 text-orange-400 border-orange-500/40'
                            : 'bg-red-950/80 text-red-400 border-red-500/40'
                        }`}>
                          {veh.status}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div>
                          <span className="text-xs font-mono font-bold text-orange-400 bg-slate-950/90 px-2 py-0.5 rounded border border-orange-500/30">
                            {veh.plateNumber}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1 leading-tight">{veh.brand} {veh.model}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Capacidade</span>
                          <span className="font-bold text-slate-200">{veh.capacity}</span>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Quilometragem</span>
                          <span className="font-bold text-slate-200">{veh.currentKm.toLocaleString()} KM</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span>Ano de Fabrico: <strong className="text-slate-200">{veh.year}</strong></span>
                        <span>Combustível: <strong className="text-slate-200">{veh.fuelType || 'Diesel'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between gap-2">
                    <button 
                      onClick={() => setViewingVehicle(veh)}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye size={14} /> Ficha Técnica
                    </button>
                    <button 
                      onClick={() => handleOpenModal(veh)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-xl transition-colors"
                      title="Editar Veículo"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => setDeletingVehicleId(veh.id)}
                      className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-red-400 rounded-xl transition-colors"
                      title="Eliminar Veículo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              totalItems={filteredVehicles.length}
            />
          )}
        </>
      )}

      {/* MODAL: Ficha Técnica do Veículo */}
      {viewingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck size={18} className="text-orange-500" />
                Ficha Técnica: {viewingVehicle.plateNumber}
              </h3>
              <button onClick={() => setViewingVehicle(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Marca / Modelo:</span>
                <span className="font-bold text-white">{viewingVehicle.brand} {viewingVehicle.model}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Ano:</span>
                <span className="font-bold text-white">{viewingVehicle.year}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Capacidade:</span>
                <span className="font-bold text-white">{viewingVehicle.capacity}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Quilometragem:</span>
                <span className="font-bold text-white">{viewingVehicle.currentKm.toLocaleString()} KM</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Status Operacional:</span>
                <span className="font-bold text-orange-400">{viewingVehicle.status}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button 
                onClick={() => setViewingVehicle(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Criar / Editar Veículo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck size={18} className="text-orange-500" />
                {editingVehicle ? 'Editar Veículo da Frota' : 'Cadastrar Novo Veículo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Matrícula / Placa *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: ABC-123-MC"
                    value={formData.plateNumber}
                    onChange={e => setFormData({ ...formData, plateNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                  {errors.plateNumber && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.plateNumber}</span>}
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Marca *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Volvo, Scania"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                  {errors.brand && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.brand}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Modelo *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: FH 540, R 450"
                    value={formData.model}
                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                  {errors.model && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.model}</span>}
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Ano *</label>
                  <input 
                    type="number" 
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Capacidade de Carga *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 34 Toneladas"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Status Atual</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none cursor-pointer"
                  >
                    <option value="Disponivel">Disponível</option>
                    <option value="Em Viagem">Em Viagem</option>
                    <option value="Manutencao">Em Manutenção</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-600/20"
                >
                  {editingVehicle ? 'Salvar Alterações' : 'Cadastrar Veículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirmar Exclusão */}
      {deletingVehicleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Confirmar Exclusão</h3>
              <p className="text-xs text-slate-400 mt-1">Deseja realmente remover este veículo da frota N' Tandinho?</p>
            </div>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setDeletingVehicleId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deletingVehicleId)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500"
              >
                Eliminar Veículo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
