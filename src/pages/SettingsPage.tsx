import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Settings, Save, Building, Mail, Phone, MapPin, Globe, DollarSign, Bell, Shield, Truck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { companySettings, updateSettings } = useData();

  const [form, setForm] = useState(companySettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#F5A300]" />
          Configurações do Sistema & Empresa
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Gerir dados corporativos da N' Tandinho Transportes, moedas, preferências e alertas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Info */}
        <div className="stripe-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#F5A300]" />
            Dados Institucionais da Empresa
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nome Oficial da Empresa *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="stripe-input w-full font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">NUIT Fiscal *</label>
              <input
                type="text"
                value={form.nuit}
                onChange={(e) => setForm({ ...form, nuit: e.target.value })}
                className="stripe-input w-full font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Geral *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Telefone Principal *</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Endereço Sede *</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Cidade Sede *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">País *</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="stripe-input w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Currency & Language */}
        <div className="stripe-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#F5A300]" />
            Moeda, Idioma & Preferências Regionais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Moeda Padrão do Sistema *</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value as any })}
                className="stripe-input w-full font-bold"
              >
                <option value="MZN">Metical Moçambicano (MZN)</option>
                <option value="USD">Dólar Americano (USD)</option>
                <option value="ZAR">Rand Sul-Africano (ZAR)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Idioma da Interface *</label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value as any })}
                className="stripe-input w-full font-bold"
              >
                <option value="pt-MZ">Português (Moçambique)</option>
                <option value="en-US">English (International)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Operations Toggles */}
        <div className="stripe-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#F5A300]" />
            Notificações e Alertas Automáticos
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer">
              <div>
                <span className="font-bold text-slate-200 block">Notificações por Email</span>
                <span className="text-slate-400 text-[11px]">Enviar alerta quando novos pedidos forem submetidos</span>
              </div>
              <input
                type="checkbox"
                checked={form.emailNotifications}
                onChange={(e) => setForm({ ...form, emailNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-[#F5A300] focus:ring-[#F5A300] bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer">
              <div>
                <span className="font-bold text-slate-200 block">Alertas SMS para Motoristas</span>
                <span className="text-slate-400 text-[11px]">Notificar motoristas por SMS na atribuição de novas viagens</span>
              </div>
              <input
                type="checkbox"
                checked={form.smsAlerts}
                onChange={(e) => setForm({ ...form, smsAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-[#F5A300] focus:ring-[#F5A300] bg-slate-900 border-slate-700"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button type="submit" className="stripe-button-primary text-xs px-6 py-2.5">
            <Save className="w-4 h-4" />
            <span>Salvar Alterações das Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
