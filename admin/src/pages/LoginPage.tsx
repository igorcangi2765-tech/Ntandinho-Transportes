import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../shared/stores/useAuthStore';
import { useNotificationStore } from '../shared/stores/useNotificationStore';
import { authService } from '../services/auth.service';
import { Logo } from '../shared/components/ui/Logo';

const loginSchema = z.object({
  email: z.string().email('Introduza um endereço de e-mail válido.'),
  password: z.string().min(6, 'A palavra-passe deve ter pelo menos 6 caracteres.'),
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useNotificationStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const handleForgotPassword = () => {
    addToast(
      'Recuperação de Acesso',
      'Por favor contacte o Administrador de TI para redefinir a palavra-passe.',
      'info'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setLoading(true);

    try {
      const data = await authService.login(email, password);

      if (data && data.user && data.tokens) {
        login(data.user, data.tokens.accessToken);
        addToast('Acesso Concedido', `Bem-vindo de volta, ${data.user.name}!`, 'success');
        navigate('/');
      } else {
        throw new Error('Credenciais de acesso inválidas.');
      }
    } catch (err: any) {
      setServerError(err.message || 'Credenciais de acesso inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-100 p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#0f172a]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Official Brand Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <Logo size="lg" showSubtitle={true} className="flex-col text-center" />
          <h1 className="text-xl font-bold text-white tracking-tight pt-2">Bem-vindo de volta</h1>
          <p className="text-xs text-slate-400">
            Inicie sessão para aceder ao ERP da N' Tandinho Transportes.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800/80 bg-[#0f172a]/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center space-x-2 text-xs text-brand-orange font-semibold uppercase tracking-wider">
            <ShieldCheck size={16} />
            <span>Acesso Seguro ERP</span>
          </div>

          {serverError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start space-x-3 animate-in fade-in duration-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" onKeyDown={handleKeyDown}>
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@ntandinho.co.mz"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-orange/60 focus:ring-1 focus:ring-brand-orange/40 transition-all placeholder:text-slate-600"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Palavra-passe
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-brand-orange hover:underline font-medium"
                >
                  Esqueci a palavra-passe
                </button>
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-orange/60 focus:ring-1 focus:ring-brand-orange/40 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {capsLockActive && (
                <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> Caps Lock ativado
                </p>
              )}

              {errors.password && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Controls: Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-brand-orange focus:ring-brand-orange/40"
                />
                <span>Manter sessão iniciada</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-glow"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>A entrar...</span>
                </>
              ) : (
                <span>Entrar no ERP</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
