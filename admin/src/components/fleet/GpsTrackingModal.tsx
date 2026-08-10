import React, { useState, useEffect } from 'react';
import { X, Gauge, Fuel, Navigation, ShieldCheck, Radio } from 'lucide-react';
import { TripItem } from '../../shared/stores/useErpStore';

interface GpsTrackingModalProps {
  load: TripItem;
  onClose: () => void;
}

export const GpsTrackingModal: React.FC<GpsTrackingModalProps> = ({ load, onClose }) => {
  const [speed, setSpeed] = useState(78);
  const [fuelLevel, setFuelLevel] = useState(84);
  const [engineTemp] = useState(88);
  const [currentCorridor] = useState('Corredor N1 / EN1 (KM 142)');

  // Telemetry simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(Math.floor(72 + Math.random() * 12));
      setFuelLevel((prev) => Math.max(10, prev - 0.05));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-navy-900 border border-slate-800 rounded-3xl shadow-glass p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
            <Radio size={22} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Telemetria GPS em Tempo Real — Viagem {load.tripNumber}
            </h2>
            <p className="text-xs text-slate-400">Rastreio por satélite do camião {load.vehiclePlate} ({load.driverName}).</p>
          </div>
        </div>

        {/* Telemetry Dashboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1 mb-1 font-semibold">
              <Gauge size={14} className="text-brand-orange" /> Velocidade
            </span>
            <span className="text-2xl font-black font-mono text-white">{speed} km/h</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1 mb-1 font-semibold">
              <Fuel size={14} className="text-emerald-400" /> Tanque
            </span>
            <span className="text-2xl font-black font-mono text-emerald-400">{Math.round(fuelLevel)}%</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1 mb-1 font-semibold">
              <Navigation size={14} className="text-sky-400" /> Temperatura
            </span>
            <span className="text-2xl font-black font-mono text-slate-200">{engineTemp} °C</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1 mb-1 font-semibold">
              <ShieldCheck size={14} className="text-purple-400" /> Segurança
            </span>
            <span className="text-xs font-bold text-emerald-400 mt-2 block">Normal (Sem Alerta)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 mb-6 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Cliente:</span>
            <span className="font-bold text-white">{load.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Origem ➔ Destino:</span>
            <span className="font-semibold text-slate-200">{load.origin} ➔ {load.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Corredor Actual:</span>
            <span className="font-bold text-brand-orange">{currentCorridor}</span>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Fechar Telemetria
          </button>
        </div>
      </div>
    </div>
  );
};
