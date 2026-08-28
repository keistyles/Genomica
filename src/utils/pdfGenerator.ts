import jsPDF from 'jspdf';
import { OverallAnalysisReport, TraitAnalysisResult } from '../types/genetics';

/**
 * Generates a comprehensive, highly detailed clinical/medical-grade Genomic Health Report PDF.
 * Includes all categories:
 * - Resumen Clínico del Paciente y Métricas Genómicas
 * - Vulnerabilidades de Salud & Riesgos Poligénicos
 * - Estado de Portador (Enfermedades Monogénicas Recesivas)
 * - Farmacogenética y Metabolismo de Fármacos
 * - Bienestar, Nutrición y Rendimiento Metabólico
 * - Rasgos Físicos y Fenotípicos
 * - Estimación de Ancestralidad y Linajes Materno/Paterno
 */
export async function generateGenomicHealthPdf(
  report: OverallAnalysisReport,
  lang: string = 'es'
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let y = margin;

  const totalPagesExp = '{total_pages_count_string}';

  const checkPageOverflow = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - 18) {
      doc.addPage();
      y = margin + 10;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('GENOMICA · INFORME GENÓMICO CLÍNICO Y PREVENTIVO', margin, 10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Muestra: ${report.fileMetadata.fileName.slice(0, 30)} | ${new Date(report.analysisTimestamp).toLocaleDateString()}`,
      pageWidth - margin,
      10,
      { align: 'right' }
    );
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  // --- COVER / HEADER SECTION ---
  // Top decorative bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 26, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('INFORME GENÓMICO CLÍNICO & DE SALUD INTEGRAL', margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(
    'Análisis integral de predisposiciones genéticas, farmacogenómica, estado de portador y bienestar metabólico.',
    margin + 6,
    y + 18
  );

  y += 32;

  // Patient / Sample Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('DATOS DE LA MUESTRA GENÓMICA', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const colW = contentWidth / 4;
  doc.text(`Archivo: ${report.fileMetadata.fileName}`, margin + 4, y + 12);
  doc.text(`Formato: ${report.fileMetadata.format}`, margin + 4, y + 18);

  doc.text(`SNPs Válidos: ${report.fileMetadata.validSNPsCount.toLocaleString()}`, margin + 4 + colW, y + 12);
  doc.text(`Cariotipo: ${report.fileMetadata.inferredSex || 'Indeterminado'}`, margin + 4 + colW, y + 18);

  doc.text(`Fecha Análisis: ${new Date(report.analysisTimestamp).toLocaleDateString()}`, margin + 4 + colW * 2, y + 12);
  doc.text(`Variantes Evaluadas: ${report.traitResults.length} paneles`, margin + 4 + colW * 2, y + 18);

  const elevatedCount = report.traitResults.filter((r) => r.riskStatus === 'elevated' || (r.trait.type === 'carrier' && r.isVariantPresent)).length;
  const carrierCount = report.traitResults.filter((r) => r.trait.type === 'carrier' && r.isVariantPresent).length;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text(`Alertas de Riesgo: ${elevatedCount}`, margin + 4 + colW * 3, y + 12);
  doc.setTextColor(194, 65, 12);
  doc.text(`Portador Recesivo: ${carrierCount}`, margin + 4 + colW * 3, y + 18);

  y += 30;

  // Ancestry Summary if available
  if (report.ancestry) {
    checkPageOverflow(36);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('1. ESTIMACIÓN DE ANCESTRALIDAD Y LINAJES', margin, y);
    y += 5;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    // Regions string
    const regionsStr = report.ancestry.regions
      .slice(0, 5)
      .map((r) => `${r.name}: ${r.percentage}%`)
      .join('  ·  ');
    doc.text(`Composición Continental: ${regionsStr}`, margin + 4, y + 6);

    // Lineages
    doc.text(
      `Linaje Materno (mtDNA): Haplogrupo ${report.ancestry.maternal.haplogroup} (${report.ancestry.maternal.subHaplogroup}) — ${report.ancestry.maternal.originLocation}`,
      margin + 4,
      y + 12
    );

    if (report.ancestry.paternal.isFemaleXX) {
      doc.text(`Linaje Paterno (Y-DNA): Cariotipo Femenino (XX) sin cromosoma Y directo.`, margin + 4, y + 18);
    } else {
      doc.text(
        `Linaje Paterno (Y-DNA): Haplogrupo ${report.ancestry.paternal.haplogroup} (${report.ancestry.paternal.subHaplogroup}) — ${report.ancestry.paternal.originLocation}`,
        margin + 4,
        y + 18
      );
    }

    y += 30;
  }

  // Categories to iterate through
  const categories: Array<{
    id: string;
    title: string;
    description: string;
  }> = [
    {
      id: 'health_vulnerability',
      title: '2. PREDISPOSICIONES Y VULNERABILIDADES DE SALUD',
      description: 'Condiciones complejas poligenéticas y factores de riesgo cardiometabólicos, oncológicos e inflamatorios.'
    },
    {
      id: 'hereditary_disease',
      title: '3. ENFERMEDADES MONOGÉNICAS Y ESTADO DE PORTADOR',
      description: 'Trastornos autosómicos recesivos de relevancia para planificación familiar y salud preventiva.'
    },
    {
      id: 'pharmacology',
      title: '4. FARMACOGENÓMICA Y METABOLISMO DE MEDICAMENTOS',
      description: 'Eficacia, dosificación recomendada y riesgo de toxicidad para fármacos según variantes en citocromos CYP.'
    },
    {
      id: 'wellness_nutrition',
      title: '5. BIENESTAR, NUTRICIÓN Y METABOLISMO',
      description: 'Metabolismo de macronutrientes, micronutrientes, ciclo circadiano y sensibilidad al ejercicio.'
    },
    {
      id: 'personal_traits',
      title: '6. RASGOS FENOTÍPICOS Y FÍSICOS',
      description: 'Pigmentación ocular, cutánea, tipo de fibra capilar y neuroquímica de rasgos comportamentales.'
    }
  ];

  for (const cat of categories) {
    const items = report.traitResults.filter((r) => r.trait.category === cat.id);
    if (items.length === 0) continue;

    checkPageOverflow(25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(cat.title, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(cat.description, margin, y);
    y += 6;

    // Render each trait in this category
    for (const item of items) {
      renderTraitItem(doc, item, margin, contentWidth, checkPageOverflow, (newY) => {
        y = newY;
      }, y);
    }

    y += 6;
  }

  // --- FINAL DISCLAIMER & SIGNATURE SECTION ---
  checkPageOverflow(30);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('AVISO LEGAL Y CLÍNICO IMPORTANTE', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  const disclaimerLines = doc.splitTextToSize(
    'Este informe está basado en datos genómicos directos al consumidor (DTC) y tiene fines estrictamente informativos y de divulgación. No constituye un diagnóstico médico clínico formal ni reemplaza el criterio de un facultativo o genetista cualificado. Cualquier decisión terapéutica o de dosificación debe ser validada mediante secuenciación de grado clínico y supervisada por su médico.',
    contentWidth - 8
  );
  doc.text(disclaimerLines, margin + 4, y + 10);

  // --- PAGE NUMBERING FOOTER ---
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    doc.text('Genomica Analysis Platform · Informe de uso personal y confidencial', margin, pageHeight - 8);
  }

  // Save / Download PDF
  const safeName = report.fileMetadata.fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Informe_Genomico_${safeName}.pdf`);
}

