import { TraitDefinition } from '../types/genetics';

export const PHARMACOLOGY_DATA: TraitDefinition[] = [
  {
    id: 'pharma_simvastatin',
    title: 'Simvastatina y Atorvastatina (Miopatía por Estatinas)',
    category: 'pharmacology',
    categoryLabel: 'Farmacología',
    description: 'Riesgo de miotoxicidad y dolor muscular inducido por estatinas dependiente del transportador hepático SLCO1B1.',
    biologicalMechanism: 'El polimorfismo 521T>C (Val174Ala) en el transportador de aniones orgánicos OATP1B1 (SLCO1B1) reduce la captación hepática de la estatina, aumentando su concentración sistémica en el músculo esquelético.',
    lifestyleInsights: [
      'En personas con alelo C (metabolizador intermedio o pobre), se recomienda considerar dosis reducidas o estatinas hidrofílicas como pravastatina o rosuvastatina.',
      'Monitorizar niveles de creatina quinasa (CK) en caso de mialgias o debilidad muscular.',
      'Evitar la combinación simultánea con inhibidores de CYP3A4 como zumo de pomelo o claritromicina.'
    ],
    baselineProbability: 15,
    minProbability: 2,
    maxProbability: 80,
    type: 'pharmacology',
    pharmacologicalGroup: 'Hipolipemiantes',
    drugName: 'Simvastatina, Atorvastatina, Lovastatina',
    metabolizerGene: 'SLCO1B1 (*5 521T>C)',
    clinicalRecommendation: 'Ajuste de dosis inicial o elección de estatina alternativa con menor dependencia de OATP1B1.',
    snps: [
      {
        rsid: 'rs4149056',
        gene: 'SLCO1B1 (*5)',
        chromosome: '12',
        name: 'SLCO1B1 521T>C (Val174Ala)',
        evidence: 'high',
        summary: 'Determinante farmacogenético mayor de miopatía por estatinas.',
        scientificContext: 'El alelo C reduce marcadamente la tasa de transporte hepático.',
        genotypes: {
          'CC': { genotype: 'CC', impact: 'elevated', scoreContribution: 0.9, label: 'Función del transportador muy reducida (CC)', description: 'Alto riesgo de miopatía con simvastatina a dosis estándar (>20mg/día).', effectMagnitude: '4.5x riesgo de miopatía' },
          'TC': { genotype: 'TC', impact: 'moderate', scoreContribution: 0.45, label: 'Función del transportador intermedia (TC)', description: 'Riesgo moderado; se sugiere monitorización de síntomas musculares.', effectMagnitude: '2.1x riesgo' },
          'TT': { genotype: 'TT', impact: 'protective', scoreContribution: -0.3, label: 'Función normal del transportador (TT)', description: 'Aclaramiento hepático óptimo de estatinas.', effectMagnitude: 'Riesgo basal habitual' }
        },
        pubMedIds: ['18650507', '22472917'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs4149056'
      }
    ]
  },
  {
    id: 'pharma_clopidogrel',
    title: 'Clopidogrel (Resistencia y Bioactivación Plaquetaria)',
    category: 'pharmacology',
    categoryLabel: 'Farmacología',
    description: 'Eficacia de la inhibición plaquetaria por clopidogrel dependiente del citocromo bioactivador CYP2C19.',
    biologicalMechanism: 'Clopidogrel es un profármaco que requiere dos pasos de oxidación hepática catalizados principalmente por CYP2C19 para convertirse en su metabolito tiol activo antiagregante.',
    lifestyleInsights: [
      'En metabolizadores lentos o intermedios de CYP2C19, clopidogrel presenta menor agregación plaquetaria protectora.',
      'Las guías CPIC recomiendan alternativas como prasugrel o ticagrelor en pacientes con síndrome coronario agudo y alelos de pérdida de función (*2, *3).'
    ],
    baselineProbability: 25,
    minProbability: 5,
    maxProbability: 90,
    type: 'pharmacology',
    pharmacologicalGroup: 'Antitrombóticos',
    drugName: 'Clopidogrel (Plavix)',
    metabolizerGene: 'CYP2C19 (*2, *3)',
    clinicalRecommendation: 'Considerar antiagregante alternativo (Prasugrel/Ticagrelor) si se portan alelos no funcionales.',
    snps: [
      {
        rsid: 'rs4244285',
        gene: 'CYP2C19 (*2)',
        chromosome: '10',
        name: 'CYP2C19*2 (681G>A)',
        evidence: 'high',
        summary: 'Alelo no funcional nulo más prevalente de CYP2C19.',
        scientificContext: 'Mutación en sitio de corte y empalme que causa proteína inactiva.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.9, label: 'Metabolizador Pobre (CYP2C19 *2/*2)', description: 'Producción deficiente de metabolito activo; alta tasa de eventos isquémicos residuales.', effectMagnitude: 'Resistencia farmacológica' },
          'GA': { genotype: 'GA', impact: 'moderate', scoreContribution: 0.45, label: 'Metabolizador Intermedio (*1/*2)', description: 'Activación subóptima de clopidogrel.', effectMagnitude: 'Eficacia reducida' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.3, label: 'Metabolizador Extensivo/Normal (*1/*1)', description: 'Bioactivación adecuada del profármaco.', effectMagnitude: 'Respuesta estándar esperada' }
        },
        pubMedIds: ['19106084', '22278112'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs4244285'
      },
      {
        rsid: 'rs4986893',
        gene: 'CYP2C19 (*3)',
        chromosome: '10',
        name: 'CYP2C19*3 (636G>A / W212X)',
        evidence: 'high',
        summary: 'Codón de parada prematuro que inactiva completamente la enzima.',
        scientificContext: 'El alelo A produce una enzima truncada sin actividad catalítica.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.95, label: 'Metabolizador Pobre (*3/*3)', description: 'Incapacidad total de bioactivar clopidogrel.', effectMagnitude: 'Resistencia severa' },
          'GA': { genotype: 'GA', impact: 'moderate', scoreContribution: 0.5, label: 'Metabolizador Intermedio (*1/*3)', description: 'Activación atenuada de clopidogrel.', effectMagnitude: 'Eficacia reducida' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.2, label: 'Alelo Normal (GG)', description: 'Actividad catalítica estándar.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['19106084', '22278112'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs4986893'
      }
    ]
  },
  {
    id: 'pharma_antidepressants_ssri',
    title: 'Citalopram, Escitalopram y Sertralina (Antidepresivos ISRS)',
    category: 'pharmacology',
    categoryLabel: 'Farmacología',
    description: 'Tasa de metabolismo y riesgo de toxicidad o ineficacia de antidepresivos inhibidores de la recaptación de serotonina.',
    biologicalMechanism: 'CYP2C19 y CYP2D6 metabolizan los ISRS. Los metabolizadores pobres acumulan fármaco (riesgo de prolongación QT o efectos serotoninérgicos) y los ultrarrápidos experimentan fracaso terapéutico.',
    lifestyleInsights: [
      'En metabolizadores ultrarrápidos, la dosis habitual puede ser insuficiente para alcanzar concentraciones terapéuticas.',
      'En metabolizadores pobres, comenzar con el 50% de la dosis habitual para evitar náuseas, ansiedad paradójica inicial o alteraciones del ritmo.'
    ],
    baselineProbability: 20,
    minProbability: 4,
    maxProbability: 85,
    type: 'pharmacology',
    pharmacologicalGroup: 'Antidepresivos',
    drugName: 'Escitalopram, Citalopram, Sertralina, Fluoxetina',
    metabolizerGene: 'CYP2C19 y CYP2D6',
    clinicalRecommendation: 'Ajuste de dosificación inicial según fenotipo metabolizador para maximizar respuesta y tolerabilidad.',
    snps: [
      {
        rsid: 'rs12248560',
        gene: 'CYP2C19 (*17)',
        chromosome: '10',
        name: 'CYP2C19*17 (-806C>T)',
        evidence: 'high',
        summary: 'Variante promotora de metabolización ultrarrápida.',
        scientificContext: 'Aumenta la tasa de transcripción de la enzima hepática.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.7, label: 'Metabolizador Ultrarrápido (*17/*17)', description: 'Aclaramiento acelerado del antidepresivo; posible falta de eficacia a dosis estándar.', effectMagnitude: 'Metabolismo ultrarrápido' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.3, label: 'Metabolizador Rápido (*1/*17)', description: 'Aclaramiento ligeramente elevado.', effectMagnitude: 'Metabolismo rápido' },
          'CC': { genotype: 'CC', impact: 'average', scoreContribution: 0.0, label: 'Metabolizador Normal (*1/*1)', description: 'Cinética de eliminación convencional.', effectMagnitude: 'Estándar' }
        },
        pubMedIds: ['16491079', '23486447'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs12248560'
      }
    ]
  },
  {
    id: 'pharma_antipsychotics',
    title: 'Risperidona, Aripiprazol y Haloperidol (Antipsicóticos)',
    category: 'pharmacology',
    categoryLabel: 'Farmacología',
    description: 'Metabolismo hepático y riesgo de efectos extrapiramidales o sedación excesiva mediados por CYP2D6.',
    biologicalMechanism: 'CYP2D6 es la vía principal de hidroxilación e inactivación de la mayoría de antipsicóticos atípicos y típicos.',
    lifestyleInsights: [
      'Los metabolizadores lentos de CYP2D6 tienen concentraciones plasmáticas hasta 4 veces superiores de risperidona y aripiprazol.',
      'Se aconseja titular la dosis con incrementos lentos en presencia de variantes lentas.'
    ],
    baselineProbability: 18,
    minProbability: 3,
    maxProbability: 80,
    type: 'pharmacology',
    pharmacologicalGroup: 'Antipsicóticos',
    drugName: 'Risperidona, Aripiprazol, Haloperidol, Olanzapina',
    metabolizerGene: 'CYP2D6 (*4 rs3892097)',
    clinicalRecommendation: 'Reducir dosis inicial un 50% en metabolizadores pobres de CYP2D6.',
    snps: [
      {
        rsid: 'rs3892097',
        gene: 'CYP2D6 (*4)',
        chromosome: '22',
        name: 'CYP2D6*4 (1846G>A)',
        evidence: 'high',
        summary: 'El alelo de pérdida total de función más frecuente en poblaciones europeas (~20%).',
        scientificContext: 'Provoca empalme anómalo del ARN mensajero y ausencia de enzima funcional.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.9, label: 'Metabolizador Pobre CYP2D6 (*4/*4)', description: 'Incapacidad de metabolizar sustratos de CYP2D6; acumulación del fármaco y riesgo aumentado de efectos adversos.', effectMagnitude: 'Actividad nula de CYP2D6' },
          'GA': { genotype: 'GA', impact: 'moderate', scoreContribution: 0.4, label: 'Metabolizador Intermedio (*1/*4)', description: 'Capacidad metabólica reducida al 50%.', effectMagnitude: 'Actividad intermedia' },
          'GG': { genotype: 'GG', impact: 'average', scoreContribution: 0.0, label: 'Metabolizador Normal (*1/*1)', description: 'Función enzimática de referencia.', effectMagnitude: 'Normal' }
        },
        pubMedIds: ['23486447', '21946979'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs3892097'
      }
    ]
  },
  {
    id: 'pharma_fluorouracil',
    title: 'Fluorouracilo y Capecitabina (Toxicidad Oncológica DPYD)',
    category: 'pharmacology',
    categoryLabel: 'Farmacología',
    description: 'Riesgo de toxicidad severa o potencialmente mortal (mielosupresión, mucositis severa) por fluoropirimidinas.',
    biologicalMechanism: 'La enzima dihidropirimidina deshidrogenasa (DPD, gen DPYD) cataboliza más del 80% del 5-FU. Las variantes inactivantes provocan acumulación tóxica.',
    lifestyleInsights: [
      'Las agencias regulatorias (EMA/AEMPS/FDA) recomiendan el cribado genético obligatorio de DPYD antes de iniciar quimioterapia con 5-FU o capecitabina.',
      'En portadores de alelos nulos, se requiere una reducción del 50% o la suspensión del fármaco.'
    ],
    baselineProbability: 5,
    minProbability: 0,
    maxProbability: 95,
    type: 'pharmacology',
    pharmacologicalGroup: 'Antineoplásicos',
    drugName: '5-Fluorouracilo (5-FU), Capecitabina, Tegafur',
    metabolizerGene: 'DPYD (*2A rs3918290, *13, c.2846A>T)',
    clinicalRecommendation: 'Ajuste obligatorio de dosis antes de iniciar tratamiento para evitar neutropenia febril grave.',
    snps: [
      {
        rsid: 'rs3918290',
        gene: 'DPYD (*2A)',
        chromosome: '1',
        name: 'DPYD*2A (c.1905+1G>A)',
        evidence: 'high',
        summary: 'Mutación en sitio de empalme con pérdida completa de actividad de la enzima DPD.',
        scientificContext: 'El alelo A causa deficiencia grave del catabolismo de fluoropirimidinas.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 1.0, label: 'Déficit Completo DPD (Contraindicación Absoluta)', description: 'Toxicidad letal con dosis convencionales; uso de 5-FU formalmente contraindicado.', effectMagnitude: 'Toxicidad crítica' },
          'GA': { genotype: 'GA', impact: 'elevated', scoreContribution: 0.8, label: 'Déficit Parcial DPD (Portador Heterocigoto)', description: 'Reducción de dosis de 5-FU obligatoria del 50% con monitorización terapéutica estricta.', effectMagnitude: 'Alto riesgo tóxico' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.2, label: 'Actividad DPD Normal (Sin mutación *2A)', description: 'Capacidad adecuada de inactivación del fármaco.', effectMagnitude: 'Tolerancia estándar' }
        },
        pubMedIds: ['24584284', '29152729'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs3918290'
      }
    ]
  },
  {
    id: 'pharma_warfarin_acenocoumarol',
    title: 'Sintrom (Acenocumarol) y Warfarina (Anticoagulantes)',
    category: 'pharmacology',
    categoryLabel: 'Farmacología',
    description: 'Sensibilidad a la dosis requerida de anticoagulantes antivitamina K y riesgo de hemorragia.',
    biologicalMechanism: 'Variantes en la diana enzimática VKORC1 (sensibilidad a la inhibición) y en CYP2C9 (aclaramiento metabólico) determinan el 50% de la variabilidad de dosis necesaria.',
    lifestyleInsights: [
      'Los portadores del alelo VKORC1 -1639A requieren dosis de mantenimiento significativamente menores.',
      'Control estrecho del INR durante la inducción del tratamiento anticoagulante.'
    ],
    baselineProbability: 35,
    minProbability: 10,
    maxProbability: 95,
    type: 'pharmacology',
    pharmacologicalGroup: 'Antitrombóticos',
    drugName: 'Acenocumarol (Sintrom), Warfarina',
    metabolizerGene: 'VKORC1 (-1639G>A) y CYP2C9 (*2, *3)',
    clinicalRecommendation: 'Calcular dosis inicial mediante algoritmos farmacogenéticos para evitar sobreanticoagulación.',
    snps: [
      {
        rsid: 'rs9923231',
        gene: 'VKORC1 (-1639G>A)',
        chromosome: '16',
        name: 'VKORC1 Promotor -1639G>A',
        evidence: 'high',
        summary: 'Determinante fundamental del requerimiento de dosis de antivitamina K.',
        scientificContext: 'El alelo A reduce los niveles basales de la enzima diana del anticoagulante.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.85, label: 'Alta Sensibilidad a Sintrom (Dosis Bajas Requeridas)', description: 'Requiere dosis de mantenimiento muy reducidas; alto riesgo de sangrado si se usa dosis estándar.', effectMagnitude: 'Requerimiento de dosis baja (-50%)' },
          'GA': { genotype: 'GA', impact: 'moderate', scoreContribution: 0.4, label: 'Sensibilidad Intermedia (Dosis Moderada)', description: 'Requerimiento de dosis moderadamente reducido.', effectMagnitude: 'Requerimiento de dosis intermedia' },
          'GG': { genotype: 'GG', impact: 'average', scoreContribution: 0.0, label: 'Sensibilidad Estándar (Dosis Convencional)', description: 'Requerimiento de dosis estándar habitual.', effectMagnitude: 'Dosis estándar' }
        },
        pubMedIds: ['15930419', '19228618'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs9923231'
      },
      {
        rsid: 'rs1799853',
        gene: 'CYP2C9 (*2 / Arg144Cys)',
        chromosome: '10',
        name: 'CYP2C9*2 430C>T',
        evidence: 'high',
        summary: 'Reduce el aclaramiento metabólico de warfarina y acenocumarol en un 30-40%.',
        scientificContext: 'El alelo T (Cys144) reduce la interacción del citocromo con la reductasa.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.8, label: 'Metabolizador Lento CYP2C9*2 (TT)', description: 'Eliminación lenta del anticoagulante; requiere reducción de dosis para evitar sobreanticoagulación.', effectMagnitude: 'Aclaramiento muy reducido' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.4, label: 'Metabolizador Intermedio (*1/*2)', description: 'Aclaramiento moderadamente reducido.', effectMagnitude: 'Aclaramiento reducido' },
          'CC': { genotype: 'CC', impact: 'protective', scoreContribution: -0.2, label: 'Metabolizador Normal (*1/*1)', description: 'Aclaramiento estándar de antivitamina K.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['15930419', '19228618'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1799853'
      }
    ]
  },
  {
    id: 'pharma_codeine_tramadol_cyp2d6',
    title: 'Codeína y Tramadol (Bioactivación Analgésica por CYP2D6)',
    category: 'pharmacology',
    categoryLabel: 'Farmacología',
    description: 'Eficacia analgésica y seguridad de profármacos opioides (codeína, tramadol) que requieren activación a morfina / O-desmetiltramadol por CYP2D6.',
    biologicalMechanism: 'La enzima CYP2D6 convierte la codeína en morfina activa (afinidad 200 veces superior por receptores mu). Polimorfismos de pérdida de función generan falta de analgesia, mientras que duplicaciones génicas causan toxicidad y depresión respiratoria.',
    lifestyleInsights: [
      'En metabolizadores pobres (PM), la codeína y tramadol no alivian el dolor; se recomiendan analgésicos no dependientes de CYP2D6 (morfina directa, oxicodona o AINEs).',
      'En metabolizadores ultrarrápidos (UM), evitar codeína por riesgo de sobredosis opioide incluso a dosis bajas.'
    ],
    baselineProbability: 20,
    minProbability: 2,
    maxProbability: 90,
    type: 'pharmacology',
    pharmacologicalGroup: 'Analgésicos opioides',
    drugName: 'Codeína, Tramadol, Hidrocodona',
    metabolizerGene: 'CYP2D6 (*4, *10, duplicaciones)',
    clinicalRecommendation: 'Evitar codeína y tramadol en metabolizadores lentos (ineficacia) o ultrarrápidos (toxicidad).',
    snps: [
      {
        rsid: 'rs1065852',
        gene: 'CYP2D6 (*10 / 100C>T)',
        chromosome: '22',
        name: 'CYP2D6*10 (p.Pro34Ser)',
        evidence: 'high',
        summary: 'Alelo con actividad enzimática disminuida que reduce la activación de profármacos analgésicos.',
        scientificContext: 'La sustitución C>T altera la estabilidad del citocromo CYP2D6.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.85, label: 'Metabolizador Pobre / Ineficacia Analgésica (TT)', description: 'Conversión mínima de codeína a morfina; alivio del dolor escaso o nulo con dosis estándar.', effectMagnitude: 'Falta de analgesia' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.4, label: 'Metabolizador Intermedio (CT)', description: 'Capacidad reducida de bioactivación analgésica.', effectMagnitude: 'Respuesta intermedia' },
          'TC': { genotype: 'TC', impact: 'moderate', scoreContribution: 0.4, label: 'Metabolizador Intermedio (TC)', description: 'Capacidad reducida de bioactivación.', effectMagnitude: 'Respuesta intermedia' },
          'CC': { genotype: 'CC', impact: 'protective', scoreContribution: -0.3, label: 'Metabolizador Extensivo / Normal (CC)', description: 'Conversión metabólica esperada y respuesta analgésica adecuada.', effectMagnitude: 'Eficacia estándar' }
        },
        pubMedIds: ['22378112', '24525546'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1065852'
      }
    ]
  },
  {
    id: 'pharma_abacavir_hla_b5701',
    title: 'Abacavir y Reacción de Hipersensibilidad Severa (HLA-B*57:01)',
    category: 'pharmacology',
    categoryLabel: 'Farmacología',
    description: 'Riesgo de síndrome de hipersensibilidad inmunológica multisistémica grave potencialmente mortal inducido por abacavir.',
    biologicalMechanism: 'La molécula de abacavir se une de forma específica en la hendidura de presentación antigénica del alelo HLA-B*57:01 (marcador rs2395029 en HCP5), induciendo una activación masiva de linfocitos T CD8+ citotóxicos.',
    lifestyleInsights: [
      'Guía clínica de nivel 1A (CPIC / FDA / EMA): La presencia del alelo contraindica formalmente el uso de abacavir en cualquier régimen antirretroviral.',
      'En individuos no portadores, el fármaco presenta un perfil de seguridad excelente.'
    ],
    baselineProbability: 6,
    minProbability: 0,
    maxProbability: 100,
    type: 'pharmacology',
    pharmacologicalGroup: 'Antirretrovirales',
    drugName: 'Abacavir (Ziagen, Kivexa, Triumeq)',
    metabolizerGene: 'HLA-B*57:01 (rs2395029 en HCP5)',
    clinicalRecommendation: 'Contraindicación absoluta de abacavir si la variante HLA-B*57:01 está presente.',
    snps: [
      {
        rsid: 'rs2395029',
        gene: 'HCP5 / HLA-B*57:01',
        chromosome: '6',
        name: 'Marcador HLA-B*57:01 (rs2395029)',
        evidence: 'high',
        summary: 'Marcador genético en desequilibrio de ligamiento perfecto con el alelo HLA-B*57:01.',
        scientificContext: 'El alelo G predice una reactividad de hipersensibilidad inmune mediada por HLA.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 1.0, label: 'Portador HLA-B*57:01 (Contraindicación Absoluta)', description: 'Riesgo inminente de reacción de hipersensibilidad grave con fiebre, exantema y fallo respiratorio/gastrointestinal.', effectMagnitude: 'Toxicidad inmunomediada severa' },
          'TG': { genotype: 'TG', impact: 'elevated', scoreContribution: 1.0, label: 'Portador HLA-B*57:01 (Contraindicación Absoluta)', description: 'Portador de una copia; el abacavir está estrictamente contraindicado.', effectMagnitude: 'Alto riesgo de hipersensibilidad' },
          'GT': { genotype: 'GT', impact: 'elevated', scoreContribution: 1.0, label: 'Portador HLA-B*57:01 (Contraindicación Absoluta)', description: 'Portador de una copia; contraindicación formal.', effectMagnitude: 'Alto riesgo de hipersensibilidad' },
          'TT': { genotype: 'TT', impact: 'protective', scoreContribution: -0.4, label: 'Variante Ausente (Negativo para HLA-B*57:01)', description: 'Bajo riesgo de hipersensibilidad al abacavir.', effectMagnitude: 'Tolerancia esperada' }
        },
        pubMedIds: ['17660819', '18256392'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2395029'
      }
    ]
  },
  {
    id: 'pharma_azathioprine_tpmt',
    title: 'Azatioprina y 6-Mercaptopurina (Mielotoxicidad por TPMT)',
    category: 'pharmacology',
    categoryLabel: 'Farmacología',
    description: 'Riesgo de pancitopenia y aplasia medular grave por acumulación de metabolitos tiopurínicos tóxicos.',
    biologicalMechanism: 'La tiopurina S-metiltransferasa (TPMT) inactiva los fármacos tiopurínicos. Polimorfismos como *3C (rs1142345) anulan la actividad enzimática, desviando el metabolismo hacia nucleótidos de 6-tioguanina citotóxicos.',
    lifestyleInsights: [
      'En portadores de deficiencia intermedia o completa de TPMT, la dosis estándar de azatioprina puede provocar leucopenia potencialmente mortal.',
      'Las guías CPIC recomiendan reducir la dosis un 50-80% en portadores heterocigotos o buscar terapias inmunosupresoras alternativas en homocigotos mutados.'
    ],
    baselineProbability: 10,
    minProbability: 1,
    maxProbability: 95,
    type: 'pharmacology',
    pharmacologicalGroup: 'Inmunosupresores y antineoplásicos',
    drugName: 'Azatioprina (Imurel), 6-Mercaptopurina (Purinethol)',
    metabolizerGene: 'TPMT (*3C, *2, *3A)',
    clinicalRecommendation: 'Ajuste sustancial de dosis de tiopurinas según fenotipo de TPMT para prevenir mielosupresión.',
    snps: [
      {
        rsid: 'rs1142345',
        gene: 'TPMT (*3C / c.719A>G)',
        chromosome: '6',
        name: 'TPMT*3C (p.Tyr240Cys)',
        evidence: 'high',
        summary: 'Variante patogénica común de pérdida de función en tiopurina S-metiltransferasa.',
        scientificContext: 'La mutación Tyr240Cys acelera la degradación proteosomal de la enzima TPMT.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 1.0, label: 'Déficit Completo de TPMT (Mielotoxicidad Severa)', description: 'Incapacidad de catabolizar tiopurinas; riesgo crítico de aplasia de médula ósea.', effectMagnitude: 'Toxicidad hematológica muy alta' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.6, label: 'Actividad Intermedia de TPMT (Heterocigoto)', description: 'Requiere reducción del 30-50% en la dosis inicial y monitorización de hemograma.', effectMagnitude: 'Toxicidad hematológica moderada' },
          'GA': { genotype: 'GA', impact: 'moderate', scoreContribution: 0.6, label: 'Actividad Intermedia de TPMT (Heterocigoto)', description: 'Requiere ajuste de dosis preventivo.', effectMagnitude: 'Toxicidad hematológica moderada' },
          'AA': { genotype: 'AA', impact: 'protective', scoreContribution: -0.3, label: 'Actividad Normal de TPMT (*1/*1)', description: 'Metabolismo estándar de tiopurinas a dosis terapéuticas convencionales.', effectMagnitude: 'Tolerancia basal habitual' }
        },
        pubMedIds: ['10696347', '23422873'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1142345'
      }
    ]
  }
];
