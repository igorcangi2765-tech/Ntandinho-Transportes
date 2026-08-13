import React, { useState } from 'react';
import { useErpStore } from '../../shared/stores/useErpStore';
import { useNotificationStore } from '../../shared/stores/useNotificationStore';
import { Modal } from './Modal';
import {
  Truck,
  FileSpreadsheet,
  Building2,
  Users,
  Wrench,
} from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose }) => {
  const { addTrip, addQuotation, addCustomer, addVehicle, addDriver, addExpense, customers } = useErpStore();
  const { addToast } = useNotificationStore();

  const [activeForm, setActiveForm] = useState<'viagem' | 'cotacao' | 'cliente' | 'viatura' | 'motorista' | 'despesa'>('viagem');

  // Form States
  const [origin, setOrigin] = useState('Matola, Maputo');
  const [destination, setDestination] = useState('Nampula (Corredor N1)');
  const [customerName, setCustomerName] = useState(customers[0]?.name || 'Mozal S.A.');
  const [cargoDesc, setCargoDesc] = useState('Mercadorias Diversas');
  const [weightKg] = useState(15000);
  const [priceMzn, setPriceMzn] = useState(250000);

  // Vehicle
  const [plate, setPlate] = useState('ABM-');
  const [make, setMake] = useState('Volvo');
  const [model, setModel] = useState('FH16');

  // Driver
  const [driverName, setDriverName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');

  // Expense
  const [expCategory, setExpCategory] = useState<'COMBUSTIVEL' | 'MANUTENCAO' | 'PORTAGEM' | 'DIARIA_MOTORISTA'>('COMBUSTIVEL');
  const [expAmount, setExpAmount] = useState(15000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeForm === 'viagem') {
      addTrip({
        customerId: customers[0]?.id || 'cust-1',
        customerName,
        origin,
        destination,
        cargoDescription: cargoDesc,
        weightKg,
        vehiclePlate: 'ABM-849-MC',
        vehicleModel: 'Volvo FH16',
        driverName: 'João Mucavel',
        totalPriceMzn: priceMzn * 1.16,
        serviceName: 'Transporte de Mercadorias',
      });
      addToast('Viagem Criada', `Despacho de ${origin} ➔ ${destination} registado!`, 'success');
    } else if (activeForm === 'cotacao') {
      addQuotation({
        customerId: customers[0]?.id || 'cust-1',
        customerName,
        origin,
        destination,
        cargoDescription: cargoDesc,
        weightKg,
        priceSubtotal: priceMzn,
        currency: 'MZN',
        validUntil: '2026-08-30',
      });
      addToast('Cotação Gerada', `Cotação para ${customerName} criada em Rascunho!`, 'success');
    } else if (activeForm === 'cliente') {
      addCustomer({
        name: customerName,
        nuit: '400' + Math.floor(100000 + Math.random() * 900000),
        email: 'contacto@' + customerName.toLowerCase().replace(/\s+/g, '') + '.co.mz',
        phone: '+258 84 ' + Math.floor(1000000 + Math.random() * 9000000),
        address: 'Matola / Maputo',
        city: 'Maputo',
        isCorporate: true,
        creditLimitMzn: 5000000,
      });
      addToast('Cliente Cadastrado', `Cliente ${customerName} adicionado ao cadastro ERP!`, 'success');
    } else if (activeForm === 'viatura') {
      addVehicle({
        plateNumber: plate.toUpperCase(),
        make,
        model,
        year: 2024,
        category: 'Camião Pesado',
        mileageKm: 0,
        nextOilChangeKm: 15000,
        licenseExpiry: '2027-12-31',
        insuranceExpiry: '2027-12-31',
        inspectionExpiry: '2027-12-31',
      });
      addToast('Viatura Registada', `Camião ${plate.toUpperCase()} adicionado à frota!`, 'success');
    } else if (activeForm === 'motorista') {
      addDriver({
        name: driverName || 'Carlos Alberto',
        licenseNumber: licenseNo || 'C-901234',
        licenseExpDate: '2028-12-31',
        passportExpDate: '2029-12-31',
        sadcVisaExpDate: '2028-12-31',
        phone: '+258 84 000 0000',
      });
      addToast('Motorista Registado', `Condutor ${driverName} cadastrado com visto SADC!`, 'success');
    } else if (activeForm === 'despesa') {
      addExpense({
        category: expCategory,
        description: `Lançamento Rápido (${expCategory})`,
        amountMzn: Number(expAmount),
        registeredBy: 'Administrador ERP',
      });
      addToast('Despesa Registada', `Despesa de ${expAmount.toLocaleString('pt-MZ')} MZN lançada.`, 'success');
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Criação Rápida de Registos no ERP"
      subtitle="Selecione o tipo de entidade que deseja criar na N' Tandinho"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Selector Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { id: 'viagem', label: 'Viagem', icon: Truck },
            { id: 'cotacao', label: 'Cotação', icon: FileSpreadsheet },
            { id: 'cliente', label: 'Cliente', icon: Building2 },
            { id: 'viatura', label: 'Viatura', icon: Truck },
            { id: 'motorista', label: 'Motorista', icon: Users },
            { id: 'despesa', label: 'Despesa', icon: Wrench },
          ].map((item) => {
            const Icon = item.icon;
            const isSel = activeForm === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveForm(item.id as any)}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  isSel
                    ? 'bg-brand-orange text-slate-950 border-brand-orange font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon size={16} />
                <span className="text-[11px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-3 border-t border-slate-800">
          {activeForm === 'viagem' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Cliente Solicitante</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Valor do Serviço (MZN)</label>
                <input
                  type="number"
                  value={priceMzn}
                  onChange={(e) => setPriceMzn(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Origem</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Destino</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          )}

          {activeForm === 'cotacao' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Subtotal Estimado (MZN)</label>
                <input
                  type="number"
                  value={priceMzn}
                  onChange={(e) => setPriceMzn(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-slate-400 font-medium block mb-1">Descrição da Carga</label>
                <input
                  type="text"
                  value={cargoDesc}
                  onChange={(e) => setCargoDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          )}

          {activeForm === 'cliente' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-400 font-medium block mb-1">Nome da Empresa / Cliente</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          )}

          {activeForm === 'viatura' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Matrícula</label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="ABM-849-MC"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Marca</label>
                <input
                  type="text"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Modelo</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          )}

          {activeForm === 'motorista' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Carlos Alberto Nhantumbo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Carta de Condução</label>
                <input
                  type="text"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  placeholder="C-901234 (Pesados)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          )}

          {activeForm === 'despesa' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Categoria de Despesa</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="COMBUSTIVEL">Combustível</option>
                  <option value="MANUTENCAO">Manutenção</option>
                  <option value="PORTAGEM">Portagem</option>
                  <option value="DIARIA_MOTORISTA">Diária de Motorista</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Valor (MZN)</label>
                <input
                  type="number"
                  value={expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 text-xs font-bold rounded-xl shadow-glow cursor-pointer"
            >
              Confirmar & Criar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