function renderTraitItem(
  doc: jsPDF,
  item: TraitAnalysisResult,
  margin: number,
  contentWidth: number,
  checkPageOverflow: (h: number) => void,
  setY: (y: number) => void,
  currentY: number
) {
  let y = currentY;

  // Approximate height needed
  const boxHeight = item.dosageRecommendation ? 32 : 28;
  checkPageOverflow(boxHeight + 4);

  // Status color badge
  let badgeBg = [241, 245, 249]; // gray
  let badgeText = [51, 65, 85];
  if (item.riskStatus === 'elevated' || (item.trait.type === 'carrier' && item.isVariantPresent)) {
    badgeBg = [254, 242, 242]; // red-50
    badgeText = [185, 28, 28]; // red-700
  } else if (item.riskStatus === 'moderate') {
    badgeBg = [254, 252, 232]; // yellow-50
    badgeText = [161, 98, 7]; // yellow-700
  } else if (item.riskStatus === 'protective' || (item.trait.type === 'carrier' && !item.isVariantPresent)) {
    badgeBg = [240, 253, 244]; // green-50
    badgeText = [21, 128, 61]; // green-700
  } else if (item.trait.type === 'pharmacology') {
    badgeBg = [250, 245, 255]; // purple-50
    badgeText = [126, 34, 206]; // purple-700
  }

  // Card outline
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'FD');

  // Title & Gene
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(item.trait.title, margin + 4, y + 5.5);

  // Status badge on the right
  const badgeWidth = doc.getTextWidth(item.statusLabel) + 6;
  doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
  doc.roundedRect(margin + contentWidth - badgeWidth - 4, y + 2, badgeWidth, 5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(badgeText[0], badgeText[1], badgeText[2]);
  doc.text(item.statusLabel, margin + contentWidth - badgeWidth - 1, y + 5.5);

  // Headline Summary / Mechanism
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  const summaryLines = doc.splitTextToSize(item.headlineSummary, contentWidth - 8);
  doc.text(summaryLines.slice(0, 2), margin + 4, y + 10.5);

  // Dosage Recommendation if present (Pharmacogenetics)
  let snpRowY = y + 16.5;
  if (item.dosageRecommendation) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text(`Ajuste Clínico: ${item.dosageRecommendation.slice(0, 110)}`, margin + 4, y + 15.5);
    snpRowY = y + 20.5;
  }

  // Evaluated SNPs inline list
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Marcadores:', margin + 4, snpRowY);

  doc.setFont('helvetica', 'normal');
  let snpOffset = margin + 20;
  const maxSnps = item.snpResults.slice(0, 3);
  for (const snp of maxSnps) {
    if (snp.foundInFile) {
      const snpStr = `${snp.rsid} (${snp.gene}): ${snp.userGenotype}`;
      doc.text(snpStr, snpOffset, snpRowY);
      snpOffset += doc.getTextWidth(snpStr) + 4;
    }
  }

  // Scientific Evidence & PubMed reference
  const firstSnp = item.trait.snps[0];
  if (firstSnp && firstSnp.pubMedIds && firstSnp.pubMedIds.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`PMID: ${firstSnp.pubMedIds.slice(0, 2).join(', ')}`, margin + contentWidth - 32, snpRowY);
  }

  y += boxHeight + 3;
  setY(y);
}
