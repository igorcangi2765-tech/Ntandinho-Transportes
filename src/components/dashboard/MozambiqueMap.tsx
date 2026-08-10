import React, { useState } from 'react';
import { Compass, Radio, ExternalLink, MapPin, Truck, ArrowRight, Navigation, Gauge, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface CityGoogleTracking {
  id: string;
  name: string;
  province: string;
  code: string;
  region: 'Norte' | 'Centro' | 'Sul';
  activeTrucksCount: number;
  mainRoute: string;
  truckModel: string;
  truckPlate: string;
  lat: number;
  lng: number;
  embedUrl: string;
}

export const MozambiqueMap: React.FC = () => {
  const { trips } = useData();

  // Cities with exact Google Maps embed URLs centered on each city/route in Mozambique
  const citiesGoogleData: CityGoogleTracking[] = [
    {
      id: 'nampula',
      name: 'Nampula (Sede Principal)',
      province: 'Nampula',
      code: 'NMP',
      region: 'Norte',
      activeTrucksCount: 14,
      mainRoute: 'Nampula ➔ Lichinga (EN13)',
      truckModel: 'Volvo FH16 750 (44 Ton)',
      truckPlate: 'AFB-482-MC',
      lat: -15.1165,
      lng: 39.2666,
      embedUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123450!2d39.2666!3d-15.1165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18d2005a7cf95e3d%3A0x6b4a24abf865f123!2sNampula%2C%20Mozambique!5e0!3m2!1sen!2smz!4v1700000000000!5m2!1sen!2smz`
    },
    {
      id: 'nacala',
      name: 'Nacala-Porto',
      province: 'Nampula',
      code: 'NCL',
      region: 'Norte',
      activeTrucksCount: 9,
      mainRoute: 'Nacala ➔ Blantyre (Malawi / SADC)',
      truckModel: 'Mercedes-Benz Actros 3344',
      truckPlate: 'AEC-304-MC',
      lat: -14.5428,
      lng: 40.6853,
      embedUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120000!2d40.6853!3d-14.5428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18d052efc1234567%3A0x123456789abcdef!2sNacala%2C%20Mozambique!5e0!3m2!1sen!2smz!4v1700000000000!5m2!1sen!2smz`
    },
    {
      id: 'beira',
      name: 'Beira (Sofala)',
      province: 'Sofala',
      code: 'BRA',
      region: 'Centro',
      activeTrucksCount: 11,
      mainRoute: 'Beira ➔ Maputo (Corredor EN1)',
      truckModel: 'Scania R580 6x4 Heavy',
      truckPlate: 'AGA-912-MC',
      lat: -19.8436,
      lng: 34.8389,
      embedUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d150000!2d34.8389!3d-19.8436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1f2a123456789abc%3A0x987654321fedcba!2sBeira%2C%20Mozambique!5e0!3m2!1sen!2smz!4v1700000000000!5m2!1sen!2smz`
    },
    {
      id: 'maputo',
      name: 'Maputo & Matola',
      province: 'Maputo',
      code: 'MPT',
      region: 'Sul',
      activeTrucksCount: 15,
      mainRoute: 'Maputo ➔ Ressano Garcia (África do Sul)',
      truckModel: 'MAN TGX 33.540',
      truckPlate: 'AEE-502-MC',
      lat: -25.9692,
      lng: 32.5732,
      embedUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d150000!2d32.5732!3d-25.9692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee6971578234567%3A0x76543210fedcba9!2sMaputo%2C%20Mozambique!5e0!3m2!1sen!2smz!4v1700000000000!5m2!1sen!2smz`
    },
    {
      id: 'tete',
      name: 'Tete (Moatize)',
      province: 'Tete',
      code: 'TET',
      region: 'Centro',
      activeTrucksCount: 7,
      mainRoute: 'Tete ➔ Moatize (Minas EN7)',
      truckModel: 'Mercedes-Benz Actros 3344',
      truckPlate: 'AEC-304-MC',
      lat: -16.1564,
      lng: 33.5867,
      embedUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120000!2d33.5867!3d-16.1564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18d9987654321abc%3A0xdef1234567890abc!2sTete%2C%20Mozambique!5e0!3m2!1sen!2smz!4v1700000000000!5m2!1sen!2smz`
    },
    {
      id: 'pemba',
      name: 'Pemba (Cabo Delgado)',
      province: 'Cabo Delgado',
      code: 'PMB',
      region: 'Norte',
      activeTrucksCount: 5,
      mainRoute: 'Pemba ➔ Montepuez (Logística)',
      truckModel: 'Volvo FH16 750',
      truckPlate: 'AFG-102-MC',
      lat: -12.9732,
      lng: 40.5178,
      embedUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120000!2d40.5178!3d-12.9732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18db123456789000%3A0xfedcba0987654321!2sPemba%2C%20Mozambique!5e0!3m2!1sen!2smz!4v1700000000000!5m2!1sen!2smz`
    },
    {
      id: 'quelimane',
      name: 'Quelimane (Zambézia)',
      province: 'Zambézia',
      code: 'QLM',
      region: 'Centro',
      activeTrucksCount: 6,
      mainRoute: 'Quelimane ➔ Mocuba (EN1)',
      truckModel: 'Scania R580',
      truckPlate: 'AGB-441-MC',
      lat: -17.8786,
      lng: 36.8883,
      embedUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120000!2d36.8883!3d-17.8786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18d8765432109876%3A0x90abcdef12345678!2sQuelimane%2C%20Mozambique!5e0!3m2!1sen!2smz!4v1700000000000!5m2!1sen!2smz`
    },
    {
      id: 'lichinga',
      name: 'Lichinga (Niassa)',
      province: 'Niassa',
      code: 'LCH',
      region: 'Norte',
      activeTrucksCount: 4,
      mainRoute: 'Lichinga ➔ Cuamba (Corredor Norte)',
      truckModel: 'MAN TGX 33.540',
      truckPlate: 'AEX-882-MC',
      lat: -13.3128,
      lng: 35.2406,
      embedUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120000!2d35.2406!3d-13.3128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18d6987654321abc%3A0xabcdef1234567890!2sLichinga%2C%20Mozambique!5e0!3m2!1sen!2smz!4v1700000000000!5m2!1sen!2smz`
    }
  ];

  // Default overall Mozambique Google Maps view
  const MOZAMBIQUE_OVERALL_EMBED_URL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7522500!2d35.529562!3d-18.665695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18d4aceae6fd4ac5%3A0x12bbbfb9ae16a115!2sMozambique!5e0!3m2!1sen!2smz!4v1700000000000!5m2!1sen!2smz`;

  const [selectedCity, setSelectedCity] = useState<CityGoogleTracking | null>(null);

  const activeEmbedUrl = selectedCity ? selectedCity.embedUrl : MOZAMBIQUE_OVERALL_EMBED_URL;

  return (
    <div className="stripe-card flex flex-col justify-between h-full space-y-4">
      {/* Header - Clean, matching chart cards */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#F5A300]" />
            Tracking de Cidades — Google Maps Moçambique
          </h3>
          <p className="text-[11px] text-slate-400">
            {selectedCity ? `Foco em ${selectedCity.name}` : 'Visão Geral do País (-18.66°, 35.52°)'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            <span>Google Maps Vivo</span>
          </span>

          <a
            href="https://maps.app.goo.gl/Zo6qwZ6yk7KK1V83A"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-[#F5A300] transition-colors"
            title="Abrir no Google Maps Oficial"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Sole Google Maps Frame - Fluid flex growth */}
      <div className="relative w-full min-h-[220px] flex-1 rounded-xl border border-slate-800 overflow-hidden bg-[#020817] shadow-inner my-1">
        <iframe
          key={selectedCity?.id || 'overall'}
          title="Google Maps Moçambique Tracking"
          src={activeEmbedUrl}
          className="w-full h-full border-0 grayscale brightness-90 contrast-125 hover:grayscale-0 transition-all duration-300 min-h-[220px]"
          loading="lazy"
          allowFullScreen
        />

        {/* Floating City Info Overlay Badge */}
        {selectedCity && (
          <div className="absolute top-2 left-2 bg-[#0F172A]/95 border border-slate-700 p-2.5 rounded-xl shadow-2xl backdrop-blur-md z-20 text-xs max-w-xs animate-fade-in space-y-1">
            <div className="flex items-center justify-between font-bold text-[#F5A300]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F5A300]" />
                {selectedCity.name}
              </span>
              <button
                onClick={() => setSelectedCity(null)}
                className="text-slate-400 hover:text-slate-100 font-bold ml-2"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-300">Rota: {selectedCity.mainRoute}</p>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800">
              <span className="font-extrabold text-emerald-400">
                {selectedCity.activeTrucksCount} Camiões Ativos
              </span>
              <span className="text-slate-400 font-mono">{selectedCity.truckPlate}</span>
            </div>
          </div>
        )}
      </div>

      {/* City Tracking Quick Buttons Footer */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Selecionar Cidade para Rastrear no Google Maps:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap pb-1 text-[11px]">
          <button
            onClick={() => setSelectedCity(null)}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all border ${
              !selectedCity
                ? 'bg-[#F5A300] text-slate-950 border-[#F5A300]'
                : 'bg-slate-800/60 text-slate-300 border-slate-700/70 hover:bg-slate-700'
            }`}
          >
            ● Todo Moçambique
          </button>

          {citiesGoogleData.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCity(c)}
              className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all border ${
                selectedCity?.id === c.id
                  ? 'bg-[#F5A300] text-slate-950 border-[#F5A300]'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/70 hover:bg-slate-700'
              }`}
            >
              {c.code} - {c.name.split(' ')[0]} ({c.activeTrucksCount})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
