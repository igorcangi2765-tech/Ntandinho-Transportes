import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../permissions/rbacConfig';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { Truck, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('tandinho@ntandinho.co.mz');
  const [password, setPassword] = useState('••••••••••••');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (!res.success && res.message) {
      setErrorMessage(res.message);
    }
  };

  const handleQuickRoleSelect = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('123456');
    setLoading(true);
    const res = await login(roleEmail, '123456');
    setLoading(false);
    if (!res.success && res.message) setErrorMessage(res.message);
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4 selection:bg-[#F5A300] selection:text-slate-950">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F5A300] to-amber-300 shadow-xl shadow-orange-500/20 text-slate-950 mb-2">
            <Truck className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            N' TANDINHO <span className="text-[#F5A300]">TRANSPORTES</span>
          </h1>
          <p className="text-xs text-slate-400">
            Painel Administrativo Empresarial Pronto para Produção
          </p>
        </div>

        {/* Card */}
        <div className="stripe-card p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-slide-down">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Corporativo</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="stripe-input w-full pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 font-medium">Palavra-passe</label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] text-[#F5A300] hover:underline font-semibold"
                >
                  Esqueceu a palavra-passe?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="stripe-input w-full pl-9"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="stripe-button-primary w-full py-2.5 text-xs font-bold mt-2"
            >
              <span>{loading ? 'A autenticar...' : 'Entrar no Sistema'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Role Selection (RBAC Shortcuts) */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Acesso Rápido por Perfil (RBAC Teste):
            </span>

            <div className="grid grid-cols-2 gap-2">
              {[
                { role: 'ADMIN' as Role, email: 'tandinho@ntandinho.co.mz', label: 'Administrador', color: 'border-amber-500/40 text-amber-300 hover:bg-amber-500/10' },
                { role: 'GESTOR' as Role, email: 'amelia.n@ntandinho.co.mz', label: 'Gestor Operações', color: 'border-blue-500/40 text-blue-300 hover:bg-blue-500/10' },
                { role: 'OPERADOR' as Role, email: 'mateus.l@ntandinho.co.mz', label: 'Operador Frota', color: 'border-purple-500/40 text-purple-300 hover:bg-purple-500/10' },
                { role: 'FINANCEIRO' as Role, email: 'financeiro@ntandinho.co.mz', label: 'Financeiro', color: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10' }
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => handleQuickRoleSelect(item.email)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${item.color}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          © 2026 Transportes N' Tandinho S.A. • Todos os direitos reservados.
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />
    </div>
  );
};
