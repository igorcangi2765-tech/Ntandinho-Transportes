import React, { useState } from 'react';
import { Truck, MapPin, Play, CheckCircle2, Plus, ArrowRight, UserCheck } from 'lucide-react';
import { DriverAssignmentModal } from '../../components/fleet/DriverAssignmentModal';
import { useErpStore } from '../../shared/stores/useErpStore';

export const TripManagement: React.FC = () => {
  const { trips, updateTripStatus } = useErpStore();
  const [showAssignModal, setShowAssignModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-navy-900/80 border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Viagens & Despacho de Frota</h3>
          <p className="text-xs text-slate-400">Monitorização em tempo real das rotas Moçambique e SADC.</p>
        </div>

        <button
          onClick={() => setShowAssignModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl shadow-glow transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Alocar Nova Viagem</span>
        </button>
      </div>

      {/* Trips Cards List */}
      <div className="space-y-4">
        {trips.length === 0 ? (
          <div className="p-8 rounded-2xl bg-navy-900/80 border border-slate-800 text-center text-xs text-slate-500">
            Nenhuma viagem ativa encontrada.
          </div>
        ) : (
          trips.map((trip) => (
            <div
              key={trip.id}
              className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-brand-orange px-2 py-0.5 rounded bg-brand-orange/10 border border-brand-orange/30">
                    {trip.tripNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      trip.status === 'EM_TRANSITO'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : trip.status === 'ALOCADO'
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {trip.status === 'EM_TRANSITO'
                      ? 'Em Trânsito'
                      : trip.status === 'ALOCADO'
                      ? 'Alocado (Pronto)'
                      : trip.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  {trip.origin} <ArrowRight size={16} className="text-slate-500" /> {trip.destination}
                </h4>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <Truck size={14} className="text-brand-orange" />
                    {trip.vehiclePlate} ({trip.vehicleModel})
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <UserCheck size={14} className="text-slate-400" />
                    Motorista: <strong className="text-white">{trip.driverName}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin size={12} /> Carga: {trip.cargoDescription}
                  </span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center space-x-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 justify-end">
                {trip.status === 'ALOCADO' && (
                  <button
                    onClick={() => updateTripStatus(trip.id, 'EM_TRANSITO')}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-semibold text-xs rounded-xl border border-emerald-500/30 transition-all cursor-pointer"
                  >
                    <Play size={14} />
                    <span>Iniciar Viagem</span>
                  </button>
                )}

                {trip.status === 'EM_TRANSITO' && (
                  <button
                    onClick={() => updateTripStatus(trip.id, 'CONCLUIDO')}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 font-semibold text-xs rounded-xl border border-sky-500/30 transition-all cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>Concluir Entrega</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showAssignModal && (
        <DriverAssignmentModal
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};
