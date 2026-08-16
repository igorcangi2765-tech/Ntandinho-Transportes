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

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const validation = loginSchema.safeParse({ email: cleanEmail, password: cleanPassword });
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
      const data = await authService.login(cleanEmail, cleanPassword);

      if (data && data.user && data.tokens) {
        login(data.user, data.tokens.accessToken);
        addToast('Acesso Concedido', `Bem-vindo de volta, ${data.user.name}!`, 'success');
        console.log('[LOGIN PAGE] Autenticação bem-sucedida. Redirecionando para o Dashboard...');
        navigate('/');
      } else {
        const failureMsg = 'Credenciais de acesso incorretas. Por favor verifique o seu e-mail e palavra-passe.';
        console.error('[LOGIN PAGE FAIL]', failureMsg);
        throw new Error(failureMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Falha ao autenticar. Verifique os dados introduzidos.';
      console.error('[LOGIN PAGE ERROR]', errorMsg);
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text-primary p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Official Brand Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Logo size="lg" />
          <h1 className="text-2xl font-bold text-text-primary tracking-tight pt-3">Bem-vindo de volta</h1>
          <p className="text-sm text-text-muted">
            Inicie sessão para aceder ao N’Tandinho ERP.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl p-6 sm:p-8 shadow-2xl border border-border bg-surface/95 backdrop-blur-xl space-y-6">
          <div className="flex items-center space-x-2 text-xs text-brand-orange font-bold uppercase tracking-wider">
            <ShieldCheck size={18} />
            <span>Acesso Seguro ERP</span>
          </div>

          {serverError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex items-start space-x-3 animate-in fade-in duration-200">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" onKeyDown={handleKeyDown}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-2.5 text-text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@ntandinho.co.mz"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-background text-text-primary rounded-xl border border-border focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-text-muted"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-text-secondary" htmlFor="password">
                  Palavra-passe
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-brand-orange hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange rounded"
                >
                  Esqueci a palavra-passe
                </button>
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-2.5 text-text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-background text-text-primary rounded-xl border border-border focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                  className="absolute right-3.5 top-2.5 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {capsLockActive && (
                <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> Caps Lock ativado
                </p>
              )}

              {errors.password && (
                <p className="text-xs text-rose-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Controls: Remember Me */}
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-background border-border text-brand-orange focus:ring-brand-orange/40 h-4 w-4 cursor-pointer"
                />
                <span className="group-hover:text-text-primary transition-colors">Manter sessão iniciada</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-orange hover:bg-orange-500 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange focus:ring-offset-background"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>A autenticar...</span>
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
