import React, { useState } from 'react';
import { Truck, Plus, ShieldCheck, Wrench, Fuel, UserCheck, MapPin, X, AlertTriangle } from 'lucide-react';
import { TripManagement } from './fleet/TripManagement';
import { DriverAssignmentModal } from '../components/fleet/DriverAssignmentModal';
import { NewVehicleModal } from '../components/fleet/NewVehicleModal';
import { DriverDocAlertsModal } from '../components/fleet/DriverDocAlertsModal';
import { FuelManagementModal } from '../components/fleet/FuelManagementModal';
import { TyreMaintenanceModal } from '../components/fleet/TyreMaintenanceModal';
import { PageHeader } from '../shared/layouts/PageHeader';
import { RowActionsDropdown } from '../shared/components/ui/RowActionsDropdown';
import { useErpStore } from '../shared/stores/useErpStore';

interface VehicleModalData {
  plate: string;
  model: string;
  make: string;
  driver: string;
  km: string;
  status: string;
}

export const FleetPage: React.FC = () => {
  const { vehicles, drivers } = useErpStore();
  const [activeTab, setActiveTab] = useState<'trips' | 'vehicles' | 'drivers'>('trips');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showNewVehicleModal, setShowNewVehicleModal] = useState(false);

  // New Operational Modals State
  const [showDriverDocAlerts, setShowDriverDocAlerts] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showTyreMaintenanceModal, setShowTyreMaintenanceModal] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModalData | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<{ name: string; license: string; phone: string; status: string } | null>(null);

  const expiringDriversCount = drivers.filter((d) => d.docStatus === 'ALERTA_EXPIRACAO').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Gestão de Frota & Operações de Viagem"
        subtitle="Alocação de camiões, credenciamento de motoristas e acompanhamento de rotas Nacionais & SADC."
        icon={Truck}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowDriverDocAlerts(true)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs rounded-xl border border-amber-500/30 transition-all cursor-pointer"
            >
              <AlertTriangle size={14} />
              <span>Documentos ({expiringDriversCount} Alertas)</span>
            </button>

            <button
              onClick={() => setShowFuelModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <Fuel size={14} className="text-amber-400" />
              <span>Abastecimentos</span>
            </button>

            <button
              onClick={() => setShowTyreMaintenanceModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <Wrench size={14} className="text-brand-orange" />
              <span>Manutenção & Pneus</span>
            </button>

            <button
              onClick={() => setShowNewVehicleModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Novo Camião</span>
            </button>

            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-brand-orange to-amber-600 hover:from-brand-orange-hover hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus size={16} />
              <span>Alocar Camião & Motorista</span>
            </button>
          </div>
        }
      />

      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('trips')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'trips'
              ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30 shadow-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <MapPin size={16} />
          <span>Viagens & Despacho</span>
        </button>

        <button
          onClick={() => setActiveTab('vehicles')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'vehicles'
              ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30 shadow-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Truck size={16} />
          <span>Frota de Camiões ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drivers')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'drivers'
              ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30 shadow-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <UserCheck size={16} />
          <span>Motoristas Credenciados ({drivers.length})</span>
        </button>
      </div>

      {activeTab === 'trips' ? (
        <TripManagement />
      ) : activeTab === 'vehicles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-slate-800 text-brand-orange px-2 py-0.5 rounded border border-slate-700">
                    {v.plateNumber}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{v.make} {v.model}</h3>
                  <p className="text-xs text-slate-400 font-mono">Ano: {v.year}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full font-semibold text-xs border ${
                    v.status === 'OPERACIONAL'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : v.status === 'EM_VIAGEM'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {v.status === 'OPERACIONAL' ? 'Operacional' : v.status === 'EM_VIAGEM' ? 'Em Viagem' : 'Manutenção'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><UserCheck size={14} /> Motorista:</span>
                  <span className="font-semibold text-white">{v.driverName || 'Sem Alocação'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Fuel size={14} /> Quilometragem:</span>
                  <span className="font-mono text-white">{v.mileageKm.toLocaleString('pt-MZ')} KM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><ShieldCheck size={14} /> Próxima Troca Óleo:</span>
                  <span className="text-amber-400 font-semibold font-mono">{v.nextOilChangeKm.toLocaleString('pt-MZ')} KM</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() =>
                    setSelectedVehicle({
                      plate: v.plateNumber,
                      make: v.make,
                      model: v.model,
                      driver: v.driverName || 'Não Alocado',
                      km: `${v.mileageKm.toLocaleString('pt-MZ')} KM`,
                      status: v.status,
                    })
                  }
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  Ficha Técnica
                </button>
                <button
                  onClick={() => setShowTyreMaintenanceModal(true)}
                  className="p-1.5 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl border border-amber-500/30 transition-all cursor-pointer"
                  title="Agendar Manutenção"
                >
                  <Wrench size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-navy-900/80 border border-slate-800 overflow-hidden shadow-glass">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 align-middle">Motorista & Contacto</th>
                  <th className="p-3.5 align-middle">Carta Heavy Duty & Validade</th>
                  <th className="p-3.5 align-middle">Passaporte & Visto SADC</th>
                  <th className="p-3.5 align-middle">Estatuto Documental</th>
                  <th className="p-3.5 text-right align-middle">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {drivers.map((drv) => (
                  <tr key={drv.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 align-middle space-y-0.5">
                      <span className="font-bold text-white text-xs block">{drv.name}</span>
                      <span className="text-slate-400 text-[11px] font-mono block">{drv.phone}</span>
                    </td>
                    <td className="p-3.5 align-middle space-y-0.5 font-mono">
                      <span className="text-slate-200 font-bold block">{drv.licenseNumber}</span>
                      <span className="text-slate-400 text-[11px] block">Expira: {drv.licenseExpDate}</span>
                    </td>
                    <td className="p-3.5 align-middle space-y-0.5 font-mono">
                      <span className="text-slate-300 block">Passaporte: {drv.passportExpDate}</span>
                      <span className="text-slate-400 text-[11px] block">Visto SADC: {drv.sadcVisaExpDate}</span>
                    </td>
                    <td className="p-3.5 align-middle">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] border inline-flex items-center gap-1 ${
                          drv.docStatus === 'ALERTA_EXPIRACAO'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {drv.docStatus === 'ALERTA_EXPIRACAO' ? (
                          <>
                            <AlertTriangle size={11} /> Alerta Expiração
                          </>
                        ) : (
                          'Válido'
                        )}
                      </span>
                    </td>
                    <td className="p-3.5 text-right align-middle">
                      <RowActionsDropdown
                        items={[
                          {
                            label: 'Ficha do Motorista',
                            icon: UserCheck,
                            onClick: () =>
                              setSelectedDriver({
                                name: drv.name,
                                license: drv.licenseNumber,
                                phone: drv.phone,
                                status: drv.status === 'EM_VIAGEM' ? 'Em Viagem SADC/Nacional' : 'Disponível na Garagem Central',
                              }),
                          },
                          {
                            label: 'Alertas de Documentação',
                            icon: AlertTriangle,
                            variant: 'primary' as const,
                            onClick: () => setShowDriverDocAlerts(true),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAssignModal && (
        <DriverAssignmentModal
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => setActiveTab('trips')}
        />
      )}

      {showNewVehicleModal && (
        <NewVehicleModal
          onClose={() => setShowNewVehicleModal(false)}
          onSuccess={() => setActiveTab('vehicles')}
        />
      )}

      {showDriverDocAlerts && (
        <DriverDocAlertsModal onClose={() => setShowDriverDocAlerts(false)} />
      )}

      {showFuelModal && (
        <FuelManagementModal onClose={() => setShowFuelModal(false)} />
      )}

      {showTyreMaintenanceModal && (
        <TyreMaintenanceModal onClose={() => setShowTyreMaintenanceModal(false)} />
      )}

      {selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-navy-900 border border-slate-800 rounded-3xl p-6 relative">
            <button onClick={() => setSelectedVehicle(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Truck className="text-brand-orange" /> {selectedVehicle.plate}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{selectedVehicle.make} {selectedVehicle.model}</p>
            <div className="mt-4 space-y-2 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p><strong>Motorista Alocado:</strong> {selectedVehicle.driver}</p>
              <p><strong>Quilometragem Acumulada:</strong> {selectedVehicle.km}</p>
              <p><strong>Estado Operacional:</strong> {selectedVehicle.status}</p>
            </div>
            <button onClick={() => setSelectedVehicle(null)} className="w-full mt-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer">
              Fechar
            </button>
          </div>
        </div>
      )}

      {selectedDriver && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-navy-900 border border-slate-800 rounded-3xl p-6 relative">
            <button onClick={() => setSelectedDriver(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="text-brand-orange" /> {selectedDriver.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Carta de Condução: {selectedDriver.license}</p>
            <div className="mt-4 space-y-2 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p><strong>Contacto Direto:</strong> {selectedDriver.phone}</p>
              <p><strong>Situação Atual:</strong> {selectedDriver.status}</p>
            </div>
            <button onClick={() => setSelectedDriver(null)} className="w-full mt-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer">
              Fechar Perfil
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
