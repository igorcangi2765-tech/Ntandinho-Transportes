import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useErpStore } from '../../shared/stores/useErpStore';
import { Modal } from './Modal';
import { Search, Truck, Building2, User, FileText } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { trips, customers, vehicles, drivers, invoices, documents } = useErpStore();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectResult = (path: string) => {
    navigate(path);
    onClose();
  };

  const q = query.toLowerCase().trim();

  const matchingTrips = trips.filter(
    (t) =>
      t.tripNumber.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.vehiclePlate.toLowerCase().includes(q)
  );

  const matchingCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(q) || c.nuit.includes(q) || c.email.toLowerCase().includes(q)
  );

  const matchingVehicles = vehicles.filter(
    (v) => v.plateNumber.toLowerCase().includes(q) || v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
  );

  const matchingDrivers = drivers.filter(
    (d) => d.name.toLowerCase().includes(q) || d.licenseNumber.toLowerCase().includes(q)
  );

  const matchingInvoices = invoices.filter(
    (i) => i.invoiceNumber.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q)
  );

  const matchingDocs = documents.filter(
    (d) => d.title.toLowerCase().includes(q) || d.docNumber.toLowerCase().includes(q)
  );

  const totalResults =
    matchingTrips.length +
    matchingCustomers.length +
    matchingVehicles.length +
    matchingDrivers.length +
    matchingInvoices.length +
    matchingDocs.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pesquisa Global no ERP (Ctrl+K)" subtitle="Encontre viagens (NT-1024), clientes, camiões, faturas e documentos" maxWidth="lg">
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite para pesquisar em tempo real por referências, NUIT, matrículas de camiões e clientes..."
            autoFocus
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
          />
        </div>

        {/* Results Body */}
        {q.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Comece a ditar para pesquisar em tempo real por referências, NUIT, matrículas de camiões e clientes.
          </div>
        ) : totalResults === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Nenhum resultado encontrado para "{query}".
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
            {/* Viagens */}
            {matchingTrips.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Truck size={12} className="text-brand-orange" /> Viagens Operacionais ({matchingTrips.length})
                </span>
                <div className="space-y-1">
                  {matchingTrips.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectResult('/operations?tab=trips')}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex justify-between items-center hover:border-brand-orange/60 hover:bg-slate-900 cursor-pointer transition-all"
                    >
                      <div>
                        <span className="font-bold text-brand-orange mr-2">{t.tripNumber}</span>
                        <span className="text-white font-medium">{t.customerName}</span>
                        <span className="text-slate-400 block text-[11px]">{t.origin} ➔ {t.destination} ({t.vehiclePlate})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400">{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clientes */}
            {matchingCustomers.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Building2 size={12} className="text-brand-orange" /> Clientes ({matchingCustomers.length})
                </span>
                <div className="space-y-1">
                  {matchingCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectResult('/crm?tab=customers')}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex justify-between items-center hover:border-brand-orange/60 hover:bg-slate-900 cursor-pointer transition-all"
                    >
                      <div>
                        <span className="font-bold text-white block">{c.name}</span>
                        <span className="text-slate-400 text-[11px]">NUIT: {c.nuit} • {c.email}</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">{c.totalSpentMzn.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Viaturas */}
            {matchingVehicles.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Truck size={12} className="text-brand-orange" /> Viaturas ({matchingVehicles.length})
                </span>
                <div className="space-y-1">
                  {matchingVehicles.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => handleSelectResult('/fleet?tab=vehicles')}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex justify-between items-center hover:border-brand-orange/60 hover:bg-slate-900 cursor-pointer transition-all"
                    >
                      <div>
                        <span className="font-bold font-mono text-brand-orange mr-2">{v.plateNumber}</span>
                        <span className="text-white font-medium">{v.make} {v.model} ({v.year})</span>
                      </div>
                      <span className="text-slate-300 font-mono">{v.mileageKm.toLocaleString('pt-MZ')} km</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motoristas */}
            {matchingDrivers.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} className="text-brand-orange" /> Motoristas ({matchingDrivers.length})
                </span>
                <div className="space-y-1">
                  {matchingDrivers.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => handleSelectResult('/drivers-team?tab=drivers')}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex justify-between items-center hover:border-brand-orange/60 hover:bg-slate-900 cursor-pointer transition-all"
                    >
                      <div>
                        <span className="font-bold text-white block">{d.name}</span>
                        <span className="text-slate-400 text-[11px]">Carta: {d.licenseNumber} • Visto SADC: {d.sadcVisaExpDate}</span>
                      </div>
                      <span className="text-sky-400 font-bold">{d.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Faturas */}
            {matchingInvoices.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText size={12} className="text-brand-orange" /> Faturas ({matchingInvoices.length})
                </span>
                <div className="space-y-1">
                  {matchingInvoices.map((i) => (
                    <div
                      key={i.id}
                      onClick={() => handleSelectResult('/finance?tab=invoices')}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex justify-between items-center hover:border-brand-orange/60 hover:bg-slate-900 cursor-pointer transition-all"
                    >
                      <div>
                        <span className="font-bold text-brand-orange mr-2">{i.invoiceNumber}</span>
                        <span className="text-white font-medium">{i.customerName}</span>
                      </div>
                      <span className="text-emerald-400 font-bold">{i.totalAmount.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
