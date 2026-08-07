import React, { useState, useEffect } from 'react';
import { X, MapPin, Gauge, Fuel, Navigation, ShieldCheck, Radio, UserCheck } from 'lucide-react';
import { LoadItem } from '../../shared/stores/useErpStore';

interface GpsTrackingModalProps {
  load: LoadItem;
  onClose: () => void;
}

export const GpsTrackingModal: React.FC<GpsTrackingModalProps> = ({ load, onClose }) => {
  const [speed, setSpeed] = useState(78);
  const [fuelLevel, setFuelLevel] = useState(84);
  const [engineTemp] = useState(88);
  const [currentCorridor] = useState('Corredor da Beira / EN6 (KM 142)');

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

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center">
            <Radio size={26} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Telemetria & Rastreio GPS em Tempo Real
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </h2>
            <p className="text-xs text-slate-400">
              Sinal Satelital Ativo • Viatura: <strong className="text-white">{load.truck}</strong> • Ordem: <strong className="text-brand-orange">{load.id}</strong>
            </p>
          </div>
        </div>

        {/* Simulated Live Map Display */}
        <div className="relative w-full h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4 mb-6 shadow-inner">
          {/* Map Grid Pattern background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* SADC Route Line simulation */}
          <div className="absolute inset-x-8 top-1/2 h-1 bg-slate-800 -translate-y-1/2">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-brand-orange to-sky-400 w-3/4 animate-pulse" />
          </div>

          {/* Animated Truck Pin */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="p-2.5 rounded-full bg-brand-orange text-slate-950 shadow-glow animate-bounce">
              <Navigation size={18} className="rotate-45" />
            </div>
            <div className="px-2.5 py-0.5 mt-1 rounded bg-slate-900/90 text-white text-[10px] font-mono border border-slate-700 shadow-md">
              {load.truck} ({speed} km/h)
            </div>
          </div>

          {/* Top Bar Map Info */}
          <div className="relative z-10 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200">
              <MapPin size={14} className="text-brand-orange" />
              <span>{currentCorridor}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              <ShieldCheck size={14} /> Sinal GPS: 100% Excelente
            </div>
          </div>

          {/* Bottom Bar Map Info */}
          <div className="relative z-10 flex justify-between items-center text-xs font-mono">
            <div className="text-slate-400">
              Origem: <span className="text-white font-semibold">{load.origin}</span>
            </div>
            <div className="text-slate-400">
              Destino: <span className="text-white font-semibold">{load.destination}</span>
            </div>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Gauge size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Velocidade Atual</span>
              <span className="text-lg font-mono font-bold text-white">{speed} km/h</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Fuel size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Nível de Tanque</span>
              <span className="text-lg font-mono font-bold text-emerald-400">{fuelLevel.toFixed(1)}%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <UserCheck size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Motorista em Serviço</span>
              <span className="text-xs font-bold text-white truncate block max-w-[110px]">{load.driver}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Radio size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Temperatura Motor</span>
              <span className="text-lg font-mono font-bold text-white">{engineTemp} °C</span>
            </div>
          </div>
        </div>

        {/* Modal Close Action */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Fechar Rastreamento
          </button>
        </div>
      </div>
    </div>
  );
};
