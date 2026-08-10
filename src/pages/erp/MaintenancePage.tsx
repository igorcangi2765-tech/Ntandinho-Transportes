import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { Wrench, Plus, Search, Filter, AlertTriangle, X } from 'lucide-react';
import { SkeletonTable } from '../../components/ui/SkeletonLoader.js';

export const MaintenancePage: FC = () => {
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'Troca de Óleo',
    description: '',
    cost: 15000,
    garage: 'Oficina Central Nampula',
    status: 'Em Progresso'
  });

  const fetchMaintenances = async () => {
    setLoading(true);
    try {
      const [mRes, vRes] = await Promise.all([
        fetch('/api/operations/maintenance').then(r => r.json()).catch(() => []),
        fetch('/api/operations/vehicles').then(r => r.json()).catch(() => [])
      ]);
      if (Array.isArray(mRes)) setMaintenances(mRes);
      if (Array.isArray(vRes)) setVehicles(vRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/operations/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setIsModalOpen(false);
    fetchMaintenances();
  };

  const filtered = maintenances.filter(m => {
    const q = search.toLowerCase();
    const matchesSearch = m.vehicle?.plateNumber?.toLowerCase().includes(q) ||
      m.description?.toLowerCase().includes(q) ||
      m.garage?.toLowerCase().includes(q);
    const matchesType = filterType === 'Todos' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const maintenanceTypes = ['Troca de Óleo', 'Pneus', 'Travões', 'Motor', 'Seguro', 'Inspeção'];

  const automaticAlerts = [
    { id: 1, vehicle: 'AF-452 (Volvo FH16)', alert: 'Troca de Óleo recomendada aos 150.000 KM (Faltam 500 KM)', severity: 'warning' },
    { id: 2, vehicle: 'AF-789 (Scania R500)', alert: 'Validade do Seguro de Carga expira em 12 dias (17/08/2026)', severity: 'danger' },
    { id: 3, vehicle: 'AF-102 (Mercedes Actros)', alert: 'Inspeção Periódica Agendada para a próxima semana', severity: 'info' }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1628] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Wrench className="text-[#F5A300]" />
            <span>Gestão de Manutenção & Alertas Automáticos</span>
          </h1>
          <p className="text-[#A5B4C7] text-xs mt-1">
            Plano preventivo, reparações corretivas, peças de desgaste (óleo, pneus, travões, motor) e seguros.
          </p>
        </div>

        <button 
          onClick={() => {
            setFormData({ vehicleId: vehicles[0]?.id || '', type: 'Troca de Óleo', description: '', cost: 15000, garage: 'Oficina Central Nampula', status: 'Em Progresso' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-extrabold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Registar Manutenção</span>
        </button>
      </div>

      {/* AUTOMATIC ALERTS BANNER */}
      <div className="bg-[#0D1628] p-5 rounded-2xl border border-white/5 space-y-3">
        <h3 className="text-xs font-bold text-[#F5A300] uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>Alertas Automáticos do Sistema N' Tandinho</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {automaticAlerts.map(alt => (
            <div 
              key={alt.id}
              className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                alt.severity === 'danger'
                  ? 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
                  : alt.severity === 'warning'
                  ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}
            >
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">{alt.vehicle}</strong>
                <span className="text-[11px] text-[#A5B4C7]">{alt.alert}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D1628] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5B4C7]" />
          <input 
            type="text"
            placeholder="Pesquisar por placa, descrição ou oficina..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#060B17] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-[#A5B4C7]/50 focus:border-[#F5A300] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-[#A5B4C7]" />
          <span className="text-xs text-[#A5B4C7]">Tipo:</span>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-[#060B17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#F5A300] focus:outline-none"
          >
            <option value="Todos">Todos os Tipos</option>
            {maintenanceTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
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
                  <th className="p-4">Veículo / Placa</th>
                  <th className="p-4">Tipo de Manutenção</th>
                  <th className="p-4">Descrição</th>
                  <th className="p-4">Oficina / Garagem</th>
                  <th className="p-4">Custo Total</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(m => (
                  <tr key={m.id} className="hover:bg-[#13203A] transition-colors">
                    <td className="p-4 font-bold text-white">
                      {m.vehicle?.brand} ({m.vehicle?.plateNumber})
                    </td>
                    <td className="p-4 font-semibold text-[#F5A300]">{m.type}</td>
                    <td className="p-4 text-white">{m.description}</td>
                    <td className="p-4">{m.garage || 'Oficina Central'}</td>
                    <td className="p-4 font-bold text-emerald-400">
                      {m.cost?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                    </td>
                    <td className="p-4 font-mono">{new Date(m.date).toLocaleDateString('pt-MZ')}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        m.status === 'Concluido'
                          ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
                          : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1628] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-white">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-[#A5B4C7] hover:text-white">
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold">Registar Manutenção da Frota</h2>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A5B4C7]">Selecionar Veículo *</label>
                <select
                  value={formData.vehicleId}
                  onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                >
                  <option value="">Selecione o veículo...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plateNumber})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A5B4C7]">Tipo de Manutenção</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                  >
                    {maintenanceTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A5B4C7]">Custo Estimado (MZN)</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
                    className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A5B4C7]">Descrição do Serviço</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Substituição de filtros e óleo sintético Mobil"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A5B4C7]">Oficina / Garagem</label>
                <input
                  type="text"
                  value={formData.garage}
                  onChange={e => setFormData({ ...formData, garage: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#13203A] text-[#A5B4C7] rounded-xl text-xs">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-bold rounded-xl text-xs">
                  Guardar Manutenção
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
