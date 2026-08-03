// Print Templates Engine for CNAM Ordonnances & Factures (Tunisian Standards)

export function printCNAMPrescription(prescription, clinicConfig) {
  const printWindow = window.open('', '_blank');
  
  const regimeLabel = prescription.cnamRegime === 'regimeAP1'
    ? 'MALADIE CHRONIQUE (AP1 / ALD)'
    : prescription.cnamRegime === 'regimeAccident'
    ? 'ACCIDENT DE TRAVAIL (AT)'
    : 'RÉGIME MALADIE ORDINAIRE';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Ordonnance CNAM - ${prescription.patientName}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #111827;
          background: #fff;
          margin: 0;
          padding: 20px;
        }
        .ordonnance-card {
          border: 2px solid #0d9488;
          border-radius: 8px;
          padding: 24px;
          position: relative;
          min-height: 800px;
          box-sizing: border-box;
        }
        .header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #0d9488;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .doc-info h2 {
          margin: 0 0 4px 0;
          color: #0f766e;
          font-size: 22px;
          font-weight: 700;
        }
        .doc-info p {
          margin: 2px 0;
          font-size: 13px;
          color: #374151;
        }
        .cnam-badge-box {
          text-align: right;
        }
        .cnam-pill {
          background-color: #0d9488;
          color: white;
          padding: 6px 14px;
          font-weight: bold;
          border-radius: 20px;
          font-size: 12px;
          display: inline-block;
          letter-spacing: 0.5px;
        }
        .cnam-meta {
          margin-top: 8px;
          font-size: 12px;
          color: #4b5563;
        }
        .patient-banner {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 6px;
          padding: 12px 16px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
        .patient-banner strong {
          color: #166534;
        }
        .prescription-title {
          text-align: center;
          margin: 30px 0 20px 0;
          font-size: 24px;
          font-weight: bold;
          color: #0f766e;
          letter-spacing: 2px;
          text-decoration: underline;
        }
        .regime-tag {
          text-align: center;
          font-size: 12px;
          font-weight: bold;
          color: #dc2626;
          margin-bottom: 24px;
        }
        .meds-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }
        .meds-table th {
          background-color: #f3f4f6;
          border-bottom: 2px solid #d1d5db;
          padding: 10px;
          text-align: left;
          font-size: 13px;
          color: #374151;
        }
        .meds-table td {
          border-bottom: 1px solid #e5e7eb;
          padding: 12px 10px;
          font-size: 14px;
        }
        .med-name {
          font-weight: bold;
          color: #111827;
          font-size: 15px;
        }
        .rp-symbol {
          font-size: 20px;
          font-weight: bold;
          color: #0d9488;
          margin-right: 6px;
        }
        .footer-stamp {
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 20px;
          border-top: 1px dashed #cbd5e1;
        }
        .stamp-zone {
          border: 2px dashed #94a3b8;
          border-radius: 8px;
          width: 200px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 12px;
          text-align: center;
        }
        .signature-zone {
          text-align: center;
          width: 220px;
        }
        .signature-line {
          margin-top: 40px;
          border-bottom: 1px solid #000;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 15px; text-align: right;">
        <button onclick="window.print()" style="background:#0d9488; color:#fff; border:none; padding:10px 20px; font-weight:bold; border-radius:6px; cursor:pointer;">
          🖨️ Imprimer l'Ordonnance CNAM
        </button>
      </div>

      <div class="ordonnance-card">
        <div class="header">
          <div class="doc-info">
            <h2>${clinicConfig.doctorName || 'Dr. Youssef Ben Ali'}</h2>
            <p><strong>Spécialité:</strong> ${clinicConfig.specialty || 'Cardiologie & Médecine Générale'}</p>
            <p><strong>Adresse:</strong> ${clinicConfig.address || 'Tunis, El Menzah 6'}</p>
            <p><strong>Tél:</strong> ${clinicConfig.phone || '+216 71 234 567'}</p>
          </div>
          <div class="cnam-badge-box">
            <div class="cnam-pill">HOMOLOGUÉ CNAM TUNISIE</div>
            <div class="cnam-meta">
              <p><strong>Code CNAM:</strong> ${clinicConfig.codeCNAM || '14-8859-01'}</p>
              <p><strong>Matricule Fiscal:</strong> ${clinicConfig.matriculeFiscal || '1458923/A'}</p>
            </div>
          </div>
        </div>

        <div class="patient-banner">
          <div><strong>Patient(e):</strong> ${prescription.patientName}</div>
          <div><strong>CIN:</strong> ${prescription.cin || 'N/A'}</div>
          <div><strong>Date:</strong> ${prescription.date}</div>
        </div>

        <div class="prescription-title">ORDONNANCE MÉDICALE</div>
        <div class="regime-tag">CNAM - ${regimeLabel}</div>

        <table class="meds-table">
          <thead>
            <tr>
              <th><span class="rp-symbol">R/</span> Médicament & Forme</th>
              <th>Posologie & Prise</th>
              <th>Durée</th>
              <th>Subst.</th>
            </tr>
          </thead>
          <tbody>
            ${prescription.medications.map(med => `
              <tr>
                <td><span class="med-name">${med.name}</span></td>
                <td>${med.dosage}</td>
                <td>${med.duration}</td>
                <td>${med.substitutable ? 'Oui' : 'Non'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer-stamp">
          <div class="stamp-zone">
            Emplacement Cachet & Stamp Officiel du Médecin
          </div>
          <div class="signature-zone">
            <p style="margin: 0; font-size: 14px; font-weight: bold;">Signature du Médecin</p>
            <div class="signature-line"></div>
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

export function printInvoice(invoice, clinicConfig) {
  const printWindow = window.open('', '_blank');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Facture Médicale - ${invoice.id}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #111827;
          background: #fff;
          margin: 0;
          padding: 20px;
        }
        .invoice-box {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #0284c7;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .doc-title {
          font-size: 20px;
          font-weight: bold;
          color: #0369a1;
        }
        .inv-num {
          font-size: 22px;
          font-weight: bold;
          color: #0f172a;
          text-align: right;
        }
        .invoice-info-grid {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          background-color: #f8fafc;
          padding: 16px;
          border-radius: 6px;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .table th, .table td {
          border: 1px solid #e2e8f0;
          padding: 12px;
          text-align: left;
        }
        .table th {
          background-color: #f1f5f9;
          font-weight: 600;
        }
        .total-box {
          text-align: right;
          font-size: 18px;
          font-weight: bold;
          color: #0369a1;
        }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 15px; text-align: right;">
        <button onclick="window.print()" style="background:#0284c7; color:#fff; border:none; padding:10px 20px; font-weight:bold; border-radius:6px; cursor:pointer;">
          🖨️ Imprimer la Facture
        </button>
      </div>

      <div class="invoice-box">
        <div class="invoice-header">
          <div>
            <div class="doc-title">${clinicConfig.doctorName || 'Dr. Youssef Ben Ali'}</div>
            <div style="font-size: 13px; color: #475569; margin-top:4px;">${clinicConfig.specialty}</div>
            <div style="font-size: 12px; color: #64748b;">Code CNAM: ${clinicConfig.codeCNAM} | MF: ${clinicConfig.matriculeFiscal}</div>
            <div style="font-size: 12px; color: #64748b;">${clinicConfig.address}</div>
          </div>
          <div>
            <div class="inv-num">FACTURE N° ${invoice.id}</div>
            <div style="font-size: 13px; color: #64748b; text-align: right; margin-top:4px;">Date: ${invoice.date}</div>
          </div>
        </div>

        <div class="invoice-info-grid">
          <div>
            <strong>Facturé à:</strong><br/>
            <span style="font-size: 16px; color: #0f172a;">${invoice.patientName}</span>
          </div>
          <div>
            <strong>Mode de Règlement:</strong><br/>
            <span>${invoice.paymentMethod === 'cash' ? 'Espèces' : invoice.paymentMethod === 'check' ? 'Chèque Bancaire' : 'Tiers Payant CNAM'}</span>
          </div>
          <div>
            <strong>Statut:</strong><br/>
            <span style="color: ${invoice.paymentStatus === 'paid' ? '#16a34a' : '#d97706'}; font-weight: bold;">
              ${invoice.paymentStatus === 'paid' ? 'PAYÉE' : 'EN ATTENTE'}
            </span>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Désignation des Prestations Médicales</th>
              <th style="text-align: right;">Montant HT</th>
              <th style="text-align: right;">Total (TND)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${invoice.description}</td>
              <td style="text-align: right;">${invoice.amount.toFixed(2)} DT</td>
              <td style="text-align: right; font-weight: bold;">${invoice.amount.toFixed(2)} DT</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          TOTAL NET À PAYER: ${invoice.amount.toFixed(2)} DT (TND)
        </div>

        <div style="margin-top: 60px; text-align: right;">
          <p style="font-size: 13px; font-weight: bold; margin-bottom: 40px;">Cachet et Signature du Médecin</p>
          <div style="border-bottom: 1px solid #94a3b8; width: 200px; display: inline-block;"></div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
