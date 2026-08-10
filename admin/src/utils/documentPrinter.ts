import { InvoiceItem, QuotationItem, PaymentItem, CompanyProfile } from '../shared/stores/useErpStore';

const DEFAULT_COMPANY: Partial<CompanyProfile> = {
  nomeComercial: "N' Tandinho",
  nomeJuridico: "Transportes e Logística N' Tandinho Lda",
  nuit: "400123987",
  address: "Av. Eduardo Mondlane, Edifício Central",
  city: "Nampula",
  province: "Nampula",
  country: "Moçambique",
  phones: ["+258 84 000 0000", "+258 82 000 0000"],
  emails: ["comercial@ntandinho.co.mz", "geral@ntandinho.co.mz"],
  website: "https://ntandinho.zyphtech.com",
  bankAccountDetails: "BCI: 00080000123456789 (IBAN MZ59) • BIM: 00010000987654321",
};

/**
 * Open high-end corporate A4 printable document window
 */
function openPrintWindow(title: string, contentHtml: string) {
  const printWindow = window.open('', '_blank', 'width=960,height=1080');
  if (!printWindow) {
    alert('Por favor permita pop-ups no seu navegador para visualizar e imprimir o documento.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap');
        
        @page {
          size: A4;
          margin: 15mm;
        }

        * {
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #0F172A;
          background: #E2E8F0;
          margin: 0;
          padding: 20px 0;
          font-size: 11px;
          line-height: 1.5;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Floating Top Print Bar (Screen Only) */
        .no-print-bar {
          position: fixed;
          top: 16px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 9999;
        }

        .btn-action {
          background: #0B132B;
          color: #FFFFFF;
          border: 1.5px solid #F6A823;
          padding: 9px 18px;
          font-weight: 800;
          font-size: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(11, 19, 43, 0.25);
          transition: all 0.2s ease;
        }

        .btn-action:hover {
          background: #F6A823;
          color: #0B132B;
        }

        .btn-secondary {
          background: #FFFFFF;
          color: #334155;
          border: 1px solid #CBD5E1;
          padding: 9px 14px;
          font-weight: 700;
          font-size: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .btn-secondary:hover {
          background: #F8FAFC;
        }

        /* A4 Document Paper Sheet */
        .document-paper {
          max-width: 800px;
          margin: 0 auto;
          background: #FFFFFF;
          padding: 40px 48px;
          border-radius: 6px;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
          border: 1px solid #CBD5E1;
        }

        /* Top Brand Accent Line */
        .brand-stripe {
          height: 4px;
          background: linear-gradient(90deg, #0B132B 0%, #16223B 70%, #F6A823 100%);
          border-radius: 2px;
          margin-bottom: 24px;
        }

        /* Executive Document Header */
        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1.5px solid #E2E8F0;
          padding-bottom: 20px;
          margin-bottom: 22px;
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-logo-box {
          width: 44px;
          height: 44px;
          background: #F6A823;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(246, 168, 35, 0.3);
          flex-shrink: 0;
        }

        .brand-title {
          font-size: 18px;
          font-weight: 900;
          color: #0B132B;
          letter-spacing: -0.4px;
          text-transform: uppercase;
        }

        .brand-sub {
          font-size: 10px;
          color: #475569;
          font-weight: 600;
          margin-top: 1px;
        }

        .doc-identity {
          text-align: right;
        }

        .doc-type-badge {
          display: inline-block;
          padding: 4px 10px;
          background: #0B132B;
          color: #F6A823;
          font-size: 10.5px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          border-radius: 5px;
          margin-bottom: 6px;
        }

        .doc-title-main {
          font-size: 17px;
          font-weight: 900;
          color: #0B132B;
          text-transform: uppercase;
        }

        .doc-code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 800;
          color: #D97706;
          margin-top: 2px;
        }

        /* 2-Column Info Grid */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 24px;
        }

        .info-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 14px 16px;
        }

        .info-box-title {
          font-size: 9px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
          border-bottom: 1px dashed #CBD5E1;
          padding-bottom: 4px;
        }

        .info-box-value {
          font-size: 13px;
          font-weight: 800;
          color: #0F172A;
        }

        .info-line {
          font-size: 10.5px;
          color: #475569;
          line-height: 1.65;
          margin-top: 4px;
        }

        /* Table Styling */
        .table-wrap {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .doc-table {
          width: 100%;
          border-collapse: collapse;
        }

        .doc-table th {
          background: #0B132B;
          color: #FFFFFF;
          font-size: 9.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          padding: 10px 14px;
          text-align: left;
          border-bottom: 2.5px solid #F6A823;
        }

        .doc-table td {
          padding: 11px 14px;
          border-bottom: 1px solid #E2E8F0;
          font-size: 11px;
          color: #1E293B;
        }

        .doc-table tr:last-child td {
          border-bottom: none;
        }

        .doc-table tr:nth-child(even) {
          background: #F8FAFC;
        }

        /* Utility Classes */
        .text-right { text-align: right; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-bold { font-weight: 700; }
        .font-black { font-weight: 900; }
        .text-emerald { color: #15803D; }
        .text-orange { color: #D97706; }

        /* Summary & Bank Grid */
        .summary-grid {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 28px;
        }

        .bank-details-box {
          flex: 1;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 14px 16px;
        }

        .totals-box {
          width: 300px;
          background: #F8FAFC;
          border: 1.5px solid #0B132B;
          border-radius: 8px;
          padding: 14px 16px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 11px;
          color: #475569;
        }

        .summary-row.grand-total {
          border-top: 2px solid #0B132B;
          margin-top: 6px;
          padding-top: 8px;
          font-size: 14px;
          font-weight: 900;
          color: #0B132B;
        }

        /* Official Signatures & Stamp Section */
        .signature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-top: 28px;
          padding-top: 10px;
        }

        .signature-card {
          border: 1px dashed #CBD5E1;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          background: #FAFAFA;
        }

        .sig-line-mark {
          width: 65%;
          height: 1px;
          background: #94A3B8;
          margin: 34px auto 8px auto;
        }

        .sig-label {
          font-size: 9.5px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
        }

        /* Legal Footer */
        .doc-footer {
          border-top: 1px solid #E2E8F0;
          padding-top: 14px;
          margin-top: 28px;
          text-align: center;
          font-size: 9px;
          color: #64748B;
          line-height: 1.6;
        }

        /* Print Override Rules */
        @media print {
          .no-print-bar { display: none !important; }
          body { background: #FFFFFF; margin: 0; padding: 0; }
          .document-paper {
            max-width: 100%;
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
            border-radius: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print-bar">
        <button onclick="window.print()" class="btn-action">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          <span>Imprimir / Guardar em PDF</span>
        </button>
        <button onclick="window.close()" class="btn-secondary">
          Fechar
        </button>
      </div>

      <div class="document-paper">
        <div class="brand-stripe"></div>

        <div class="doc-header">
          <div class="brand-group">
            <div class="brand-logo-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B132B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <div class="brand-title">N' Tandinho</div>
              <div class="brand-sub"><strong>${DEFAULT_COMPANY.nomeJuridico}</strong> • NUIT: ${DEFAULT_COMPANY.nuit}</div>
              <div class="brand-sub">${DEFAULT_COMPANY.address}, ${DEFAULT_COMPANY.city}, Moçambique</div>
            </div>
          </div>

          <div class="doc-identity">
            <div class="doc-type-badge">DOCUMENTO OFICIAL</div>
            <div class="brand-sub" style="margin-top:4px;"><strong>Data Emissão:</strong> ${new Date().toLocaleDateString('pt-MZ')}</div>
          </div>
        </div>

        ${contentHtml}

        <div class="doc-footer">
          <strong>${DEFAULT_COMPANY.nomeJuridico}</strong> — Transporte Seguro, Eficiente e Confiável.<br>
          Sede: Av. Eduardo Mondlane, Edifício Central, Nampula, Moçambique • NUIT: ${DEFAULT_COMPANY.nuit}<br>
          Contactos: ${DEFAULT_COMPANY.phones?.join(' | ')} • Email: ${DEFAULT_COMPANY.emails?.join(' | ')} • Web: ${DEFAULT_COMPANY.website}<br>
          <em style="font-size:8.5px; color:#94A3B8;">Processado por Computador / Backoffice ERP N'Tandinho Transportes S.A.</em>
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Print Fatura Oficial (Proforma ou Definitiva com IVA 16%)
 */
export function printInvoice(invoice: InvoiceItem, company?: Partial<CompanyProfile>) {
  const comp = { ...DEFAULT_COMPANY, ...company };

  const content = `
    <div style="margin-bottom: 20px;">
      <h2 class="doc-title-main">FATURA DE TRANSPORTE E LOGÍSTICA</h2>
      <div class="doc-code">Nº da Fatura: ${invoice.invoiceNumber}</div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <div class="info-box-title">EXMO.(S) SR.(S) / ADQUIRENTE</div>
        <div class="info-box-value">${invoice.customerName}</div>
        <div class="info-line">
          <strong>NUIT do Cliente:</strong> 400987123<br>
          <strong>Tipo:</strong> Cliente Corporativo Credenciado<br>
          <strong>Endereço:</strong> Nampula / Maputo, Moçambique
        </div>
      </div>

      <div class="info-box">
        <div class="info-box-title">DADOS DA FATURA E LIQUIDAÇÃO</div>
        <div class="info-line">
          <strong>Data de Emissão:</strong> ${invoice.createdAt}<br>
          <strong>Data de Vencimento:</strong> ${invoice.dueDate}<br>
          <strong>Imposto Aplicado:</strong> IVA 16% (Legislação Moçambicana)<br>
          <strong>Estado da Liquidação:</strong> 
          <span style="display:inline-block; padding:2px 8px; border-radius:4px; font-weight:800; font-size:10px; ${
            invoice.status === 'PAGO'
              ? 'background:#DCFCE7; color:#15803D;'
              : 'background:#FEF3C7; color:#B45309;'
          }">
            ${invoice.status}
          </span>
        </div>
      </div>
    </div>

    <div class="table-wrap">
      <table class="doc-table">
        <thead>
          <tr>
            <th>Descrição Detalhada do Serviço / Rota Operacional</th>
            <th class="text-right">Subtotal Base</th>
            <th class="text-right">Taxa IVA</th>
            <th class="text-right">Valor IVA (16%)</th>
            <th class="text-right">Total Líquido (MZN)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong style="font-size:12px; color:#0F172A;">Frete Rodoviário de Cargas Pesadas N'Tandinho</strong><br>
              <span style="color:#64748B; font-size:10px;">Serviço Especializado de Transporte • Ref. Viagem: ${invoice.tripId || 'NT-1024'}</span>
            </td>
            <td class="text-right font-mono font-bold">${invoice.subtotal.toLocaleString('pt-MZ')} MZN</td>
            <td class="text-right font-mono">16%</td>
            <td class="text-right font-mono">${invoice.taxAmount.toLocaleString('pt-MZ')} MZN</td>
            <td class="text-right font-mono font-black" style="font-size:12px;">${invoice.totalAmount.toLocaleString('pt-MZ')} MZN</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="summary-grid">
      <div class="bank-details-box">
        <div class="info-box-title">DADOS PARA PAGAMENTO BANCÁRIO</div>
        <div class="info-line" style="margin-top:6px;">
          <strong>BCI:</strong> 00080000123456789 (IBAN: MZ5900080000123456789)<br>
          <strong>Millennium BIM:</strong> 00010000987654321 (IBAN: MZ5900010000987654321)<br>
          <strong>Titular:</strong> ${comp.nomeJuridico}<br>
          <em style="color:#64748B;">*Por favor inclua o número da fatura <strong>${invoice.invoiceNumber}</strong> no descritivo bancário.</em>
        </div>
      </div>

      <div class="totals-box">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span class="font-mono font-bold">${invoice.subtotal.toLocaleString('pt-MZ')} MZN</span>
        </div>
        <div class="summary-row">
          <span>IVA (16% Legislação MZ):</span>
          <span class="font-mono font-bold">${invoice.taxAmount.toLocaleString('pt-MZ')} MZN</span>
        </div>
        <div class="summary-row grand-total">
          <span>TOTAL FATURA:</span>
          <span class="font-mono text-orange">${invoice.totalAmount.toLocaleString('pt-MZ')} MZN</span>
        </div>
        <div class="summary-row" style="margin-top:6px; color:#15803D; font-weight:700;">
          <span>Valor Liquidado:</span>
          <span class="font-mono">${invoice.paidAmount.toLocaleString('pt-MZ')} MZN</span>
        </div>
      </div>
    </div>

    <div class="signature-grid">
      <div class="signature-card">
        <div class="sig-label">DEPARTAMENTO FINANCEIRO / FATURAÇÃO</div>
        <div class="sig-line-mark"></div>
        <div class="sig-label">${comp.nomeJuridico}</div>
      </div>
      <div class="signature-card">
        <div class="sig-label">CONFIRMAÇÃO DE RECEPÇÃO DO CLIENTE</div>
        <div class="sig-line-mark"></div>
        <div class="sig-label">Assinatura & Carimbo do Adquirente</div>
      </div>
    </div>
  `;

  openPrintWindow(`Fatura_${invoice.invoiceNumber}`, content);
}

/**
 * Print Cotação Comercial
 */
export function printQuotation(quotation: QuotationItem, company?: Partial<CompanyProfile>) {
  const comp = { ...DEFAULT_COMPANY, ...company };

  const content = `
    <div style="margin-bottom: 20px;">
      <h2 class="doc-title-main">COTAÇÃO & PROPOSTA COMERCIAL DE TRANSPORTE</h2>
      <div class="doc-code">Nº da Cotação: ${quotation.quotationNumber}</div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <div class="info-box-title">PROPOSTA DESTINADA A</div>
        <div class="info-box-value">${quotation.customerName}</div>
        <div class="info-line">
          Cliente Corporativo Credenciado<br>
          Moçambique / Região da SADC
        </div>
      </div>

      <div class="info-box">
        <div class="info-box-title">CONDIÇÕES DA COTAÇÃO</div>
        <div class="info-line">
          <strong>Data de Emissão:</strong> ${new Date().toLocaleDateString('pt-MZ')}<br>
          <strong>Validade até:</strong> <strong>${quotation.validUntil}</strong><br>
          <strong>Estado Atual:</strong> 
          <span style="display:inline-block; padding:2px 8px; border-radius:4px; font-weight:800; font-size:10px; background:#FEF3C7; color:#B45309;">
            ${quotation.status}
          </span>
        </div>
      </div>
    </div>

    <div class="info-box" style="margin-bottom:22px; background:#F8FAFC; border: 1.5px solid #CBD5E1;">
      <div class="info-box-title">ESPECIFICAÇÕES DA ROTA & DESCRIÇÃO DA CARGA</div>
      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:14px; margin-top:10px;">
        <div>
          <span style="color:#64748B; font-size:9.5px; display:block; font-weight:700;">ORIGEM</span>
          <strong style="color:#0F172A; font-size:12px;">${quotation.origin}</strong>
        </div>
        <div>
          <span style="color:#64748B; font-size:9.5px; display:block; font-weight:700;">DESTINO</span>
          <strong style="color:#0F172A; font-size:12px;">${quotation.destination}</strong>
        </div>
        <div>
          <span style="color:#64748B; font-size:9.5px; display:block; font-weight:700;">DESCRIÇÃO DA CARGA</span>
          <strong style="color:#0F172A; font-size:12px;">${quotation.cargoDescription}</strong>
        </div>
      </div>
    </div>

    <div class="table-wrap">
      <table class="doc-table">
        <thead>
          <tr>
            <th>Discriminação dos Serviços Incluídos na Proposta</th>
            <th class="text-right">Valor Orçamentado (MZN)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong style="font-size:12px; color:#0F172A;">Transporte Rodoviário Especializado com Frota Pesada N'Tandinho</strong><br>
              <span style="color:#64748B; font-size:10.5px;">Serviço de Frete Dedicado • Inclui Seguro de Carga, Rastreio GPS 24/7 e Diárias de Condutor Credenciado SADC.</span>
            </td>
            <td class="text-right font-mono font-black text-emerald" style="font-size:14px;">
              ${quotation.totalPrice.toLocaleString('pt-MZ')} MZN
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="summary-grid">
      <div class="bank-details-box">
        <div class="info-box-title">GARANTIAS N'TANDINHO S.A.</div>
        <div class="info-line">
          • Veículos com inspecção técnica em dia e cobertura de seguro integral.<br>
          • Motoristas qualificados para o corredor da SADC.<br>
          • Proposta válida para aceitação formal dentro do prazo indicado.
        </div>
      </div>

      <div class="totals-box">
        <div class="summary-row grand-total">
          <span>VALOR TOTAL COTAÇÃO:</span>
          <span class="font-mono text-orange">${quotation.totalPrice.toLocaleString('pt-MZ')} MZN</span>
        </div>
      </div>
    </div>

    <div class="signature-grid">
      <div class="signature-card">
        <div class="sig-label">DEPARTAMENTO COMERCIAL N'TANDINHO</div>
        <div class="sig-line-mark"></div>
        <div class="sig-label">Gestor Comercial</div>
      </div>
      <div class="signature-card">
        <div class="sig-label">ACEITAÇÃO DO CLIENTE SOLICITANTE</div>
        <div class="sig-line-mark"></div>
        <div class="sig-label">Assinatura & Data de Aceitação</div>
      </div>
    </div>
  `;

  openPrintWindow(`Cotacao_${quotation.quotationNumber}_${comp.nomeComercial}`, content);
}

/**
 * Print Recibo de Liquidação de Pagamento
 */
export function printPaymentReceipt(payment: PaymentItem, company?: Partial<CompanyProfile>) {
  const comp = { ...DEFAULT_COMPANY, ...company };

  const content = `
    <div style="margin-bottom: 20px;">
      <h2 class="doc-title-main">RECIBO DE QUITAÇÃO DE PAGAMENTO</h2>
      <div class="doc-code">Nº do Recibo: ${payment.paymentNumber}</div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <div class="info-box-title">RECIBO EMITIDO A FAVOR DE</div>
        <div class="info-box-value">${payment.customerName}</div>
        <div class="info-line">
          Cliente Liquidador Corporativo
        </div>
      </div>

      <div class="info-box">
        <div class="info-box-title">DADOS DA LIQUIDAÇÃO</div>
        <div class="info-line">
          <strong>Fatura de Origem:</strong> ${payment.invoiceNumber}<br>
          <strong>Data de Pagamento:</strong> ${payment.paidAt}<br>
          <strong>Estado de Liquidação:</strong> <span style="color:#15803D; font-weight:800;">TOTALMENTE QUITADO</span>
        </div>
      </div>
    </div>

    <div class="info-box" style="margin-bottom:24px; background:#F0FDF4; border: 1.5px solid #86EFAC;">
      <div class="info-box-title" style="color:#166534;">DECLARAÇÃO DE QUITAÇÃO BANCÁRIA</div>
      <p style="font-size:11px; color:#14532D; margin:6px 0 12px 0; line-height:1.6;">
        Declaramos para os devidos efeitos que recebemos da firma <strong>${payment.customerName}</strong> a quantia supra discriminada, referente ao pagamento integral da Fatura <strong>${payment.invoiceNumber}</strong>.
      </p>
      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:14px; padding-top:10px; border-top:1px solid #BBF7D0;">
        <div>
          <span style="color:#166534; font-size:9.5px; display:block; font-weight:700;">MÉTODO DE PAGAMENTO</span>
          <strong style="color:#0F172A; font-size:12px;">${payment.method}</strong>
        </div>
        <div>
          <span style="color:#166534; font-size:9.5px; display:block; font-weight:700;">REF. COMPROVATIVO</span>
          <strong class="font-mono" style="color:#0F172A; font-size:12px;">${payment.referenceNo}</strong>
        </div>
        <div>
          <span style="color:#166534; font-size:9.5px; display:block; font-weight:700;">VALOR RECEBIDO</span>
          <strong class="font-mono text-emerald" style="font-size:15px;">${payment.amountMzn.toLocaleString('pt-MZ')} MZN</strong>
        </div>
      </div>
    </div>

    <div class="signature-grid">
      <div class="signature-card">
        <div class="sig-label">TESOURARIA & DEPARTAMENTO FINANCEIRO</div>
        <div class="sig-line-mark"></div>
        <div class="sig-label">${comp.nomeJuridico}</div>
      </div>
      <div class="signature-card">
        <div class="sig-label">AUTENTICAÇÃO & CARIMBO</div>
        <div class="sig-line-mark"></div>
        <div class="sig-label">Carimbo de Liquidação Efetivada</div>
      </div>
    </div>
  `;

  openPrintWindow(`Recibo_${payment.paymentNumber}`, content);
}

/**
 * Print Relatórios de Módulos (Geral A4 Executivo)
 */
export function printGeneralReport(title: string, headers: string[], rows: any[][], company?: Partial<CompanyProfile>) {
  const comp = { ...DEFAULT_COMPANY, ...company };

  const tableHeaderHtml = headers.map((h) => `<th>${h}</th>`).join('');
  const tableRowsHtml = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell ?? '—'}</td>`).join('')}</tr>`)
    .join('');

  const content = `
    <div style="margin-bottom:20px;">
      <h2 class="doc-title-main" style="font-size:16px;">${title.toUpperCase()}</h2>
      <div class="doc-code">Relatório Analítico Oficial • ERP N'Tandinho Transportes</div>
    </div>

    <div class="info-grid" style="margin-bottom:20px;">
      <div class="info-box">
        <div class="info-box-title">ENTIDADE EMISSORA</div>
        <div class="info-box-value">${comp.nomeJuridico}</div>
        <div class="info-line">
          <strong>NUIT:</strong> ${comp.nuit}<br>
          <strong>Sede:</strong> ${comp.address}, ${comp.city}, Moçambique
        </div>
      </div>

      <div class="info-box">
        <div class="info-box-title">DADOS DO RELATÓRIO</div>
        <div class="info-line">
          <strong>Data de Emissão:</strong> ${new Date().toLocaleString('pt-MZ')}<br>
          <strong>Total de Registos Procesados:</strong> <span class="font-mono font-bold text-orange">${rows.length} registos</span><br>
          <strong>Estado do Documento:</strong> <span style="color:#15803D; font-weight:800;">VALIDADO E AUDITADO</span>
        </div>
      </div>
    </div>

    <div class="table-wrap">
      <table class="doc-table">
        <thead>
          <tr>${tableHeaderHtml}</tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    </div>

    <div class="signature-grid">
      <div class="signature-card">
        <div class="sig-label">RESPONSÁVEL OPERACIONAL / ANALISTA</div>
        <div class="sig-line-mark"></div>
        <div class="sig-label">${comp.nomeJuridico}</div>
      </div>
      <div class="signature-card">
        <div class="sig-label">AUTENTICAÇÃO & CARIMBO OFICIAL</div>
        <div class="sig-line-mark"></div>
        <div class="sig-label">Visto de Auditoria ERP N'Tandinho</div>
      </div>
    </div>
  `;

  openPrintWindow(`Relatorio_${title.replace(/\s+/g, '_')}`, content);
}

