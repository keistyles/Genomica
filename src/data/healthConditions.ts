import { TraitDefinition } from '../types/genetics';

export const HEALTH_CONDITIONS_DATA: TraitDefinition[] = [
  {
    id: 'ischemic_stroke',
    title: 'Accidente cerebrovascular isquémico',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Predisposición poligénica a la oclusión arterial cerebral y formación de trombos en vasos intracraneales.',
    biologicalMechanism: 'Variantes en PITX2 y NINJ2 modulan la adhesión celular endotelial, la excitotoxicidad vascular y la susceptibilidad a arritmias cardioembólicas.',
    lifestyleInsights: [
      'Mantener niveles de presión arterial por debajo de 120/80 mmHg.',
      'Control periódico del perfil lipídico y niveles de homocisteína sérica.',
      'Dieta rica en antioxidantes y ácidos grasos poliinsaturados Omega-3.',
      'Evitar el sedentarismo y el tabaquismo activo o pasivo.'
    ],
    baselineProbability: 14,
    minProbability: 4,
    maxProbability: 48,
    type: 'risk',
    snps: [
      {
        rsid: 'rs12425791',
        gene: 'NINJ2',
        chromosome: '12',
        name: 'Variante Intracraneal NINJ2',
        evidence: 'high',
        summary: 'Regula la respuesta de adhesión y regeneración de neuronas y células gliales vasculares.',
        scientificContext: 'El alelo de riesgo A se asocia a un incremento significativo del riesgo de ictus isquémico aterotrombótico.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.8, label: 'Riesgo Elevado (Homocigoto A)', description: 'Mayor susceptibilidad a daño endotelial cerebrovascular.', effectMagnitude: '1.6x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.4, label: 'Riesgo Moderado (Heterocigoto)', description: 'Predisposición intermedia.', effectMagnitude: '1.25x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.4, label: 'Alelo Estándar / Favorable', description: 'Función endotelial basal adecuada.', effectMagnitude: 'Riesgo poblacional base' }
        }
      },
      {
        rsid: 'rs2200733',
        gene: 'PITX2',
        chromosome: '4',
        name: 'Variante 4q25 Cardioembólica',
        evidence: 'high',
        summary: 'Marcador principal de susceptibilidad cardioembólica y fibrilación auricular.',
        scientificContext: 'Regula el desarrollo del tejido miocárdico en las venas pulmonares.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.85, label: 'Riesgo Elevado Cardioembólico', description: 'Incremento en el riesgo de fibrilación e ictus embólico.', effectMagnitude: '1.7x riesgo' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.4, label: 'Riesgo Moderado', description: 'Vulnerabilidad moderada.', effectMagnitude: '1.3x riesgo' },
          'CC': { genotype: 'CC', impact: 'average', scoreContribution: 0.0, label: 'Genotipo Basal', description: 'Línea de base poblacional.', effectMagnitude: '1.0x basal' }
        },
        pubMedIds: ['19377474', '20418487'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2200733'
      },
      {
        rsid: 'rs2107595',
        gene: 'HDAC9',
        chromosome: '7',
        name: 'Histona Desacetilasa 9 (Ictus Aterotrombótico)',
        evidence: 'high',
        summary: 'Regula la inflamación macrofágica y la estabilidad de la placa de ateroma carotídea.',
        scientificContext: 'El alelo A está fuertemente asociado con ictus isquémico de grandes vasos en estudios de consorcios internacionales (METASTROKE).',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.75, label: 'Riesgo Elevado de Aterotrombosis (AA)', description: 'Mayor inestabilidad de placa en arterias cerebrales y bifurcación carotídea.', effectMagnitude: '1.45x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.35, label: 'Riesgo Moderado (AG)', description: 'Susceptibilidad intermedia a aterosclerosis vascular.', effectMagnitude: '1.2x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.3, label: 'Genotipo Favorable (GG)', description: 'Menor inflamación de pared arterial cerebral.', effectMagnitude: 'Riesgo basal' }
        },
        pubMedIds: ['22446961'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2107595'
      }
    ]
  },
  {
    id: 'abdominal_aortic_aneurysm',
    title: 'Aneurisma de aorta abdominal',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Vulnerabilidad a la dilatación progresiva y debilitamiento de la pared elástica de la aorta abdominal.',
    biologicalMechanism: 'Polimorfismos en CDKN2B-AS1 y DAB2IP alteran la proliferación de células del músculo liso vascular y la remodelación de la matriz extracelular.',
    lifestyleInsights: [
      'Control estricto de la presión arterial y revisión ecográfica a partir de los 50-60 años.',
      'Abstención absoluta del consumo de tabaco.',
      'Mantener niveles óptimos de vitamina C y colágeno biodisponible.'
    ],
    baselineProbability: 6,
    minProbability: 2,
    maxProbability: 28,
    type: 'risk',
    snps: [
      {
        rsid: 'rs10757278',
        gene: 'CDKN2B-AS1',
        chromosome: '9',
        name: 'Locus Vascular 9p21.3',
        evidence: 'high',
        summary: 'Locus central de senescencia celular y fragilidad vascular.',
        scientificContext: 'Asociado con dilatación aneurismática de grandes arterias elásticas.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 0.75, label: 'Mayor fragilidad de la túnica media', description: 'Predisposición a remodelado anómalo de la pared aórtica.', effectMagnitude: '1.65x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.35, label: 'Sensibilidad intermedia', description: 'Riesgo ligeramente aumentado.', effectMagnitude: '1.3x riesgo' },
          'AA': { genotype: 'AA', impact: 'protective', scoreContribution: -0.3, label: 'Pared vascular resiliente', description: 'Integridad basal preservada.', effectMagnitude: 'Riesgo base' }
        },
        pubMedIds: ['18372903'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs10757278'
      },
      {
        rsid: 'rs7025486',
        gene: 'DAB2IP',
        chromosome: '9',
        name: 'Proteína Interactora DAB2IP (Aneurisma Aórtico)',
        evidence: 'high',
        summary: 'Regula la apoptosis de células del músculo liso vascular e integridad del tejido conjuntivo aórtico.',
        scientificContext: 'El alelo A está asociado a dilatación de la aorta abdominal y torácica.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.7, label: 'Mayor Riesgo de Dilatación Aórtica (AA)', description: 'Menor soporte contráctil de la túnica media aórtica.', effectMagnitude: '1.4x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.3, label: 'Susceptibilidad Moderada (AG)', description: 'Riesgo intermedio.', effectMagnitude: '1.2x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.2, label: 'Genotipo Normal (GG)', description: 'Integridad estructural aórtica basal.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['18372903', '21199918'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs7025486'
      }
    ]
  },
  {
    id: 'alzheimers_disease',
    title: 'Enfermedad de Alzheimer (Tardía)',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Predisposición genética al aclaramiento deficiente del péptido beta-amiloide y fosforilación de proteína tau en el tejido cerebral.',
    biologicalMechanism: 'Las isoformas de APOE (determinadas por los alelos rs429358 y rs7412) influyen en el transporte de lípidos cerebrales y eliminación de placas seniles.',
    lifestyleInsights: [
      'Mantener estimulación cognitiva activa (reserva cognitiva).',
      'Ejercicio aeróbico regular para estimular el factor neurotrófico BDNF.',
      'Control estricto de glucosa e insulina (prevención de diabetes tipo 3 cerebral).',
      'Dieta rica en polifenoles, cúrcuma y ácidos grasos DHA.'
    ],
    baselineProbability: 10,
    minProbability: 3,
    maxProbability: 62,
    type: 'risk',
    snps: [
      {
        rsid: 'rs429358',
        gene: 'APOE (Cys112Arg)',
        chromosome: '19',
        name: 'Alelo APOE-ε4',
        evidence: 'high',
        summary: 'Determinante principal de la isoforma ApoE4 pro-amiloidogénica.',
        scientificContext: 'La presencia del alelo C (Arg112) conforma la variante ApoE4.',
        genotypes: {
          'CC': { genotype: 'CC', impact: 'elevated', scoreContribution: 0.95, label: 'APOE-ε4/ε4 Homocigoto', description: 'Incremento pronunciado en la acumulación de beta-amiloide.', effectMagnitude: '8-12x riesgo' },
          'CT': { genotype: 'CT', impact: 'elevated', scoreContribution: 0.65, label: 'APOE-ε4 Heterocigoto', description: 'Presencia de una copia de alelo de riesgo ε4.', effectMagnitude: '3.2x riesgo' },
          'TT': { genotype: 'TT', impact: 'average', scoreContribution: 0.0, label: 'APOE-ε3 / ε2', description: 'Ausencia del alelo ε4.', effectMagnitude: 'Riesgo estándar poblacional' }
        },
        pubMedIds: ['8346482', '20194488'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs429358'
      },
      {
        rsid: 'rs7412',
        gene: 'APOE (Arg158Cys)',
        chromosome: '19',
        name: 'Alelo APOE-ε2 Protector',
        evidence: 'high',
        summary: 'Modula la afinidad a receptores LDL y protección neuronal.',
        scientificContext: 'El alelo T confiere la variante ε2, considerada neuroprotectora.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'protective', scoreContribution: -0.6, label: 'APOE-ε2/ε2 Protector', description: 'Menor afinidad de agregación amiloide.', effectMagnitude: '0.6x riesgo' },
          'CT': { genotype: 'CT', impact: 'protective', scoreContribution: -0.3, label: 'APOE-ε2 Portador', description: 'Efecto parcialmente protector.', effectMagnitude: '0.8x riesgo' },
          'CC': { genotype: 'CC', impact: 'average', scoreContribution: 0.0, label: 'Basal ε3/ε4', description: 'Isoforma estándar.', effectMagnitude: '1.0x basal' }
        },
        pubMedIds: ['8346482', '9888874'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs7412'
      },
      {
        rsid: 'rs3851179',
        gene: 'PICALM',
        chromosome: '11',
        name: 'PICALM (Endocitosis de Clatrina Amiloide)',
        evidence: 'high',
        summary: 'Regula el tráfico endocítico de la proteína precursora de amiloide y autofagia en sinapsis.',
        scientificContext: 'El alelo protector A favorece el aclaramiento vesicular de oligómeros beta-amiloides.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 0.4, label: 'Alelo de Riesgo PICALM (GG)', description: 'Menor tasa de endocitosis y aclaramiento sináptico de péptidos tóxicos.', effectMagnitude: '1.2x riesgo' },
          'AG': { genotype: 'AG', impact: 'average', scoreContribution: 0.1, label: 'Respuesta Intermedia (AG)', description: 'Aclaramiento estándar.', effectMagnitude: '1.0x' },
          'AA': { genotype: 'AA', impact: 'protective', scoreContribution: -0.4, label: 'Protección Favorable (AA)', description: 'Endocitosis eficiente y neuroprotección amiloide.', effectMagnitude: '0.85x riesgo' }
        },
        pubMedIds: ['19734902', '21460841'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs3851179'
      },
      {
        rsid: 'rs6656401',
        gene: 'CR1',
        chromosome: '1',
        name: 'Receptor de Complemento 1 (CR1)',
        evidence: 'high',
        summary: 'Participa en la opsonización y fagocitosis de placas de beta-amiloide por la microglía.',
        scientificContext: 'Variante ampliamente confirmada en grandes metaanálisis de GWAS del consorcio IGAP.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.5, label: 'Riesgo Microglial (AA)', description: 'Menor capacidad fagocítica de agregados seniles por células inmunes cerebrales.', effectMagnitude: '1.25x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.25, label: 'Heterocigoto (AG)', description: 'Función microglial intermedia.', effectMagnitude: '1.12x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.2, label: 'Aclaramiento Eficaz (GG)', description: 'Fagocitosis fisiológica normal.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['19734903', '24162737'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs6656401'
      }
    ]
  },
  {
    id: 'coronary_heart_disease',
    title: 'Cardiopatía coronaria e Infarto de miocardio',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Susceptibilidad a la aterosclerosis de arterias coronarias y trombosis oclusiva vascular.',
    biologicalMechanism: 'Variantes en el locus 9p21 y el gen LPA modulan la aterogénesis, la calcificación vascular y los niveles de lipoproteína(a).',
    lifestyleInsights: [
      'Monitorización de Lp(a), ApoB y colesterol LDL denso.',
      'Control de marcadores inflamatorios vasculares (Proteína C Reactiva ultrasensible).',
      'Ejercicio de resistencia cardiovascular constante.'
    ],
    baselineProbability: 18,
    minProbability: 6,
    maxProbability: 56,
    type: 'risk',
    snps: [
      {
        rsid: 'rs1333049',
        gene: 'CDKN2A/B (9p21.3)',
        chromosome: '9',
        name: 'Variante Coronaria Mayor 9p21',
        evidence: 'high',
        summary: 'Marcador genético más reproducible en enfermedad coronaria.',
        scientificContext: 'Afecta a la proliferación de células del músculo liso y respuesta inflamatoria vascular.',
        genotypes: {
          'CC': { genotype: 'CC', impact: 'elevated', scoreContribution: 0.8, label: 'Alto riesgo aterosclerótico (CC)', description: 'Mayor susceptibilidad a calcificación coronaria prematura.', effectMagnitude: '1.6x riesgo' },
          'CG': { genotype: 'CG', impact: 'moderate', scoreContribution: 0.4, label: 'Riesgo moderado (CG)', description: 'Susceptibilidad intermedia.', effectMagnitude: '1.3x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.4, label: 'Variante Favorable (GG)', description: 'Menor reactividad inflamatoria vascular.', effectMagnitude: '0.8x riesgo' }
        },
        pubMedIds: ['17478679', '17478681'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1333049'
      },
      {
        rsid: 'rs10455872',
        gene: 'LPA',
        chromosome: '6',
        name: 'Niveles de Lipoproteína(a)',
        evidence: 'high',
        summary: 'Regula concentraciones elevadas de la partícula aterotrombótica Lp(a).',
        scientificContext: 'El alelo G se correlaciona fuertemente con niveles séricos muy altos de Lp(a).',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 0.85, label: 'Lp(a) muy elevada', description: 'Aumento significativo de riesgo aterogénico.', effectMagnitude: '2.0x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.45, label: 'Lp(a) moderadamente elevada', description: 'Concentraciones intermedias.', effectMagnitude: '1.4x riesgo' },
          'AA': { genotype: 'AA', impact: 'average', scoreContribution: 0.0, label: 'Lp(a) en rango basal', description: 'Concentraciones poblacionales estándar.', effectMagnitude: '1.0x' }
        },
        pubMedIds: ['19933446', '20855804'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs10455872'
      },
      {
        rsid: 'rs6922269',
        gene: 'MTHFD1L',
        chromosome: '6',
        name: 'MTHFD1L (Infarto de Miocardio)',
        evidence: 'high',
        summary: 'Regula el metabolismo mitocondrial del folato y la integridad vascular cardíaca.',
        scientificContext: 'Variante de riesgo cardiovascular identificada en múltiples estudios GWAS multicéntricos.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.65, label: 'Riesgo Coronario Aumentado (AA)', description: 'Mayor vulnerabilidad a eventos coronarios agudos.', effectMagnitude: '1.35x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.3, label: 'Riesgo Intermedio (AG)', description: 'Susceptibilidad moderada.', effectMagnitude: '1.18x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.3, label: 'Genotipo Protector (GG)', description: 'Metabolismo vascular estándar.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['17634449', '19262577'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs6922269'
      }
    ]
  },
  {
    id: 'type_2_diabetes',
    title: 'Diabetes mellitus tipo 2',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Vulnerabilidad a la disfunción secretora de células beta pancreáticas y resistencia a la insulina periférica.',
    biologicalMechanism: 'Variantes en el factor de transcripción TCF7L2, PPARG y SLC30A8 modulan la síntesis de incretinas, el transporte de zinc y la adipogénesis.',
    lifestyleInsights: [
      'Dieta de bajo índice glucémico y alto contenido de fibra soluble.',
      'Entrenamiento de fuerza muscular para optimizar transportadores GLUT4.',
      'Control de glucemia basal y niveles de hemoglobina glicosilada (HbA1c).'
    ],
    baselineProbability: 22,
    minProbability: 8,
    maxProbability: 64,
    type: 'risk',
    snps: [
      {
        rsid: 'rs7903146',
        gene: 'TCF7L2',
        chromosome: '10',
        name: 'Polimorfismo TCF7L2 C>T',
        evidence: 'high',
        summary: 'El predictor genético más potente de disfunción de células beta.',
        scientificContext: 'El alelo T altera la señalización Wnt y disminuye la secreción de insulina estimulada por GLP-1.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.85, label: 'Riesgo Elevado (Homocigoto TT)', description: 'Secreción pancreática de insulina comprometida.', effectMagnitude: '1.9x riesgo' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.45, label: 'Riesgo Moderado (Heterocigoto CT)', description: 'Respuesta secretora intermedia.', effectMagnitude: '1.4x riesgo' },
          'CC': { genotype: 'CC', impact: 'protective', scoreContribution: -0.3, label: 'Genotipo Protector (CC)', description: 'Eficiencia secretora de células beta óptima.', effectMagnitude: '0.8x riesgo' }
        },
        pubMedIds: ['16415884', '17463246'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs7903146'
      },
      {
        rsid: 'rs1801282',
        gene: 'PPARG (Pro12Ala)',
        chromosome: '3',
        name: 'PPARG Pro12Ala',
        evidence: 'high',
        summary: 'Modula la sensibilidad celular a la insulina y metabolismo adipocitario.',
        scientificContext: 'El alelo Ala (G) se asocia con mayor sensibilidad insulínica.',
        genotypes: {
          'CC': { genotype: 'CC', impact: 'average', scoreContribution: 0.1, label: 'Genotipo Pro/Pro Común', description: 'Sensibilidad estándar a la insulina.', effectMagnitude: '1.0x basal' },
          'CG': { genotype: 'CG', impact: 'protective', scoreContribution: -0.3, label: 'Portador Ala12 (Protector)', description: 'Mayor sensibilidad periférica a la insulina.', effectMagnitude: '0.8x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.5, label: 'Homocigoto Ala/Ala', description: 'Resistencia insulínica significativamente reducida.', effectMagnitude: '0.7x riesgo' }
        },
        pubMedIds: ['9758618', '11166442'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1801282'
      },
      {
        rsid: 'rs13266634',
        gene: 'SLC30A8 (ZnT8)',
        chromosome: '8',
        name: 'Transportador de Zinc Pancreático ZnT8',
        evidence: 'high',
        summary: 'Transporta zinc al interior de las vesículas de insulina para la maduración y cristalización hormonal.',
        scientificContext: 'El alelo C (Arg325Trp) confiere mayor susceptibilidad a diabetes tipo 2.',
        genotypes: {
          'CC': { genotype: 'CC', impact: 'elevated', scoreContribution: 0.6, label: 'Riesgo Aumentado SLC30A8 (CC)', description: 'Menor estabilidad y liberación de insulina cristalizada.', effectMagnitude: '1.3x riesgo' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.25, label: 'Heterocigoto (CT)', description: 'Función secretora intermedia.', effectMagnitude: '1.15x riesgo' },
          'TT': { genotype: 'TT', impact: 'protective', scoreContribution: -0.3, label: 'Protector Favorable (TT)', description: 'Cristalización y transporte de zinc óptimo.', effectMagnitude: '0.88x riesgo' }
        },
        pubMedIds: ['17463248', '17463246'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs13266634'
      }
    ]
  },
  {
    id: 'rheumatoid_arthritis',
    title: 'Artritis reumatoide',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Predisposición autoinmune al ataque inflamatorio de la membrana sinovial articular.',
    biologicalMechanism: 'Alelos en el complejo mayor de histocompatibilidad HLA-DRB1 (epítopo compartido) y fosfatasas PTPN22 favorecen la autorreactividad de linfocitos T.',
    lifestyleInsights: [
      'Evitar el tabaquismo (desencadenante mayor de citrulinación proteica).',
      'Optimizar niveles séricos de vitamina D y Omega-3 antiinflamatorio.',
      'Control periódico ante rigidez matutina persistente o dolor articular.'
    ],
    baselineProbability: 3,
    minProbability: 0.8,
    maxProbability: 24,
    type: 'risk',
    snps: [
      {
        rsid: 'rs2476601',
        gene: 'PTPN22 (R620W)',
        chromosome: '1',
        name: 'PTPN22 R620W Autoinmunidad',
        evidence: 'high',
        summary: 'Regulador central del umbral de activación de receptores de células T y B.',
        scientificContext: 'El alelo T (Trp620) incrementa la reactividad autoinmune frente a múltiples autoantígenos.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.85, label: 'Alto riesgo autoinmune (TT)', description: 'Mayor propensión a producción de anticuerpos antipéptidos citrulinados (ACPA).', effectMagnitude: '2.5x riesgo' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.45, label: 'Riesgo autoinmune moderado (CT)', description: 'Tolerancia inmunitaria intermedia.', effectMagnitude: '1.6x riesgo' },
          'CC': { genotype: 'CC', impact: 'average', scoreContribution: 0.0, label: 'Genotipo Estándar (CC)', description: 'Tolerancia autoinmune basal.', effectMagnitude: '1.0x basal' }
        },
        pubMedIds: ['15208781', '17804842'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2476601'
      },
      {
        rsid: 'rs6920220',
        gene: 'TNFAIP3 (A20)',
        chromosome: '6',
        name: 'Factor Inhibidor de NF-kB TNFAIP3',
        evidence: 'high',
        summary: 'Inhibidor maestro de la señalización proinflamatoria de TNF-alfa.',
        scientificContext: 'El alelo A atenúa la inhibición de NF-kB, incrementando la inflamación articular crónica.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.7, label: 'Mayor Inflamación Sinovial (AA)', description: 'Respuesta inflamatoria articular exacerbada.', effectMagnitude: '1.65x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.35, label: 'Respuesta Intermedia (AG)', description: 'Sensibilidad moderada a inflamación articular.', effectMagnitude: '1.25x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.2, label: 'Regulación Óptima (GG)', description: 'Inhibición adecuada de la cascada NF-kB.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['17898774', '20453842'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs6920220'
      }
    ]
  },
  {
    id: 'crohns_disease',
    title: 'Enfermedad de Crohn y Colitis ulcerosa',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Susceptibilidad a la inflamación intestinal crónica y alteración de la autofagia bacteriana.',
    biologicalMechanism: 'Variantes en el receptor de reconocimiento intracelular NOD2/CARD15, ATG16L1 y la vía IL-23/IL-17 alteran la respuesta inmunitaria frente a la microbiota entérica.',
    lifestyleInsights: [
      'Mantener una microbiota intestinal equilibrada con fibra prebiótica fermentable.',
      'Evitar antiinflamatorios no esteroideos (AINEs) que dañen la mucosa intestinal.',
      'Control del estrés mediante técnicas de relajación del eje intestino-cerebro.'
    ],
    baselineProbability: 1.5,
    minProbability: 0.3,
    maxProbability: 18,
    type: 'risk',
    snps: [
      {
        rsid: 'rs2066844',
        gene: 'NOD2 (R702W)',
        chromosome: '16',
        name: 'NOD2 R702W Mutación Intestinal',
        evidence: 'high',
        summary: 'Sensor de dipéptido muramílico de la pared bacteriana en enterocitos.',
        scientificContext: 'Variante de pérdida de función en la defensa de barrera intestinal.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.9, label: 'Alto riesgo de EII (TT)', description: 'Deficiencia en el reconocimiento inmunitario de la flora intestinal.', effectMagnitude: '3.0x riesgo' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.45, label: 'Riesgo moderado (CT)', description: 'Respuesta intermedia.', effectMagnitude: '1.8x riesgo' },
          'CC': { genotype: 'CC', impact: 'average', scoreContribution: 0.0, label: 'Genotipo Normal (CC)', description: 'Reconocimiento bacteriano adecuado.', effectMagnitude: '1.0x' }
        },
        pubMedIds: ['11373681', '11373682'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2066844'
      },
      {
        rsid: 'rs11209026',
        gene: 'IL23R (Arg381Gln)',
        chromosome: '1',
        name: 'IL23R Variante Protectora',
        evidence: 'high',
        summary: 'Modula la vía proinflamatoria Th17 en la mucosa colónica.',
        scientificContext: 'El alelo A (Gln381) confiere una potente protección frente a Crohn y colitis ulcerosa.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'protective', scoreContribution: -0.7, label: 'Protección Fuerte EII', description: 'Vía IL-23 atenuada contra la inflamación crónica.', effectMagnitude: '0.4x riesgo' },
          'AG': { genotype: 'AG', impact: 'protective', scoreContribution: -0.4, label: 'Protección Moderada', description: 'Menor reactividad inflamatoria colónica.', effectMagnitude: '0.65x riesgo' },
          'GG': { genotype: 'GG', impact: 'average', scoreContribution: 0.1, label: 'Línea de base común', description: 'Riesgo poblacional estándar.', effectMagnitude: '1.0x' }
        },
        pubMedIds: ['17068223', '18559552'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs11209026'
      },
      {
        rsid: 'rs2241880',
        gene: 'ATG16L1 (T300A)',
        chromosome: '2',
        name: 'Autofagia de Células de Paneth ATG16L1',
        evidence: 'high',
        summary: 'Regula la respuesta de autofagia celular y secreción de gránulos antimicrobianos en el íleon.',
        scientificContext: 'El alelo G (Ala300) aumenta la degradación proteosomal de ATG16L1 disminuyendo la autofagia.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 0.65, label: 'Mayor Riesgo de Afectación Ileal (GG)', description: 'Autofagia subóptima en mucosa intestinal.', effectMagnitude: '1.5x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.3, label: 'Heterocigoto (AG)', description: 'Autofagia intermedia.', effectMagnitude: '1.2x riesgo' },
          'AA': { genotype: 'AA', impact: 'protective', scoreContribution: -0.2, label: 'Autofagia Normal (AA)', description: 'Defensa antimicrobiana epitelial preservada.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['17200669', '18828159'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2241880'
      }
    ]
  },
  {
    id: 'atrial_fibrillation',
    title: 'Fibrilación auricular',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Vulnerabilidad al desarrollo de arritmias auriculares supraventriculares y conducción eléctrica desorganizada.',
    biologicalMechanism: 'Variantes en el locus 4q25 (PITX2) y ZFHX3 regulan los canales iónicos y la arquitectura miocárdica de las aurículas.',
    lifestyleInsights: [
      'Limitar el consumo excesivo de alcohol y estimulantes.',
      'Control periódico del pulso y presión arterial.',
      'Optimizar niveles séricos de electrolitos como magnesio y potasio.'
    ],
    baselineProbability: 8,
    minProbability: 2,
    maxProbability: 34,
    type: 'risk',
    snps: [
      {
        rsid: 'rs2200733',
        gene: 'PITX2',
        chromosome: '4',
        name: '4q25 Locus de Fibrilación Auricular',
        evidence: 'high',
        summary: 'El locus genético de arritmia más relevante en la población.',
        scientificContext: 'El alelo T está sólidamente ligado a la génesis de focos ectópicos en venas pulmonares.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.85, label: 'Mayor propensión arritmogénica (TT)', description: 'Vulnerabilidad a despolarización ectópica auricular.', effectMagnitude: '1.8x riesgo' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.4, label: 'Propensión moderada (CT)', description: 'Susceptibilidad intermedia.', effectMagnitude: '1.35x riesgo' },
          'CC': { genotype: 'CC', impact: 'average', scoreContribution: 0.0, label: 'Genotipo Basal (CC)', description: 'Frecuencia estándar.', effectMagnitude: '1.0x' }
        },
        pubMedIds: ['17600072', '20502693'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2200733'
      },
      {
        rsid: 'rs2106261',
        gene: 'ZFHX3',
        chromosome: '16',
        name: 'Dedo de Zinc Homeobox ZFHX3',
        evidence: 'high',
        summary: 'Regula la señalización de calcio intracelular y remodelado auricular miocárdico.',
        scientificContext: 'El alelo A está reproducido de forma consistente como locus de riesgo de FA en estudios del consorcio CHARGE.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.7, label: 'Mayor Riesgo de Arritmia (AA)', description: 'Mayor susceptibilidad a fibrilación y flutter auricular.', effectMagnitude: '1.55x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.3, label: 'Heterocigoto (AG)', description: 'Riesgo intermedio.', effectMagnitude: '1.25x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.2, label: 'Genotipo Favorable (GG)', description: 'Conducción eléctrica miocárdica basal.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['19593414', '20418487'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2106261'
      }
    ]
  },
  {
    id: 'psoriasis',
    title: 'Psoriasis',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Predisposición a la hiperproliferación epidérmica y formación de placas eritematoescamosas.',
    biologicalMechanism: 'El alelo mayor HLA-C*06:02 y variantes en la vía IL-23/IL-17 impulsan la activación patológica de queratinocitos.',
    lifestyleInsights: [
      'Exposición solar moderada y controlada con filtro solar.',
      'Uso de hidratantes emolientes ricos en ceramidas y urea.',
      'Manejo del estrés y modulación de factores proinflamatorios.'
    ],
    baselineProbability: 3.5,
    minProbability: 0.8,
    maxProbability: 32,
    type: 'risk',
    snps: [
      {
        rsid: 'rs10484554',
        gene: 'HLA-C (*06:02 tag)',
        chromosome: '6',
        name: 'Marcador HLA-C*06:02',
        evidence: 'high',
        summary: 'Principal factor genético de riesgo en psoriasis tipo I de inicio temprano.',
        scientificContext: 'El alelo T identifica la presencia del antígeno de histocompatibilidad HLA-C*06:02.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.9, label: 'HLA-C*06:02 Positivo Homocigoto', description: 'Alta predisposición al desarrollo de placas de psoriasis.', effectMagnitude: '4.5x riesgo' },
          'CT': { genotype: 'CT', impact: 'elevated', scoreContribution: 0.65, label: 'HLA-C*06:02 Positivo Heterocigoto', description: 'Presencia del antígeno de susceptibilidad.', effectMagnitude: '2.8x riesgo' },
          'CC': { genotype: 'CC', impact: 'protective', scoreContribution: -0.3, label: 'HLA-C*06:02 Negativo', description: 'Baja probabilidad de inicio precoz.', effectMagnitude: 'Riesgo basal' }
        },
        pubMedIds: ['19169254', '20953190'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs10484554'
      },
      {
        rsid: 'rs610604',
        gene: 'TNFAIP3',
        chromosome: '6',
        name: 'TNFAIP3 / Psoriasis Vulgar',
        evidence: 'high',
        summary: 'Modula la hiperproliferación epidérmica estimulada por IL-17A e IFN-gamma.',
        scientificContext: 'El alelo G se asocia a incremento de citoquinas en lesiones cutáneas de psoriasis.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 0.65, label: 'Mayor Reactividad Cutánea (GG)', description: 'Mayor respuesta inflamatoria y recambio de queratinocitos.', effectMagnitude: '1.45x riesgo' },
          'TG': { genotype: 'TG', impact: 'moderate', scoreContribution: 0.3, label: 'Heterocigoto (TG)', description: 'Sensibilidad cutánea intermedia.', effectMagnitude: '1.2x riesgo' },
          'TT': { genotype: 'TT', impact: 'protective', scoreContribution: -0.2, label: 'Genotipo Normal (TT)', description: 'Regulación normal de la barrera queratinocítica.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['19169254', '20953190'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs610604'
      }
    ]
  },
  {
    id: 'deep_vein_thrombosis',
    title: 'Trombosis venosa profunda y Embolia pulmonar',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Tendencia al estado de hipercoagulabilidad sanguínea en el sistema venoso profundo.',
    biologicalMechanism: 'Mutaciones de ganancia de función en Factor V (Leiden), Factor II (Protrombina 20210G>A) y fibrinógeno gamma impiden la inactivación normal del coágulo.',
    lifestyleInsights: [
      'Mantenerse activo e hidratado en viajes de larga duración (>4 horas).',
      'Informar al equipo médico antes de cirugías o tratamientos hormonales con estrógenos.',
      'Uso de medias de compresión graduada en situaciones de inmovilización.'
    ],
    baselineProbability: 4,
    minProbability: 1,
    maxProbability: 45,
    type: 'risk',
    snps: [
      {
        rsid: 'rs6025',
        gene: 'F5 (Factor V Leiden)',
        chromosome: '1',
        name: 'Factor V Leiden 1691G>A',
        evidence: 'high',
        summary: 'Resistencia a la proteína C activada.',
        scientificContext: 'La mutación G1691A (Arg506Gln) impide el corte proteolítico del Factor V activado.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.95, label: 'Factor V Leiden Homocigoto', description: 'Estado protrombótico severo; alto riesgo de trombofilia.', effectMagnitude: '10-20x riesgo' },
          'AG': { genotype: 'AG', impact: 'elevated', scoreContribution: 0.7, label: 'Factor V Leiden Heterocigoto', description: 'Portador de trombofilia hereditaria.', effectMagnitude: '3.8x riesgo' },
          'GG': { genotype: 'GG', impact: 'average', scoreContribution: 0.0, label: 'Genotipo Normal (Sin Leiden)', description: 'Coagulación y lisis normal del Factor V.', effectMagnitude: '1.0x basal' }
        },
        pubMedIds: ['7953400', '19478198'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs6025'
      },
      {
        rsid: 'rs1799963',
        gene: 'F2 (Protrombina G20210A)',
        chromosome: '11',
        name: 'Protrombina 20210G>A',
        evidence: 'high',
        summary: 'Incrementa la síntesis transcripcional de protrombina sérica.',
        scientificContext: 'Variante en la región 3\' no traducida que sobreexpresa la protrombina.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.9, label: 'Protrombina G20210A Homocigoto', description: 'Niveles muy elevados de protrombina en plasma.', effectMagnitude: '6.0x riesgo' },
          'AG': { genotype: 'AG', impact: 'elevated', scoreContribution: 0.6, label: 'Protrombina G20210A Heterocigoto', description: 'Mayor generación de trombina.', effectMagnitude: '2.5x riesgo' },
          'GG': { genotype: 'GG', impact: 'average', scoreContribution: 0.0, label: 'Genotipo Estándar', description: 'Niveles fisiológicos de protrombina.', effectMagnitude: '1.0x' }
        },
        pubMedIds: ['8900235', '19478198'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1799963'
      },
      {
        rsid: 'rs2066865',
        gene: 'FGG (Fibrinógeno Gamma)',
        chromosome: '4',
        name: 'Fibrinógeno Gamma 10034C>T',
        evidence: 'high',
        summary: 'Modula los niveles plasmáticos de dímero D y la estructura del coágulo de fibrina.',
        scientificContext: 'El alelo T disminuye la proporción de la isoforma gamma-prima protectora de fibrinógeno.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.65, label: 'Riesgo Trombofílico Aumentado (TT)', description: 'Mayor densidad de malla de fibrina y resistencia a fibrinólisis.', effectMagnitude: '1.5x riesgo' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.3, label: 'Heterocigoto (CT)', description: 'Riesgo intermedio.', effectMagnitude: '1.2x riesgo' },
          'CC': { genotype: 'CC', impact: 'protective', scoreContribution: -0.2, label: 'Genotipo Estándar (CC)', description: 'Fibrinólisis fisiológica normal.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['17898774', '21378278'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2066865'
      }
    ]
  },
  {
    id: 'celiac_disease_predisposition',
    title: 'Predisposición a Enfermedad Celíaca',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Susceptibilidad inmunogenética a la intolerancia al gluten mediada por heterodímeros HLA-DQ2 y HLA-DQ8.',
    biologicalMechanism: 'Las moléculas HLA-DQ2.5 y DQ8 presentan péptidos de gliadina desamidados a los linfocitos T CD4+, desencadenando atrofia vellositaria.',
    lifestyleInsights: [
      'Si no hay síntomas, no es necesario eliminar el gluten preventivamente.',
      'En caso de síntomas digestivos, realizar anticuerpos IgA antitransglutaminasa antes de iniciar dieta.',
      'Cuidar la permeabilidad de la mucosa intestinal.'
    ],
    baselineProbability: 2,
    minProbability: 0.1,
    maxProbability: 28,
    type: 'risk',
    snps: [
      {
        rsid: 'rs3184504',
        gene: 'SH2B3 / HLA-DQ2',
        chromosome: '12',
        name: 'Marcador de Susceptibilidad Autoinmune SH2B3',
        evidence: 'high',
        summary: 'Modula la transducción de señales proinflamatorias en células inmunes del epitelio.',
        scientificContext: 'El alelo T está asociado con enfermedad celíaca y autoinmunidad sistémica.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.75, label: 'Mayor predisposición inmune (TT)', description: 'Mayor reactividad a péptidos de gluten.', effectMagnitude: '2.0x riesgo' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.35, label: 'Predisposición moderada (CT)', description: 'Susceptibilidad intermedia.', effectMagnitude: '1.35x riesgo' },
          'CC': { genotype: 'CC', impact: 'protective', scoreContribution: -0.4, label: 'Genotipo Favorable (CC)', description: 'Baja reactividad inmune.', effectMagnitude: '0.7x riesgo' }
        },
        pubMedIds: ['18311140', '20190752'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs3184504'
      },
      {
        rsid: 'rs2187668',
        gene: 'HLA-DQA1 / HLA-DQB1',
        chromosome: '6',
        name: 'HLA-DQ2.5 Tag SNP (rs2187668)',
        evidence: 'high',
        summary: 'Marcador tag directo del alelo HLA-DQA1*05:01 / DQB1*02:01.',
        scientificContext: 'Presente en más del 90% de los pacientes diagnosticados de enfermedad celíaca.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.9, label: 'HLA-DQ2.5 Doble Dosis (TT)', description: 'Presencia homocigota del complejo HLA de celíaca.', effectMagnitude: '5.0x riesgo' },
          'CT': { genotype: 'CT', impact: 'elevated', scoreContribution: 0.6, label: 'HLA-DQ2.5 Simple Dosis (CT)', description: 'Portador de la variante de susceptibilidad celíaca.', effectMagnitude: '2.5x riesgo' },
          'CC': { genotype: 'CC', impact: 'protective', scoreContribution: -0.4, label: 'HLA-DQ2.5 Negativo (CC)', description: 'Alto valor predictivo negativo para celíaca.', effectMagnitude: 'Riesgo residual muy bajo' }
        },
        pubMedIds: ['18311140', '20190752'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2187668'
      }
    ]
  },
  {
    id: 'parkinsons_disease',
    title: 'Enfermedad de Parkinson',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Vulnerabilidad a la degeneración progresiva de neuronas dopaminérgicas en la sustancia negra cerebral.',
    biologicalMechanism: 'Variantes en LRRK2, SNCA (alfa-sinucleína) y MAPT alteran el tráfico vesicular, la autofagia y la agregación proteica.',
    lifestyleInsights: [
      'Ejercicio aeróbico continuo para estimular la neuroplasticidad dopaminérgica.',
      'Dieta rica en polifenoles, té verde (EGCG) y antioxidantes mitocondriales.',
      'Mantener niveles adecuados de vitamina D y Coenzima Q10.'
    ],
    baselineProbability: 2,
    minProbability: 0.5,
    maxProbability: 16,
    type: 'risk',
    snps: [
      {
        rsid: 'rs356219',
        gene: 'SNCA (Alfa-sinucleína)',
        chromosome: '4',
        name: 'Variante SNCA 3\' UTR',
        evidence: 'high',
        summary: 'Regula los niveles de expresión de alfa-sinucleína cerebral.',
        scientificContext: 'El alelo G aumenta la transcripción y acumulación de cuerpos de Lewy.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 0.7, label: 'Mayor expresión de alfa-sinucleína (GG)', description: 'Predisposición a agregación proteica neuronal.', effectMagnitude: '1.6x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.35, label: 'Expresión intermedia (AG)', description: 'Susceptibilidad moderada.', effectMagnitude: '1.25x riesgo' },
          'AA': { genotype: 'AA', impact: 'average', scoreContribution: 0.0, label: 'Niveles estándar (AA)', description: 'Línea de base poblacional.', effectMagnitude: '1.0x' }
        },
        pubMedIds: ['19915575', '21292842'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs356219'
      },
      {
        rsid: 'rs34637584',
        gene: 'LRRK2 (G2019S)',
        chromosome: '12',
        name: 'LRRK2 Dardarina G2019S (c.6055G>A)',
        evidence: 'high',
        summary: 'Causa autosómica dominante más frecuente de enfermedad de Parkinson monogénica.',
        scientificContext: 'La mutación G2019S hiperactiva la actividad quinasa provocando toxicidad dopaminérgica.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.95, label: 'LRRK2 G2019S Homocigoto', description: 'Alta penetrancia para parkinsonismo con respuesta a L-dopa.', effectMagnitude: 'Riesgo genético dominante alto' },
          'GA': { genotype: 'GA', impact: 'elevated', scoreContribution: 0.85, label: 'LRRK2 G2019S Heterocigoto', description: 'Portador de la variante de alta penetrancia (penetrancia 30-70% a los 80 años).', effectMagnitude: 'Alto riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.2, label: 'Genotipo Normal (Sin G2019S)', description: 'Ausencia de la mutación mayor de LRRK2.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['15543153', '16682602'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs34637584'
      }
    ]
  },
  {
    id: 'age_related_macular_degeneration',
    title: 'Degeneración macular asociada a la edad (DMAE)',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Susceptibilidad a la formación de drusas y daño degenerativo en la fóvea macular retiniana.',
    biologicalMechanism: 'Variantes en el Factor H del Complemento (CFH Y402H) y ARMS2 causan desregulación de la cascada del complemento e inflamación retiniana.',
    lifestyleInsights: [
      'Proteger los ojos con gafas de sol homologadas con filtro UV400 y luz azul.',
      'Consumo de carotenoides maculares: luteína, zeaxantina y astaxantina.',
      'Evitar el tabaco (principal factor epigenético de daño macular).'
    ],
    baselineProbability: 8,
    minProbability: 1.5,
    maxProbability: 46,
    type: 'risk',
    snps: [
      {
        rsid: 'rs1061170',
        gene: 'CFH (Y402H)',
        chromosome: '1',
        name: 'Factor H Y402H',
        evidence: 'high',
        summary: 'El principal marcador de susceptibilidad a DMAE.',
        scientificContext: 'La sustitución Tyr402His (alelo C) compromete la inhibición del complemento en el epitelio pigmentario de la retina.',
        genotypes: {
          'CC': { genotype: 'CC', impact: 'elevated', scoreContribution: 0.9, label: 'CFH Y402H Homocigoto (Alto Riesgo)', description: 'Incapacidad parcial de inhibir la inflamación retiniana.', effectMagnitude: '3.5x riesgo' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.45, label: 'CFH Y402H Heterocigoto', description: 'Susceptibilidad moderada a degeneración macular.', effectMagnitude: '1.8x riesgo' },
          'TT': { genotype: 'TT', impact: 'protective', scoreContribution: -0.4, label: 'Genotipo Protector (TT)', description: 'Función inhibitoria normal de la vía del complemento.', effectMagnitude: '0.7x riesgo' }
        },
        pubMedIds: ['15765096', '15765097'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1061170'
      },
      {
        rsid: 'rs10490924',
        gene: 'ARMS2 (A69S)',
        chromosome: '10',
        name: 'ARMS2 Ala69Ser (LOC387715)',
        evidence: 'high',
        summary: 'Segundo locus genético principal de neovascularización coroidea y atrofia macular geográfica.',
        scientificContext: 'El alelo T (Ser69) induce disfunción mitocondrial en fotorreceptores retinianos.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.85, label: 'Alto Riesgo Retiniano ARMS2 (TT)', description: 'Mayor susceptibilidad a progresión a DMAE exudativa.', effectMagnitude: '3.0x riesgo' },
          'GT': { genotype: 'GT', impact: 'moderate', scoreContribution: 0.4, label: 'Heterocigoto ARMS2 (GT)', description: 'Riesgo moderado de degeneración macular.', effectMagnitude: '1.7x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.3, label: 'Genotipo Favorable (GG)', description: 'Función mitocondrial macular estándar.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['16790580', '16990520'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs10490924'
      }
    ]
  },
  {
    id: 'hyperuricemia_gout',
    title: 'Metabolismo del Ácido Úrico y Predisposición a Gota',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Vulnerabilidad a la acumulación de urato sérico y precipitación de cristales de urato monosódico en articulaciones (artritis gotosa).',
    biologicalMechanism: 'Variantes en los transportadores renales e intestinales de urato GLUT9 (SLC2A9) y BCRP (ABCG2) modulan la excreción y reabsorción de ácido úrico.',
    lifestyleInsights: [
      'Moderar el consumo de carnes rojas ricas en purinas, mariscos, cerveza y fructosa añadida.',
      'Mantener hidratación abundante (>2.5 L diarios de agua) para facilitar el aclaramiento renal.',
      'Consumo regular de cerezas y vitamina C (apoyan la eliminación de urato).'
    ],
    baselineProbability: 6,
    minProbability: 1,
    maxProbability: 38,
    type: 'risk',
    snps: [
      {
        rsid: 'rs734553',
        gene: 'SLC2A9 (GLUT9)',
        chromosome: '4',
        name: 'Transportador Renal de Urato SLC2A9',
        evidence: 'high',
        summary: 'Regula más del 30% de la variabilidad genética en los niveles de ácido úrico en sangre.',
        scientificContext: 'El alelo T promueve una menor reabsorción tubular renal, favoreciendo niveles más bajos de urato.',
        genotypes: {
          'CC': { genotype: 'CC', impact: 'elevated', scoreContribution: 0.8, label: 'Mayor reabsorción de urato (CC)', description: 'Tendencia a hiperuricemia y mayor probabilidad de crisis gotosas.', effectMagnitude: '1.8x riesgo' },
          'CT': { genotype: 'CT', impact: 'average', scoreContribution: 0.1, label: 'Aclaramiento Intermedio (CT)', description: 'Nivel medio poblacional.', effectMagnitude: '1.1x' },
          'TT': { genotype: 'TT', impact: 'protective', scoreContribution: -0.5, label: 'Excreción Renal Eficiente (TT)', description: 'Menores concentraciones basales de ácido úrico sérico.', effectMagnitude: '0.6x riesgo' }
        },
        pubMedIds: ['17965710', '18317475'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs734553'
      },
      {
        rsid: 'rs2231142',
        gene: 'ABCG2 (Q141K)',
        chromosome: '4',
        name: 'Transportador de Salida ABCG2 Q141K',
        evidence: 'high',
        summary: 'Responsable de la secreción de ácido úrico a nivel intestinal y renal.',
        scientificContext: 'El alelo T (Lys141) reduce a la mitad la capacidad de transporte excretor de urato.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.85, label: 'Función Excretora Muy Reducida (TT)', description: 'Alto riesgo de hiperuricemia por sobrecarga de urato.', effectMagnitude: '2.5x riesgo de gota' },
          'GT': { genotype: 'GT', impact: 'moderate', scoreContribution: 0.4, label: 'Función Excretora Intermedia (GT)', description: 'Secreción reducida de urato en intestino.', effectMagnitude: '1.6x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.2, label: 'Excreción Intestinal Óptima (GG)', description: 'Aclaramiento fisiológico de urato.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['18676989', '20188616'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2231142'
      }
    ]
  },
  {
    id: 'essential_hypertension_salt',
    title: 'Hipertensión Esencial y Sensibilidad al Sodio',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Sensibilidad vascular a la sobrecarga de sodio y tono del sistema renina-angiotensina-aldosterona (SRAA).',
    biologicalMechanism: 'La variante M235T en el angiotensinógeno (AGT) y variantes en el receptor de angiotensina II (AGTR1) alteran la reactividad vascular periférica.',
    lifestyleInsights: [
      'Limitar el sodio dietético a <2 g/día y enriquecer la dieta con potasio (plátanos, aguacate, espinacas).',
      'Monitoreo ambulatorio de la presión arterial en situaciones de estrés o esfuerzo.',
      'Actividad física aeróbica regular para estimular la síntesis de óxido nítrico endotelial.'
    ],
    baselineProbability: 25,
    minProbability: 8,
    maxProbability: 65,
    type: 'risk',
    snps: [
      {
        rsid: 'rs699',
        gene: 'AGT (M235T)',
        chromosome: '1',
        name: 'Angiotensinógeno M235T',
        evidence: 'high',
        summary: 'Elevación de niveles plasmáticos de angiotensinógeno y vasoconstricción.',
        scientificContext: 'El alelo C (Treonina en posición 235) incrementa los niveles de AGT circulante y la respuesta hipertensiva al sodio.',
        genotypes: {
          'CC': { genotype: 'CC', impact: 'elevated', scoreContribution: 0.75, label: 'Sensible al Sodio / Alto Tono SRAA (CC)', description: 'Mayor respuesta presora al consumo de sal e incremento de tensión arterial sistólica/diastólica.', effectMagnitude: '1.6x riesgo' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.3, label: 'Sensibilidad Intermedia (CT)', description: 'Respuesta moderada.', effectMagnitude: '1.25x' },
          'TT': { genotype: 'TT', impact: 'protective', scoreContribution: -0.3, label: 'Tono Vascular Normal (TT)', description: 'Baja reactividad hipertensiva a la sal.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['1471373', '9051874'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs699'
      },
      {
        rsid: 'rs5186',
        gene: 'AGTR1 (A1166C)',
        chromosome: '3',
        name: 'Receptor de Angiotensina II Tipo 1 A1166C',
        evidence: 'high',
        summary: 'Regula la respuesta vasoconstrictora arterial frente a la angiotensina II.',
        scientificContext: 'El alelo C previene la unión del microARN-155 inhibitorio, incrementando la densidad de receptores de angiotensina.',
        genotypes: {
          'CC': { genotype: 'CC', impact: 'elevated', scoreContribution: 0.7, label: 'Mayor Reactividad Vasoconstrictora (CC)', description: 'Alta sensibilidad vasopresora y mayor rigidez arterial.', effectMagnitude: '1.5x riesgo de HTA' },
          'AC': { genotype: 'AC', impact: 'moderate', scoreContribution: 0.3, label: 'Reactividad Intermedia (AC)', description: 'Sensibilidad vascular moderada.', effectMagnitude: '1.2x riesgo' },
          'AA': { genotype: 'AA', impact: 'protective', scoreContribution: -0.2, label: 'Regulación Vascular Normal (AA)', description: 'Densidad fisiológica de receptores AGTR1.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['8138765', '16362590'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs5186'
      }
    ]
  },
  {
    id: 'amygdala_anxiety_reactivity',
    title: 'Reactividad Emocional Amigdalina y Vulnerabilidad a la Ansiedad',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Intensidad en el procesamiento límbico de estímulos amenazantes y regulación serotonérgica y catecolaminérgica cerebral.',
    biologicalMechanism: 'Variantes en el transportador de serotonina SLC6A4 y en la catecol-O-metiltransferasa (COMT Val158Met) modulan la dopamina y serotonina sinápticas prefrontales.',
    lifestyleInsights: [
      'Práctica de técnicas de modulación vagal y respiración diafragmática.',
      'Ejercicio físico y exposición controlada a situaciones de desafío emocional.',
      'Evitar el exceso de estimulantes adrenérgicos (cafeína concentrada en ayunas).'
    ],
    baselineProbability: 18,
    minProbability: 5,
    maxProbability: 55,
    type: 'risk',
    snps: [
      {
        rsid: 'rs25531',
        gene: 'SLC6A4 (5-HTTLPR / 5-HTT)',
        chromosome: '17',
        name: 'Transportador de Serotonina SLC6A4',
        evidence: 'high',
        summary: 'Modula la densidad del transportador de serotonina y la reactividad amigdalina ante estresores.',
        scientificContext: 'El alelo G funcionalmente equivalente a la variante corta atenúa la tasa de transcripción de SLC6A4.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 0.8, label: 'Mayor Reactividad Límbica (GG/S)', description: 'Mayor activación de la amígdala ante expresiones emocionales o incertidumbre.', effectMagnitude: '1.6x reactividad' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.35, label: 'Sensibilidad Intermedia (AG)', description: 'Respuesta emocional adaptativa con sensibilidad moderada al estrés.', effectMagnitude: '1.25x' },
          'AA': { genotype: 'AA', impact: 'protective', scoreContribution: -0.4, label: 'Mayor Resiliencia Emocional Basal (AA/L)', description: 'Recaptación serotonérgica eficiente y menor labilidad ansiosa.', effectMagnitude: 'Resiliencia alta' }
        },
        pubMedIds: ['16380709', '18635773'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs25531'
      },
      {
        rsid: 'rs4680',
        gene: 'COMT (Val158Met)',
        chromosome: '22',
        name: 'Catecol-O-Metiltransferasa Val158Met',
        evidence: 'high',
        summary: 'Regula la degradación de dopamina en la corteza prefrontal (dimorfismo Guerrero vs Explorador).',
        scientificContext: 'El alelo A (Met158) reduce la actividad enzimática x4, aumentando dopamina tónica y sensibilidad al estrés agudo.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'moderate', scoreContribution: 0.5, label: 'Met/Met (Mayor Sensibilidad al Estrés / Alta Concentración)', description: 'Alta dopamina prefrontal; gran atención y memoria de trabajo pero mayor reactividad ansiosa.', effectMagnitude: 'Sensibilidad al estrés' },
          'AG': { genotype: 'AG', impact: 'average', scoreContribution: 0.1, label: 'Val/Met (Equilibrio Dopaminérgico)', description: 'Balance óptimo entre tolerancia a la presión y rendimiento cognitivo.', effectMagnitude: 'Respuesta equilibrada' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.3, label: 'Val/Val (Alta Resiliencia al Estrés / Guerrero)', description: 'Degradación rápida de dopamina; gran estabilidad emocional bajo estrés extremo.', effectMagnitude: 'Resiliencia al estrés' }
        },
        pubMedIds: ['12444972', '16897724'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs4680'
      }
    ]
  },
  {
    id: 'non_alcoholic_fatty_liver_pnpla3',
    title: 'Esteatosis Hepática Metabólica / Hígado Graso (PNPLA3 / TM6SF2)',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Predisposición a la acumulación intracelular de triglicéridos en los hepatocitos y susceptibilidad a esteatohepatitis no alcohólica (MASLD).',
    biologicalMechanism: 'La variante I148M (rs738409) en PNPLA3 (patatina) interfiere en la hidrólisis de triglicéridos en las gotas lipídicas del hígado, mientras que TM6SF2 regula la secreción de VLDL.',
    lifestyleInsights: [
      'Reducción estricta de azúcares libres, especialmente fructosa industrial y bebidas carbonatadas.',
      'Aporte de ácidos grasos monoinsaturados (aceite de oliva virgen extra) y antioxidantes hepáticos (colina, café filtrado).',
      'Ejercicio físico regular aeróbico y de fuerza para movilizar la grasa intrahepática.',
      'Control periódico de transaminasas (ALT, AST), ferritina e índice FIB-4 / elastografía.'
    ],
    baselineProbability: 22,
    minProbability: 6,
    maxProbability: 68,
    type: 'risk',
    snps: [
      {
        rsid: 'rs738409',
        gene: 'PNPLA3 (I148M)',
        chromosome: '22',
        name: 'Adiponutrina PNPLA3 I148M (c.444C>G)',
        evidence: 'high',
        summary: 'Principal factor genético conocido de susceptibilidad al hígado graso y progresión fibrótica hepática.',
        scientificContext: 'El alelo G (Metionina 148) produce retención de triglicéridos e inhibición de la lipólisis fisiológica en hepatocitos.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 0.9, label: 'Alto Riesgo de Acumulación Lipídica Hepática (GG)', description: 'Doble copia de la variante I148M; marcado incremento en el contenido de grasa hepática incluso con IMC normal.', effectMagnitude: '3.2x riesgo de esteatosis' },
          'CG': { genotype: 'CG', impact: 'moderate', scoreContribution: 0.45, label: 'Riesgo Moderado (CG / Heterocigoto)', description: 'Una copia del alelo G; requiere dieta balanceada baja en azúcares rápidos.', effectMagnitude: '1.8x riesgo' },
          'CC': { genotype: 'CC', impact: 'protective', scoreContribution: -0.3, label: 'Genotipo Favorable (CC / I148I)', description: 'Movilización lipídica hepática normal.', effectMagnitude: 'Riesgo basal' }
        },
        pubMedIds: ['18820647', '21664915'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs738409'
      },
      {
        rsid: 'rs58542926',
        gene: 'TM6SF2 (E167K)',
        chromosome: '19',
        name: 'Transmembrana 6 SF2 E167K',
        evidence: 'high',
        summary: 'Regula la secreción de partículas ricas en lípidos desde el hígado hacia el torrente sanguíneo.',
        scientificContext: 'El alelo T (Lisina 167) disminuye la exportación de VLDL, aumentando la retención de grasa en el parénquima hepático.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'elevated', scoreContribution: 0.7, label: 'Retención Hepática Aumentada (TT)', description: 'Mayor retención intrahepática de lípidos.', effectMagnitude: '2.0x riesgo' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.35, label: 'Heterocigoto E167K (CT)', description: 'Susceptibilidad moderada a esteatosis.', effectMagnitude: '1.4x riesgo' },
          'CC': { genotype: 'CC', impact: 'average', scoreContribution: 0.0, label: 'Alelo Estándar (CC)', description: 'Secreción fisiológica equilibrada de VLDL.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['24531328', '24954795'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs58542926'
      }
    ]
  },
  {
    id: 'osteoporosis_bone_density',
    title: 'Densidad Mineral Ósea y Riesgo de Osteoporosis (LRP5 / WNT16)',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Vulnerabilidad genética a la pérdida acelerada de masa ósea, deterioro microarquitectónico trabecular y riesgo de fracturas por fragilidad.',
    biologicalMechanism: 'Variantes en la vía de señalización osteoblástica Wnt (LRP5 y WNT16) regulan la diferenciación y actividad de los osteoblastos frente a la resorción osteoclástica.',
    lifestyleInsights: [
      'Garantizar niveles séricos óptimos de 25-hidroxivitamina D (>30-40 ng/mL) y magnesio.',
      'Entrenamiento de fuerza con cargas progresivas e impacto osteogénico regular (saltos moderados, caminatas en cuesta).',
      'Aporte dietético suficiente de calcio biodisponible y vitamina K2 (menaquinona-7).',
      'Densitometría ósea (DEXA) de control en etapas de perimenopausia o a partir de los 55 años.'
    ],
    baselineProbability: 16,
    minProbability: 4,
    maxProbability: 52,
    type: 'risk',
    snps: [
      {
        rsid: 'rs3736228',
        gene: 'LRP5 (c.2047G>A / A1330V)',
        chromosome: '11',
        name: 'Receptor de Señalización Ósea LRP5',
        evidence: 'high',
        summary: 'Determinante genético central de la densidad mineral ósea (DMO) de columna lumbar y cuello femoral.',
        scientificContext: 'El alelo A (Val1330) atenúa la cascada anabólica Wnt/beta-catenina en los osteoblastos.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.8, label: 'Menor Densidad Mineral Ósea (AA)', description: 'Mayor tasa de resorción y menor masa ósea pico alcanzada.', effectMagnitude: '1.7x riesgo de fractura' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.35, label: 'Densidad Ósea Intermedia (AG)', description: 'Masa ósea ligeramente inferior a la media poblacional.', effectMagnitude: '1.25x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.3, label: 'Genotipo Favorable (GG)', description: 'Densidad mineral ósea preservada y buena respuesta osteogénica.', effectMagnitude: 'Riesgo basal' }
        },
        pubMedIds: ['17952075', '22504420'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs3736228'
      },
      {
        rsid: 'rs3801387',
        gene: 'WNT16',
        chromosome: '7',
        name: 'Factor Paracrino Óseo WNT16',
        evidence: 'high',
        summary: 'Regula el grosor y resistencia cortical del hueso largo ante impactos biomecánicos.',
        scientificContext: 'Variantes de riesgo en WNT16 se correlacionan con menor grosor de la corteza ósea y fragilidad en antebrazo y cadera.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.7, label: 'Mayor Fragilidad Cortical (AA)', description: 'Menor resistencia a impactos torsionales.', effectMagnitude: '1.5x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.3, label: 'Resistencia Intermedia (AG)', description: 'Parámetros corticales moderados.', effectMagnitude: '1.2x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.2, label: 'Estructura Cortical Óptima (GG)', description: 'Grosor cortical y mineralización preservados.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['22504420', '23049753'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs3801387'
      }
    ]
  },
  {
    id: 'glaucoma_ocular_pressure',
    title: 'Glaucoma Primario de Ángulo Abierto y Presión Intraocular (CDKN2B-AS1 / CAV1)',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Predisposición a la elevación asintomática de la presión intraocular (PIO) y neuropatía óptica por pérdida progresiva de células ganglionares retinianas.',
    biologicalMechanism: 'Variantes en 9p21 (CDKN2B-AS1) y caveolina-1/2 (CAV1/CAV2) alteran el flujo del humor acuoso en la malla trabecular y la autorregulación vascular del nervio óptico.',
    lifestyleInsights: [
      'Revisiones oftalmológicas periódicas con tonometría ocular y fondo de ojo a partir de los 40 años.',
      'Evitar esfuerzos mantenidos de tipo Valsalva o posturas invertidas prolongadas en yoga.',
      'Dieta rica en polifenoles, luteína, zeaxantina y ginkgo biloba para soporte neurovascular retiniano.'
    ],
    baselineProbability: 8,
    minProbability: 2,
    maxProbability: 38,
    type: 'risk',
    snps: [
      {
        rsid: 'rs2157719',
        gene: 'CDKN2B-AS1 (ANRIL)',
        chromosome: '9',
        name: 'Locus 9p21 de Neuropatía Glaucomatosa',
        evidence: 'high',
        summary: 'Principal locus genético asociado a la vulnerabilidad del nervio óptico y glaucoma primario.',
        scientificContext: 'El alelo G altera la senescencia celular y la integridad de la cabeza del nervio óptico frente a la tensión ocular.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 0.8, label: 'Mayor Susceptibilidad a Neuropatía Óptica (GG)', description: 'Sensibilidad aumentada del nervio óptico ante presiones intraoculares moderadas o altas.', effectMagnitude: '1.8x riesgo de glaucoma' },
          'GA': { genotype: 'GA', impact: 'moderate', scoreContribution: 0.4, label: 'Vulnerabilidad Moderada (GA)', description: 'Requiere monitorización preventiva periódica de la PIO.', effectMagnitude: '1.35x riesgo' },
          'AA': { genotype: 'AA', impact: 'protective', scoreContribution: -0.3, label: 'Protección Favorable (AA)', description: 'Resistencia estructural adecuada del nervio óptico.', effectMagnitude: 'Riesgo basal bajo' }
        },
        pubMedIds: ['20835237', '21532578'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2157719'
      },
      {
        rsid: 'rs4236601',
        gene: 'CAV1 / CAV2',
        chromosome: '7',
        name: 'Caveolina-1/2 Regulación de la PIO',
        evidence: 'high',
        summary: 'Modula la mecanosensibilidad endotelial de la malla trabecular y canal de Schlemm.',
        scientificContext: 'El alelo A está asociado a mayor resistencia al drenaje de humor acuoso y presión intraocular elevada.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.7, label: 'Mayor Presión Intraocular (AA)', description: 'Menor facilidad de salida trabecular de humor acuoso.', effectMagnitude: '1.45x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.3, label: 'Heterocigoto (AG)', description: 'Drenaje trabecular moderado.', effectMagnitude: '1.2x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.2, label: 'Drenaje Ocular Óptimo (GG)', description: 'Presión intraocular fisiológica normal.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['20835237', '21532578'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs4236601'
      }
    ]
  },
  {
    id: 'chronic_kidney_disease_shroom3',
    title: 'Función Renal y Tasa de Filtrado Glomerular (SHROOM3 / UMOD)',
    category: 'health_vulnerability',
    categoryLabel: 'Vulnerabilidad genética a condiciones de salud',
    description: 'Predisposición a la disminución progresiva del filtrado glomerular renal (eGFR) y vulnerabilidad a fibrosis tubulointersticial.',
    biologicalMechanism: 'Variantes en el gen SHROOM3 modulan la expresión de factores profibróticos en podocitos y células tubulares, mientras que UMOD regula la uromodulina protectora.',
    lifestyleInsights: [
      'Mantener una hidratación hídrica adecuada y evitar el uso crónico indiscriminado de AINEs (ibuprofeno, naproxeno).',
      'Control estricto de la presión arterial y de la glucemia para prevenir daño microvascular renal.',
      'Analítica anual con creatinina sérica, cálculo de filtrado glomerular (eGFR) y ratio albúmina/creatinina en orina.'
    ],
    baselineProbability: 11,
    minProbability: 3,
    maxProbability: 42,
    type: 'risk',
    snps: [
      {
        rsid: 'rs17319721',
        gene: 'SHROOM3',
        chromosome: '4',
        name: 'Factor Fibrogénico Renal SHROOM3',
        evidence: 'high',
        summary: 'Asociado con la regulación transcripcional de la tasa de filtrado glomerular en estudios GWAS poblacionales.',
        scientificContext: 'El alelo A aumenta la transcripción renal de SHROOM3 y la propensión a fibrosis intersticial renal crónica.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.75, label: 'Tendencia a Menor Filtrado Glomerular (AA)', description: 'Mayor susceptibilidad a declive renal con la edad o estresores metabólicos.', effectMagnitude: '1.6x riesgo' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.35, label: 'Función Renal Intermedia (AG)', description: 'Reserva funcional renal moderada.', effectMagnitude: '1.25x riesgo' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.3, label: 'Genotipo Protector Favorable (GG)', description: 'Filtrado glomerular robusto y baja tasa de declive renal basal.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['19455183', '20383146'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs17319721'
      },
      {
        rsid: 'rs12917707',
        gene: 'UMOD (Uromodulina)',
        chromosome: '16',
        name: 'Uromodulina / Protección Tubular Renal',
        evidence: 'high',
        summary: 'Regula la expresión de uromodulina (proteína Tamm-Horsfall) en el asa de Henle.',
        scientificContext: 'El alelo T protege contra la enfermedad renal crónica y la elevación de creatinina sérica.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 0.65, label: 'Mayor Riesgo de Deterioro Renal (GG)', description: 'Sobreexpresión de uromodulina con mayor susceptibilidad a daño intersticial.', effectMagnitude: '1.4x riesgo' },
          'GT': { genotype: 'GT', impact: 'average', scoreContribution: 0.1, label: 'Heterocigoto (GT)', description: 'Riesgo estándar de filtrado glomerular.', effectMagnitude: '1.0x' },
          'TT': { genotype: 'TT', impact: 'protective', scoreContribution: -0.4, label: 'Genotipo Protector Renal (TT)', description: 'Protección frente a deterioro renal crónico.', effectMagnitude: '0.75x riesgo' }
        },
        pubMedIds: ['19455183', '20383146'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs12917707'
      }
    ]
  }
];
