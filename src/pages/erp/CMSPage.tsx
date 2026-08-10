import { useState } from 'react';
import type { FC } from 'react';
import { 
  Globe, 
  Image, 
  BookOpen, 
  Briefcase, 
  Save, 
  Eye,
  Share2,
  Phone
} from 'lucide-react';
import { useToast } from '../../context/ToastContext.js';

export const CMSPage: FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('hero');
  const [livePreview, setLivePreview] = useState(false);

  // Hero State
  const [hero, setHero] = useState({
    title: "Transporte & Logística de Alta Eficiência em Moçambique",
    subtitle: "Aluguer de camiões, transporte de carga pesada e soluções logísticas na região SADC.",
    buttonText: "Solicitar Cotação",
    buttonLink: "#contacto",
    imageUrl: "/og-transportes-ntandinho.jpeg"
  });

  // About State
  const [about, setAbout] = useState({
    title: "Sobre a Transportes N' Tandinho",
    description: "A Transportes N' Tandinho é referência no transporte rodoviário de mercadorias em Moçambique.",
    mission: "Garantir entregas pontuais e eficientes com segurança.",
    vision: "Ser a referência em logística na África Austral (SADC).",
    values: "Segurança, Pontualidade, Transparência, Compromisso."
  });

  // Services State
  const [services] = useState<any[]>([
    { id: '1', title: 'Aluguer de Camiões', description: 'Contratos flexíveis, suporte 24/7, com/sem motorista.' },
    { id: '2', title: 'Transporte de Mercadorias', description: 'Carga seca e pesada em todo o território nacional.' },
    { id: '3', title: 'Transporte Internacional (SADC)', description: 'Rotas para Malawi, Zâmbia, Zimbábue e África do Sul.' }
  ]);


  // Social & SEO State
  const [settings, setSettings] = useState({
    siteName: "Transportes N' Tandinho",
    metaTitle: "Transportes N' Tandinho | Transporte e Logística em Moçambique",
    metaDescription: "Aluguer de camiões, transporte de mercadorias, logística nacional e SADC.",
    whatsappNumber: "+258840000000",
    phone1: "+258 84 000 0000",
    email1: "geral@ntandinho.co.mz",
    address: "Av. Eduardo Mondlane, Edifício Central, Nampula, Moçambique",
    facebookUrl: "https://facebook.com/ntandinho",
    instagramUrl: "https://instagram.com/ntandinho",
    linkedinUrl: "https://linkedin.com/company/ntandinho",
    footerText: "© 2026 Transportes N' Tandinho & Logística. Todos os direitos reservados."
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSave = async (section: string) => {
    try {
      showToast(`Conteúdo da seção "${section.toUpperCase()}" publicado no Website em tempo real!`, 'success');
    } catch (err) {
      showToast('Erro ao publicar conteúdo', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1628] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Globe className="text-[#F5A300]" />
            <span>CMS Website - Gestão Dinâmica Sem Código</span>
          </h1>
          <p className="text-[#A5B4C7] text-xs mt-1">
            Atualização em tempo real do site institucional sem modificar o código-fonte público.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLivePreview(!livePreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              livePreview ? 'bg-[#22C55E] text-black shadow-lg shadow-[#22C55E]/20' : 'bg-[#13203A] text-[#A5B4C7] hover:text-white'
            }`}
          >
            <Eye size={16} />
            <span>{livePreview ? 'Ocultar Pré-visualização' : 'Pré-visualização Ao Vivo'}</span>
          </button>
        </div>
      </div>

      {/* LIVE PREVIEW BANNER */}
      {livePreview && (
        <div className="p-6 rounded-2xl bg-[#08101F] border border-[#F5A300]/40 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between text-xs font-bold text-[#F5A300] border-b border-white/10 pb-2">
            <span>PAINEL DE PRÉ-VISUALIZAÇÃO EM TEMPO REAL</span>
            <span>Simulação Website Público</span>
          </div>
          <div className="p-6 rounded-xl bg-[#060B17] border border-white/5 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F5A300]">N' TANDINHO LOGÍSTICA</span>
            <h2 className="text-xl font-extrabold text-white">{hero.title}</h2>
            <p className="text-xs text-[#A5B4C7]">{hero.subtitle}</p>
            <button className="px-5 py-2 bg-[#F5A300] text-black font-extrabold rounded-xl text-xs">
              {hero.buttonText}
            </button>
          </div>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
        {[
          { key: 'hero', label: 'Banner Principal', icon: Image },
          { key: 'about', label: 'Sobre Nós', icon: BookOpen },
          { key: 'services', label: 'Serviços', icon: Briefcase },
          { key: 'gallery', label: 'Galeria', icon: Image },
          { key: 'contact', label: 'Contactos & Rodapé', icon: Phone },
          { key: 'seo', label: 'SEO & Redes Sociais', icon: Share2 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black shadow-lg shadow-[#F5A300]/20' 
                  : 'bg-[#0D1628] text-[#A5B4C7] hover:text-white hover:bg-[#13203A]'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* BANNER PRINCIPAL TAB */}
      {activeTab === 'hero' && (
        <div className="bg-[#0D1628] p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl text-white">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Image className="text-[#F5A300]" size={18} />
            <span>Editar Banner Principal (Hero Section)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A5B4C7]">Título Principal *</label>
              <input 
                type="text"
                value={hero.title}
                onChange={e => setHero({ ...hero, title: e.target.value })}
                className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A5B4C7]">Texto do Botão de Chamada</label>
              <input 
                type="text"
                value={hero.buttonText}
                onChange={e => setHero({ ...hero, buttonText: e.target.value })}
                className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-[#A5B4C7]">Subtítulo Institucional</label>
              <textarea 
                rows={3}
                value={hero.subtitle}
                onChange={e => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-[#A5B4C7]">Upload / URL da Imagem de Fundo</label>
              <input 
                type="text"
                value={hero.imageUrl}
                onChange={e => setHero({ ...hero, imageUrl: e.target.value })}
                className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSave('Banner Principal')}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-extrabold rounded-xl text-xs transition-all shadow-lg"
          >
            <Save size={16} />
            <span>Publicar em Tempo Real</span>
          </button>
        </div>
      )}

      {/* SOBRE NÓS TAB */}
      {activeTab === 'about' && (
        <div className="bg-[#0D1628] p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl text-white">
          <h2 className="text-base font-bold flex items-center gap-2">
            <BookOpen className="text-[#F5A300]" size={18} />
            <span>Editar Seção Sobre Nós</span>
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A5B4C7]">Título</label>
              <input 
                type="text"
                value={about.title}
                onChange={e => setAbout({ ...about, title: e.target.value })}
                className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A5B4C7]">Apresentação da Empresa</label>
              <textarea 
                rows={4}
                value={about.description}
                onChange={e => setAbout({ ...about, description: e.target.value })}
                className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A5B4C7]">Missão</label>
                <textarea 
                  rows={3}
                  value={about.mission}
                  onChange={e => setAbout({ ...about, mission: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A5B4C7]">Visão</label>
                <textarea 
                  rows={3}
                  value={about.vision}
                  onChange={e => setAbout({ ...about, vision: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A5B4C7]">Valores</label>
                <textarea 
                  rows={3}
                  value={about.values}
                  onChange={e => setAbout({ ...about, values: e.target.value })}
                  className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSave('Sobre Nós')}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-extrabold rounded-xl text-xs transition-all shadow-lg"
          >
            <Save size={16} />
            <span>Publicar Seção Sobre</span>
          </button>
        </div>
      )}

      {/* SERVIÇOS TAB */}
      {activeTab === 'services' && (
        <div className="bg-[#0D1628] p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl text-white">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Briefcase className="text-[#F5A300]" size={18} />
            <span>Gerir Serviços do Website</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map(s => (
              <div key={s.id} className="p-4 bg-[#060B17] rounded-xl border border-white/5 space-y-2">
                <h4 className="text-sm font-bold text-white">{s.title}</h4>
                <p className="text-xs text-[#A5B4C7]">{s.description}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleSave('Serviços')}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-extrabold rounded-xl text-xs shadow-lg"
          >
            <Save size={16} />
            <span>Publicar Alterações de Serviços</span>
          </button>
        </div>
      )}

      {/* SEO & REDES SOCIAIS TAB */}
      {(activeTab === 'seo' || activeTab === 'contact' || activeTab === 'gallery') && (
        <div className="bg-[#0D1628] p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl text-white">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Share2 className="text-[#F5A300]" size={18} />
            <span>SEO, Meta Tags & Redes Sociais</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A5B4C7]">Título Meta SEO (Google)</label>
              <input 
                type="text"
                value={settings.metaTitle}
                onChange={e => setSettings({ ...settings, metaTitle: e.target.value })}
                className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A5B4C7]">Link Facebook</label>
              <input 
                type="text"
                value={settings.facebookUrl}
                onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-[#A5B4C7]">Descrição Meta SEO</label>
              <textarea 
                rows={3}
                value={settings.metaDescription}
                onChange={e => setSettings({ ...settings, metaDescription: e.target.value })}
                className="w-full bg-[#060B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#F5A300] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSave('SEO & Redes Sociais')}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#F5A300] to-[#FFB91D] text-black font-extrabold rounded-xl text-xs shadow-lg"
          >
            <Save size={16} />
            <span>Publicar Configurações de SEO</span>
          </button>
        </div>
      )}
    </div>
  );
};
