import React from 'react';
import { Truck } from 'lucide-react';
import { useErpStore } from '../../shared/stores/useErpStore';

interface CompanyDocumentHeaderProps {
  documentType?: string;
  documentNumber?: string;
  documentDate?: string;
  dueDate?: string;
  documentStatus?: string;
  className?: string;
  isPrintSheet?: boolean;
}

export const CompanyDocumentHeader: React.FC<CompanyDocumentHeaderProps> = ({
  documentType,
  documentNumber,
  documentDate,
  dueDate,
  documentStatus,
  className = '',
  isPrintSheet = true,
}) => {
  const { companyProfile } = useErpStore();

  const textColorClass = isPrintSheet ? 'text-slate-900' : 'text-slate-100';
  const subTextColorClass = isPrintSheet ? 'text-slate-600' : 'text-slate-400';
  const borderClass = isPrintSheet ? 'border-slate-200' : 'border-slate-800';

  return (
    <div className={`pb-5 mb-5 border-b ${borderClass} text-xs ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        {/* ESQUERDA: Logótipo Oficial + Nome da Empresa + Contactos Essenciais */}
        <div className="flex items-start space-x-3.5">
          {/* Logótipo Oficial (48px) sem caixa de fundo */}
          <div className="shrink-0 pt-0.5">
            {companyProfile.logoUrl ? (
              <img
                src={companyProfile.logoUrl}
                alt={companyProfile.name}
                className="h-11 w-auto max-w-[120px] object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = (e.target as HTMLElement).nextElementSibling;
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
            ) : null}

            <div
              className={`w-11 h-11 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 ${
                companyProfile.logoUrl ? 'hidden' : 'flex'
              }`}
            >
              <Truck size={20} className="text-brand-orange" />
            </div>
          </div>

          {/* Nome da Empresa + Contactos Essenciais */}
          <div className="space-y-0.5">
            <h1 className={`text-base font-bold tracking-tight ${textColorClass}`}>
              {companyProfile.name}
            </h1>
            <p className={`text-[11px] ${subTextColorClass}`}>
              {companyProfile.address}, {companyProfile.city}
            </p>
            <p className={`text-[11px] ${subTextColorClass}`}>
              Tel: {companyProfile.phones[0] || '+258 84 000 0000'} • {companyProfile.emails[0] || 'geral@ntandinho.co.mz'} • NUIT: {companyProfile.nuit}
            </p>
          </div>
        </div>

        {/* DIREITA: Tipo de Documento, Número, Datas e Estado */}
        {(documentType || documentNumber || documentDate || documentStatus) && (
          <div className="text-left sm:text-right space-y-0.5 shrink-0 self-stretch sm:self-auto flex flex-col justify-start sm:items-end">
            {documentType && (
              <h2 className={`font-bold text-xs tracking-wider uppercase ${textColorClass}`}>
                {documentType}
              </h2>
            )}

            {documentNumber && (
              <p className={`font-mono font-bold text-base ${textColorClass}`}>
                {documentNumber}
              </p>
            )}

            <div className={`text-[11px] ${subTextColorClass} space-y-0.5`}>
              {documentDate && <p>Data: <strong className={textColorClass}>{documentDate}</strong></p>}
              {dueDate && <p>Vencimento: <strong className={textColorClass}>{dueDate}</strong></p>}
              {documentStatus && (
                <p>
                  Estado: <strong className={documentStatus === 'PAGO' || documentStatus === 'LIQUIDADO' ? 'text-emerald-700' : textColorClass}>{documentStatus}</strong>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
