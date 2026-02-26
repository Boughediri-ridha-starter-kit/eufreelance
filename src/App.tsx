import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  User, 
  Star, 
  Calendar, 
  ChevronRight, 
  Menu, 
  X,
  Info,
  Check,
  RefreshCcw,
  GraduationCap,
  Briefcase,
  Globe,
  ExternalLink,
  FileText,
  Plus,
  Trash2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Professor, SalaryData, EUCountry } from './types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EU_COUNTRIES: EUCountry[] = [
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    defaultTaxRate: 10,
    vatRate: 20,
    statuses: [
      { id: 'micro', label: 'Auto', socialChargesRate: 0.22 },
      { id: 'sasu', label: 'SASU', socialChargesRate: 0.45 },
      { id: 'eurl', label: 'EURL', socialChargesRate: 0.42 },
      { id: 'portage', label: 'Portage', socialChargesRate: 0.50 }
    ],
    govLinks: [
      { label: 'Service-Public.fr', url: 'https://www.service-public.fr' },
      { label: 'Impots.gouv.fr', url: 'https://www.impots.gouv.fr' },
      { label: 'URSSAF', url: 'https://www.urssaf.fr' }
    ],
    translations: {
      simulatorTitle: 'Simulateur Freelance France',
      grossIncome: 'Revenus Bruts',
      netIncome: 'Revenus Nets',
      dayRate: 'TJM Brut',
      monthlyGross: 'Mensuel brut',
      netDay: 'Journalier net',
      netMonth: 'Mensuel net',
      legalStatus: 'Statut Juridique',
      workTime: 'Temps de travail',
      withholdingTax: 'Prélèvement à la source',
      netAfterTax: 'Net après impôts',
      invoiceGenerator: 'Générateur de Facture',
      companyName: 'Votre Entreprise',
      clientName: 'Client',
      description: 'Description',
      quantity: 'Qté',
      unitPrice: 'Prix Unit. (€)',
      generateInvoice: 'Générer la Facture (PDF)',
      totalTTC: 'Total TTC',
      vat: 'TVA',
      subtotal: 'Total HT',
      articlesServices: 'Articles / Services',
      addLine: 'Ajouter une ligne',
      needExpert: "Besoin d'un expert en",
      euCommunity: 'Construit pour la communauté européenne.'
    }
  },
  {
    code: 'DE',
    name: 'Deutschland',
    flag: '🇩🇪',
    defaultTaxRate: 15,
    vatRate: 19,
    statuses: [
      { id: 'klein', label: 'Kleinunternehmer', socialChargesRate: 0.30 },
      { id: 'einzel', label: 'Einzelunternehmer', socialChargesRate: 0.35 },
      { id: 'ug', label: 'UG (Mini-GmbH)', socialChargesRate: 0.45 },
      { id: 'gmbh', label: 'GmbH', socialChargesRate: 0.48 }
    ],
    govLinks: [
      { label: 'Bundesregierung', url: 'https://www.bundesregierung.de' },
      { label: 'ELSTER (Tax)', url: 'https://www.elster.de' },
      { label: 'Arbeitsagentur', url: 'https://www.arbeitsagentur.de' }
    ],
    translations: {
      simulatorTitle: 'Freelance-Simulator Deutschland',
      grossIncome: 'Bruttoeinkommen',
      netIncome: 'Nettoeinkommen',
      dayRate: 'Tagessatz Brutto',
      monthlyGross: 'Monatlich Brutto',
      netDay: 'Täglich Netto',
      netMonth: 'Monatlich Netto',
      legalStatus: 'Rechtsform',
      workTime: 'Arbeitszeit',
      withholdingTax: 'Quellensteuer',
      netAfterTax: 'Netto nach Steuern',
      invoiceGenerator: 'Rechnungsersteller',
      companyName: 'Ihr Unternehmen',
      clientName: 'Kunde',
      description: 'Beschreibung',
      quantity: 'Menge',
      unitPrice: 'Einzelpreis (€)',
      generateInvoice: 'Rechnung erstellen (PDF)',
      totalTTC: 'Gesamtbetrag',
      vat: 'MwSt',
      subtotal: 'Zwischensumme',
      articlesServices: 'Artikel / Dienstleistungen',
      addLine: 'Zeile hinzufügen',
      needExpert: 'Brauchen Sie einen Experten in',
      euCommunity: 'Für die europäische Gemeinschaft gebaut.'
    }
  },
  {
    code: 'ES',
    name: 'España',
    flag: '🇪🇸',
    defaultTaxRate: 12,
    vatRate: 21,
    statuses: [
      { id: 'autonomo', label: 'Autónomo', socialChargesRate: 0.30 },
      { id: 'sl', label: 'S.L.', socialChargesRate: 0.40 },
      { id: 'coop', label: 'Cooperativa', socialChargesRate: 0.35 }
    ],
    govLinks: [
      { label: 'La Moncloa', url: 'https://www.lamoncloa.gob.es' },
      { label: 'Agencia Tributaria', url: 'https://www.agenciatributaria.es' },
      { label: 'Seguridad Social', url: 'https://www.seg-social.es' }
    ],
    translations: {
      simulatorTitle: 'Simulador Freelance España',
      grossIncome: 'Ingresos Brutos',
      netIncome: 'Ingresos Netos',
      dayRate: 'Tarifa Diaria Bruta',
      monthlyGross: 'Mensual Bruto',
      netDay: 'Diario Neto',
      netMonth: 'Mensual Neto',
      legalStatus: 'Estado Legal',
      workTime: 'Tiempo de Trabajo',
      withholdingTax: 'Retención de IRPF',
      netAfterTax: 'Neto después de Impuestos',
      invoiceGenerator: 'Generador de Facturas',
      companyName: 'Su Empresa',
      clientName: 'Cliente',
      description: 'Descripción',
      quantity: 'Cant.',
      unitPrice: 'Precio Unit. (€)',
      generateInvoice: 'Generar Factura (PDF)',
      totalTTC: 'Total con IVA',
      vat: 'IVA',
      subtotal: 'Subtotal',
      articlesServices: 'Artículos / Servicios',
      addLine: 'Añadir línea',
      needExpert: '¿Necesita un experto en',
      euCommunity: 'Construido para la comunidad europea.'
    }
  },
  {
    code: 'IT',
    name: 'Italia',
    flag: '🇮🇹',
    defaultTaxRate: 14,
    vatRate: 22,
    statuses: [
      { id: 'forfettario', label: 'Forfettario', socialChargesRate: 0.15 },
      { id: 'individuale', label: 'Ditta Indiv.', socialChargesRate: 0.30 },
      { id: 'srl', label: 'S.R.L.', socialChargesRate: 0.45 }
    ],
    govLinks: [
      { label: 'Governo Italiano', url: 'https://www.governo.it' },
      { label: 'Agenzia delle Entrate', url: 'https://www.agenziaentrate.gov.it' },
      { label: 'INPS', url: 'https://www.inps.it' }
    ],
    translations: {
      simulatorTitle: 'Simulatore Freelance Italia',
      grossIncome: 'Reddito Lordo',
      netIncome: 'Reddito Netto',
      dayRate: 'Tariffa Giornaliera Lorda',
      monthlyGross: 'Mensile Lordo',
      netDay: 'Giornaliero Netto',
      netMonth: 'Mensile Netto',
      legalStatus: 'Stato Giuridico',
      workTime: 'Tempo di Lavoro',
      withholdingTax: 'Ritenuta d\'Acconto',
      netAfterTax: 'Netto dopo le Tasse',
      invoiceGenerator: 'Generatore di Fatture',
      companyName: 'La Tua Azienda',
      clientName: 'Cliente',
      description: 'Descrizione',
      quantity: 'Qtà',
      unitPrice: 'Prezzo Unit. (€)',
      generateInvoice: 'Genera Fattura (PDF)',
      totalTTC: 'Totale IVATO',
      vat: 'IVA',
      subtotal: 'Subtotale',
      articlesServices: 'Articoli / Servizi',
      addLine: 'Aggiungi riga',
      needExpert: 'Hai bisogno di un esperto in',
      euCommunity: 'Costruito per la comunità europea.'
    }
  }
];

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export default function App() {
  const [brutAnnuel, setBrutAnnuel] = useState<number>(60000);
  const [statusId, setStatusId] = useState<string>(EU_COUNTRIES[0].statuses[0].id);
  const [workTime, setWorkTime] = useState<number>(100);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<EUCountry>(EU_COUNTRIES[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [searchQuery, setSearchQuery] = useState({ discipline: '', level: '', professor: '' });

  // Invoice State
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '12345',
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    vatRate: selectedCountry.vatRate,
    iban: '',
    bic: '',
    logo: null as string | null,
    items: [{ description: '', quantity: 1, price: 0 }] as InvoiceItem[]
  });

  useEffect(() => {
    setTaxRate(selectedCountry.defaultTaxRate);
    setStatusId(selectedCountry.statuses[0].id);
    setInvoiceData(prev => ({ ...prev, vatRate: selectedCountry.vatRate }));
  }, [selectedCountry]);

  const addInvoiceItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeInvoiceItem = (index: number) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const calculateInvoiceTotals = () => {
    const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const vatAmount = subtotal * (invoiceData.vatRate / 100);
    return { subtotal, vatAmount, total: subtotal + vatAmount };
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const { subtotal, vatAmount, total } = calculateInvoiceTotals();
    const t = selectedCountry.translations;

    // --- Header Design ---
    doc.setFillColor(45, 45, 45); // Dark gray
    doc.rect(0, 0, 210, 25, 'F');
    
    // Simple curve effect using a triangle
    doc.setFillColor(45, 45, 45);
    doc.triangle(0, 25, 210, 25, 210, 35, 'F');

    // Title
    doc.setTextColor(0, 0, 0);
    
    // Uploaded Logo
    if (invoiceData.logo) {
      try {
        doc.addImage(invoiceData.logo, 'PNG', 20, 35, 25, 25);
      } catch (e) {
        console.error("Error adding logo to PDF:", e);
      }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.text('FACTURE', 20, 70);

    // Metadata (Top Right)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const date = new Date().toLocaleDateString();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
    doc.text(`DATE : ${date}`, 190, 53, { align: 'right' });
    doc.text(`ÉCHÉANCE : ${dueDate}`, 190, 60, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`FACTURE N° : ${invoiceData.invoiceNumber}`, 190, 73, { align: 'right' });

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 83, 190, 83);

    // Parties
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('ÉMETTEUR :', 20, 93);
    doc.text('DESTINATAIRE :', 140, 93);

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(invoiceData.companyName || 'Votre Entreprise', 20, 100);
    doc.text(invoiceData.clientName || 'Nom du Client', 140, 100);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    
    // Company details
    let companyY = 106;
    if (invoiceData.companyPhone) { doc.text(invoiceData.companyPhone, 20, companyY); companyY += 5; }
    if (invoiceData.companyEmail) { doc.text(invoiceData.companyEmail, 20, companyY); companyY += 5; }
    if (invoiceData.companyAddress) { 
      const addr = doc.splitTextToSize(invoiceData.companyAddress, 60);
      doc.text(addr, 20, companyY);
    }

    // Client details
    let clientY = 106;
    if (invoiceData.clientEmail) { doc.text(invoiceData.clientEmail, 140, clientY); clientY += 5; }
    if (invoiceData.clientAddress) {
      const addr = doc.splitTextToSize(invoiceData.clientAddress, 60);
      doc.text(addr, 140, clientY);
    }

    // --- Table ---
    const tableData = invoiceData.items.map(item => [
      item.description,
      `${item.price.toFixed(2)} €`,
      item.quantity.toString(),
      `${(item.quantity * item.price).toFixed(2)} €`
    ]);

    autoTable(doc, {
      startY: 135,
      head: [['Description :', 'Prix Unitaire :', 'Quantité :', 'Total :']],
      body: tableData,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [0, 0, 0], 
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { halign: 'right' },
        2: { halign: 'center' },
        3: { halign: 'right' }
      },
      didDrawCell: (data) => {
        if (data.section === 'head') {
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.5);
          doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
        if (data.section === 'body') {
          doc.setDrawColor(230, 230, 230);
          doc.setLineWidth(0.1);
          doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
      }
    });

    // --- Footer Section ---
    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Payment Info (Left)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('RÈGLEMENT :', 20, finalY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Par virement bancaire :', 20, finalY + 8);
    doc.text(`IBAN : ${invoiceData.iban || '---'}`, 20, finalY + 14);
    doc.text(`BIC : ${invoiceData.bic || '---'}`, 20, finalY + 20);

    // Totals (Right)
    const totalX = 140;
    doc.setFontSize(10);
    doc.text('TOTAL HT :', totalX, finalY);
    doc.text(`${subtotal.toFixed(2)} €`, 190, finalY, { align: 'right' });
    
    doc.text(`TVA ${invoiceData.vatRate}% :`, totalX, finalY + 8);
    doc.text(`${vatAmount.toFixed(2)} €`, 190, finalY + 8, { align: 'right' });
    
    doc.text('REMISE :', totalX, finalY + 16);
    doc.text('-', 190, finalY + 16, { align: 'right' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL TTC :', totalX, finalY + 26);
    doc.text(`${total.toFixed(2)} €`, 190, finalY + 26, { align: 'right' });

    // Blue Footer Curve
    doc.setFillColor(220, 235, 235); // Light teal/blue
    doc.triangle(0, 280, 0, 297, 210, 297, 'F');
    doc.rect(0, 285, 210, 12, 'F');

    doc.save(`Facture_${invoiceData.invoiceNumber}_${invoiceData.clientName.replace(/\s+/g, '_')}.pdf`);
  };

  // Freelance Calculation Logic
  const salary = useMemo((): SalaryData => {
    const adjustedBrut = (brutAnnuel * workTime) / 100;
    const currentStatus = selectedCountry.statuses.find(s => s.id === statusId) || selectedCountry.statuses[0];
    const socialChargesRate = currentStatus.socialChargesRate;

    const socialCharges = adjustedBrut * socialChargesRate;
    const netAnnuel = adjustedBrut - socialCharges;
    const taxAmount = netAnnuel * (taxRate / 100);
    const netApresImpotTotal = netAnnuel - taxAmount;

    const workingDaysPerYear = 218;
    const workingHoursPerMonth = 140;

    return {
      brutAnnuel: adjustedBrut,
      brutMensuel: adjustedBrut / 12,
      brutJournalier: adjustedBrut / workingDaysPerYear,
      brutHoraire: adjustedBrut / (12 * workingHoursPerMonth),
      netAnnuel,
      netMensuel: netAnnuel / 12,
      netJournalier: netAnnuel / workingDaysPerYear,
      netHoraire: netAnnuel / (12 * workingHoursPerMonth),
      netApresImpot: netApresImpotTotal / 12,
      taxAmount,
      socialCharges
    };
  }, [brutAnnuel, statusId, workTime, taxRate, selectedCountry]);

  useEffect(() => {
    fetch('/api/professors')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setProfessors(data))
      .catch(err => {
        console.warn("API not available (static host), using empty professors list.");
        setProfessors([]);
      });
  }, []);

  const resetFields = () => {
    setBrutAnnuel(0);
    setWorkTime(100);
    setTaxRate(selectedCountry.defaultTaxRate);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#DAE0E6]">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center text-white font-bold">
                <Globe size={20} />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">EU<span className="text-[#FF4500]">Freelance</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                <Globe size={14} className="text-slate-500" />
                <select 
                  className="bg-transparent text-xs font-bold outline-none cursor-pointer"
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const country = EU_COUNTRIES.find(c => c.code === e.target.value);
                    if (country) setSelectedCountry(country);
                  }}
                >
                  {EU_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
              <button className="bg-[#FF4500] hover:bg-[#E03D00] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm">
                Log In
              </button>
            </div>

            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Changer de pays</label>
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                    <Globe size={16} className="text-slate-500" />
                    <select 
                      className="bg-transparent text-sm font-bold outline-none cursor-pointer flex-grow"
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const country = EU_COUNTRIES.find(c => c.code === e.target.value);
                        if (country) {
                          setSelectedCountry(country);
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      {EU_COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button className="w-full bg-[#FF4500] hover:bg-[#E03D00] text-white py-3 rounded-lg text-sm font-bold transition-all shadow-sm">
                  Log In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        {/* Reddit Orange Header Section */}
        <section className="bg-[#FF4500] text-white py-8 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">{selectedCountry.flag}</span>
              <h1 className="text-2xl font-bold">{selectedCountry.translations.simulatorTitle}</h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Left Column: Inputs & Results */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {/* Gross Inputs */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-80">{selectedCountry.translations.grossIncome}</h3>
                    <div>
                      <label className="block text-[10px] mb-1 font-bold uppercase opacity-70">{selectedCountry.translations.dayRate}</label>
                      <input 
                        type="number" 
                        className="w-full bg-white text-slate-900 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                        value={Math.round(salary.brutJournalier)}
                        onChange={(e) => setBrutAnnuel(Number(e.target.value) * 218)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] mb-1 font-bold uppercase opacity-70">{selectedCountry.translations.monthlyGross}</label>
                      <input 
                        type="number" 
                        className="w-full bg-white text-slate-900 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                        value={Math.round(salary.brutMensuel)}
                        onChange={(e) => setBrutAnnuel(Number(e.target.value) * 12)}
                      />
                    </div>
                  </div>

                  {/* Net Results */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-80">{selectedCountry.translations.netIncome}</h3>
                    <div>
                      <label className="block text-[10px] mb-1 font-bold uppercase opacity-70">{selectedCountry.translations.netDay}</label>
                      <div className="w-full bg-white/10 border border-white/20 text-white rounded-md py-2 px-3 min-h-[40px] font-bold">
                        {Math.round(salary.netJournalier).toLocaleString()} €
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] mb-1 font-bold uppercase opacity-70">{selectedCountry.translations.netMonth}</label>
                      <div className="w-full bg-white/10 border border-white/20 text-white rounded-md py-2 px-3 min-h-[40px] font-bold">
                        {Math.round(salary.netMensuel).toLocaleString()} €
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest opacity-80">{selectedCountry.translations.legalStatus}</h3>
                  <div className="bg-black/10 p-3 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedCountry.statuses.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setStatusId(item.id)}
                        className="flex flex-col items-center gap-1.5 group"
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${statusId === item.id ? 'bg-white border-white' : 'border-white/40 group-hover:border-white'}`}>
                          {statusId === item.id && <Check size={12} className="text-[#FF4500]" />}
                        </div>
                        <span className={`text-[9px] text-center font-black uppercase tracking-tight ${statusId === item.id ? 'opacity-100' : 'opacity-60'}`}>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Sliders & Final Result */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-widest">
                      <span>{selectedCountry.translations.workTime}</span>
                      <span>{workTime}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={workTime}
                      onChange={(e) => setWorkTime(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-widest">
                      <span>{selectedCountry.translations.withholdingTax}</span>
                      <span>{taxRate}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="45" 
                      step="0.5"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                  <h3 className="text-xs font-black uppercase tracking-widest mb-3 opacity-80">{selectedCountry.translations.netAfterTax}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] mb-1 font-bold uppercase opacity-70">{selectedCountry.translations.netMonth}</label>
                      <div className="text-2xl font-black">
                        {Math.round(salary.netApresImpot).toLocaleString()} €
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] mb-1 font-bold uppercase opacity-70">Annuel</label>
                      <div className="text-2xl font-black">
                        {Math.round(salary.netApresImpot * 12).toLocaleString()} €
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={resetFields}
                    className="flex-grow bg-white/10 hover:bg-white/20 border border-white/30 text-white py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={14} />
                    Reset
                  </button>
                  <button className="flex-grow bg-[#0079D3] hover:bg-[#005FA3] text-white py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all shadow-md">
                    Save Report
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Government Links Section */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <Globe className="text-[#FF4500]" size={24} />
              <h2 className="text-xl font-bold text-slate-900">Ressources Gouvernementales ({selectedCountry.name})</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {selectedCountry.govLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-[#FF4500] hover:bg-white transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Portail Officiel</span>
                    <span className="font-bold text-slate-900">{link.label}</span>
                  </div>
                  <ExternalLink size={18} className="text-slate-300 group-hover:text-[#FF4500] transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Invoice Generator Section */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <FileText className="text-[#FF4500]" size={24} />
              <h2 className="text-xl font-bold text-slate-900">{selectedCountry.translations.invoiceGenerator}</h2>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 lg:p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-1">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">N° Facture</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-200 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Logo (PNG/JPG)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg"
                      className="hidden"
                      id="logo-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setInvoiceData({ ...invoiceData, logo: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label 
                      htmlFor="logo-upload"
                      className="cursor-pointer bg-white border border-slate-200 rounded-md py-2 px-4 text-xs font-bold text-[#0079D3] hover:bg-slate-50 transition-colors"
                    >
                      Choisir un fichier
                    </label>
                    {invoiceData.logo && (
                      <div className="relative group">
                        <img src={invoiceData.logo} alt="Logo preview" className="h-10 w-10 object-contain rounded border border-slate-200" />
                        <button 
                          onClick={() => setInvoiceData({ ...invoiceData, logo: null })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Emetteur */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4500]">Émetteur</h3>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{selectedCountry.translations.companyName}</label>
                    <input 
                      type="text" 
                      placeholder={selectedCountry.translations.companyName}
                      className="w-full bg-white border border-slate-200 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                      value={invoiceData.companyName}
                      onChange={(e) => setInvoiceData({ ...invoiceData, companyName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Adresse</label>
                    <textarea 
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                      value={invoiceData.companyAddress}
                      onChange={(e) => setInvoiceData({ ...invoiceData, companyAddress: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full bg-white border border-slate-200 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                        value={invoiceData.companyEmail}
                        onChange={(e) => setInvoiceData({ ...invoiceData, companyEmail: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Téléphone</label>
                      <input 
                        type="text" 
                        className="w-full bg-white border border-slate-200 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                        value={invoiceData.companyPhone}
                        onChange={(e) => setInvoiceData({ ...invoiceData, companyPhone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Destinataire */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4500]">Destinataire</h3>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{selectedCountry.translations.clientName}</label>
                    <input 
                      type="text" 
                      placeholder={selectedCountry.translations.clientName}
                      className="w-full bg-white border border-slate-200 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                      value={invoiceData.clientName}
                      onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Adresse Client</label>
                    <textarea 
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                      value={invoiceData.clientAddress}
                      onChange={(e) => setInvoiceData({ ...invoiceData, clientAddress: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Client</label>
                    <input 
                      type="email" 
                      className="w-full bg-white border border-slate-200 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                      value={invoiceData.clientEmail}
                      onChange={(e) => setInvoiceData({ ...invoiceData, clientEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid md:grid-cols-2 gap-8 mb-8 p-4 bg-white rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">IBAN</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                    value={invoiceData.iban}
                    onChange={(e) => setInvoiceData({ ...invoiceData, iban: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">BIC</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-[#0079D3]"
                    value={invoiceData.bic}
                    onChange={(e) => setInvoiceData({ ...invoiceData, bic: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{selectedCountry.translations.articlesServices}</h3>
                  <button 
                    onClick={addInvoiceItem}
                    className="text-[#0079D3] hover:text-[#005FA3] flex items-center gap-1 text-xs font-bold"
                  >
                    <Plus size={14} /> {selectedCountry.translations.addLine}
                  </button>
                </div>

                {invoiceData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-3 items-end p-4 md:p-0 bg-white md:bg-transparent rounded-xl border border-slate-200 md:border-0">
                    <div className="col-span-1 md:col-span-5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{selectedCountry.translations.description}</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Prestation de développement"
                        className="w-full bg-white border border-slate-200 rounded-md py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-[#0079D3]"
                        value={item.description}
                        onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 md:contents gap-3">
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{selectedCountry.translations.quantity}</label>
                        <input 
                          type="number" 
                          className="w-full bg-white border border-slate-200 rounded-md py-2 px-2 text-sm outline-none focus:ring-2 focus:ring-[#0079D3] text-center"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(index, 'quantity', Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-2 md:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{selectedCountry.translations.unitPrice}</label>
                        <input 
                          type="number" 
                          className="w-full bg-white border border-slate-200 rounded-md py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-[#0079D3]"
                          value={item.price}
                          onChange={(e) => updateInvoiceItem(index, 'price', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end md:justify-center pb-2">
                      <button 
                        onClick={() => removeInvoiceItem(index)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{selectedCountry.translations.vat} (%)</label>
                    <input 
                      type="number" 
                      className="w-20 bg-white border border-slate-200 rounded-md py-2 px-3 text-sm outline-none"
                      value={invoiceData.vatRate}
                      onChange={(e) => setInvoiceData({ ...invoiceData, vatRate: Number(e.target.value) })}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{selectedCountry.translations.totalTTC}</p>
                    <p className="text-2xl font-black text-slate-900">{calculateInvoiceTotals().total.toFixed(2)} €</p>
                  </div>
                </div>
                <button 
                  onClick={generatePDF}
                  className="w-full md:w-auto bg-[#FF4500] hover:bg-[#E03D00] text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Download size={18} />
                  {selectedCountry.translations.generateInvoice}
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* Common Good Section */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-6">
              <Globe size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Un Bien Commun pour les Freelances</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              EUFreelance est un outil 100% gratuit, conçu comme un bien commun pour soutenir la communauté des travailleurs indépendants en Europe. Notre mission est d'apporter de la transparence fiscale et de simplifier la gestion administrative pour tous.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xl font-bold text-slate-900">Gratuit</p>
                <p className="text-[10px] text-slate-500 uppercase font-black">Sans frais</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xl font-bold text-slate-900">Open</p>
                <p className="text-[10px] text-slate-500 uppercase font-black">Communauté</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xl font-bold text-slate-900">EU</p>
                <p className="text-[10px] text-slate-500 uppercase font-black">Multi-pays</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xl font-bold text-slate-900">Privé</p>
                <p className="text-[10px] text-slate-500 uppercase font-black">Vos données</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-[#DAE0E6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedCountry.translations.needExpert} {selectedCountry.name} ?</h2>
                <p className="text-sm text-slate-500">Tuteurs spécialisés en fiscalité européenne.</p>
              </div>
              <button className="text-xs font-bold text-[#0079D3] hover:underline">View All</button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {professors.slice(0, 4).map((prof) => (
                <div key={prof.id} className="bg-white rounded-md border border-slate-200 overflow-hidden hover:border-slate-400 transition-all cursor-pointer">
                  <div className="h-32 bg-slate-100 relative">
                    <img src={prof.image} alt={prof.name} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <Star size={10} className="text-[#FF4500] fill-[#FF4500]" />
                      {prof.rating}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-slate-900 mb-0.5">{prof.name}</h3>
                    <p className="text-[10px] font-bold text-[#FF4500] uppercase tracking-wider mb-2">{prof.discipline}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                      <span>{prof.price}€ / h</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#FF4500]">About</a>
            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#FF4500]">Careers</a>
            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#FF4500]">Privacy</a>
            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#FF4500]">Help</a>
          </div>
          <p className="text-[9px] text-slate-400 font-bold">© 2026 EUFreelance by boughediri.r. {selectedCountry.translations.euCommunity}</p>
        </div>
      </footer>
    </div>
  );
}
