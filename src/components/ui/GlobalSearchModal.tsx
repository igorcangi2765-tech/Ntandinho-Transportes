import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Truck, Building2, FileText, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    trips: any[];
    vehicles: any[];
    drivers: any[];
    clients: any[];
    invoices: any[];
    bookings: any[];
  }>({
    trips: [],
    vehicles: [],
    drivers: [],
    clients: [],
    invoices: [],
    bookings: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          const searchBtn = document.getElementById('global-search-btn');
          searchBtn?.click();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ trips: [], vehicles: [], drivers: [], clients: [], invoices: [], bookings: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [tripsRes, vehiclesRes, driversRes, clientsRes, invoicesRes, bookingsRes] = await Promise.all([
          fetch('/api/operations/trips').then(r => r.json()).catch(() => []),
          fetch('/api/operations/vehicles').then(r => r.json()).catch(() => []),
          fetch('/api/operations/drivers').then(r => r.json()).catch(() => []),
          fetch('/api/operations/clients').then(r => r.json()).catch(() => []),
          fetch('/api/financial/invoices').then(r => r.json()).catch(() => []),
          fetch('/api/operations/bookings').then(r => r.json()).catch(() => [])
        ]);

        const q = query.toLowerCase();

        const filteredTrips = Array.isArray(tripsRes) ? tripsRes.filter((t: any) => 
          t.trackingCode?.toLowerCase().includes(q) || t.driver?.name?.toLowerCase().includes(q) || t.vehicle?.plateNumber?.toLowerCase().includes(q)
        ).slice(0, 3) : [];

        const filteredVehicles = Array.isArray(vehiclesRes) ? vehiclesRes.filter((v: any) => 
          v.plateNumber?.toLowerCase().includes(q) || v.brand?.toLowerCase().includes(q) || v.model?.toLowerCase().includes(q)
        ).slice(0, 3) : [];

        const filteredDrivers = Array.isArray(driversRes) ? driversRes.filter((d: any) => 
          d.name?.toLowerCase().includes(q) || d.phone?.toLowerCase().includes(q) || d.licenseNumber?.toLowerCase().includes(q)
        ).slice(0, 3) : [];

        const filteredClients = Array.isArray(clientsRes) ? clientsRes.filter((c: any) => 
          c.companyName?.toLowerCase().includes(q) || c.contactPerson?.toLowerCase().includes(q) || c.nuit?.toLowerCase().includes(q)
        ).slice(0, 3) : [];

        const filteredInvoices = Array.isArray(invoicesRes) ? invoicesRes.filter((i: any) => 
          i.invoiceNumber?.toLowerCase().includes(q) || i.client?.companyName?.toLowerCase().includes(q)
        ).slice(0, 3) : [];

        const filteredBookings = Array.isArray(bookingsRes) ? bookingsRes.filter((b: any) => 
          b.pickupLocation?.toLowerCase().includes(q) || b.destination?.toLowerCase().includes(q) || b.cargoDescription?.toLowerCase().includes(q)
        ).slice(0, 3) : [];

        setResults({
          trips: filteredTrips,
          vehicles: filteredVehicles,
          drivers: filteredDrivers,
          clients: filteredClients,
          invoices: filteredInvoices,
          bookings: filteredBookings
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  const hasResults = results.trips.length > 0 || results.vehicles.length > 0 || results.drivers.length > 0 || 
                     results.clients.length > 0 || results.invoices.length > 0 || results.bookings.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-[#0D1628] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#08101F]">
              <Search size={20} className="text-[#F5A300] shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Pesquisar viagens, veículos, motoristas, clientes, facturas, solicitações..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-[#A5B4C7] focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-[#A5B4C7] hover:text-white p-1">
                  <X size={16} />
                </button>
              )}
              <button onClick={onClose} className="px-2 py-1 rounded bg-[#13203A] text-xs text-[#A5B4C7] hover:text-white">
                ESC
              </button>
            </div>

            {/* Results Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading && (
                <div className="py-8 text-center text-xs text-[#A5B4C7]">
                  A pesquisar em tempo real...
                </div>
              )}

              {!loading && !query && (
                <div className="py-8 text-center space-y-2">
                  <p className="text-xs text-[#A5B4C7]">Digite termos como o nome do cliente, placa do veículo, código de rastreio ou número de factura.</p>
                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#A5B4C7]">
                    <span className="px-2 py-0.5 rounded bg-[#13203A] border border-white/5">Ex: Nacala</span>
                    <span className="px-2 py-0.5 rounded bg-[#13203A] border border-white/5">Ex: AF-452</span>
                    <span className="px-2 py-0.5 rounded bg-[#13203A] border border-white/5">Ex: FT-2026</span>
                  </div>
                </div>
              )}

              {!loading && query && !hasResults && (
                <div className="py-8 text-center text-xs text-[#A5B4C7]">
                  Nenhum resultado encontrado para "<span className="text-white font-semibold">{query}</span>".
                </div>
              )}

              {!loading && hasResults && (
                <div className="space-y-4">
                  {/* Viagens */}
                  {results.trips.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-[#F5A300] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Truck size={14} /> Viagens
                      </div>
                      <div className="space-y-1">
                        {results.trips.map(t => (
                          <div
                            key={t.id}
                            onClick={() => handleSelect('/admin/operacoes/viagens')}
                            className="p-2.5 rounded-xl bg-[#13203A]/50 hover:bg-[#13203A] border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div>
                              <span className="text-xs font-bold text-[#F5A300]">{t.trackingCode}</span>
                              <span className="text-xs text-white ml-2">{t.driver?.name} • {t.vehicle?.plateNumber}</span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] font-semibold">{t.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Veículos */}
                  {results.vehicles.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Truck size={14} /> Veículos da Frota
                      </div>
                      <div className="space-y-1">
                        {results.vehicles.map(v => (
                          <div
                            key={v.id}
                            onClick={() => handleSelect('/admin/frota/viaturas')}
                            className="p-2.5 rounded-xl bg-[#13203A]/50 hover:bg-[#13203A] border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div>
                              <span className="text-xs font-bold text-white">{v.brand} {v.model}</span>
                              <span className="text-xs text-[#A5B4C7] ml-2">({v.plateNumber}) • {v.capacity}</span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold">{v.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clientes */}
                  {results.clients.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Building2 size={14} /> Clientes Corporativos
                      </div>
                      <div className="space-y-1">
                        {results.clients.map(c => (
                          <div
                            key={c.id}
                            onClick={() => handleSelect('/admin/clientes')}
                            className="p-2.5 rounded-xl bg-[#13203A]/50 hover:bg-[#13203A] border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div>
                              <span className="text-xs font-bold text-white">{c.companyName}</span>
                              <span className="text-xs text-[#A5B4C7] ml-2">Contacto: {c.contactPerson}</span>
                            </div>
                            <span className="text-xs text-[#A5B4C7]">{c.city}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Facturas */}
                  {results.invoices.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText size={14} /> Facturas
                      </div>
                      <div className="space-y-1">
                        {results.invoices.map(i => (
                          <div
                            key={i.id}
                            onClick={() => handleSelect('/admin/financeiro/facturas')}
                            className="p-2.5 rounded-xl bg-[#13203A]/50 hover:bg-[#13203A] border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div>
                              <span className="text-xs font-bold text-emerald-400">{i.invoiceNumber}</span>
                              <span className="text-xs text-white ml-2">{i.client?.companyName}</span>
                            </div>
                            <span className="text-xs font-bold text-white">{i.totalAmount?.toLocaleString('pt-MZ')} MZN</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer helper */}
            <div className="p-3 border-t border-white/10 bg-[#08101F] text-[11px] text-[#A5B4C7] flex items-center justify-between">
              <span>Navegue com clique direto nos resultados</span>
              <span className="flex items-center gap-1">
                Pressione <CornerDownLeft size={12} /> para selecionar
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
