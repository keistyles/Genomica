import { TraitDefinition } from '../types/genetics';

export const WELLNESS_TRAITS_DATA: TraitDefinition[] = [
  {
    id: 'lactose_intolerance',
    title: 'Tolerancia y Persistencia de la Lactasa (MCM6 / LCT)',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Capacidad genética de mantener la producción de la enzima lactasa en la mucosa intestinal durante la edad adulta.',
    biologicalMechanism: 'La variante -13910C>T (rs4988235) en la región reguladora intrónica del gen MCM6 mantiene activa la transcripción del promotor de la lactasa (LCT).',
    lifestyleInsights: [
      'Individuos con genotipo CC (no persistencia) experimentan fermentación bacteriana colónica con hinchazón y gases ante lácteos con lactosa.',
      'Optar por lácteos fermentados como yogur o kéfir (cuyas bacterias ya predigieren la lactosa), quesos curados o lácteos sin lactosa.',
      'Asegurar el aporte de calcio a través de semillas de sésamo, frutos secos, sardinillas y vegetales verdes.'
    ],
    baselineProbability: 35,
    minProbability: 2,
    maxProbability: 95,
    unit: '% de probabilidad de intolerancia a la lactosa',
    type: 'risk',
    snps: [
      {
        rsid: 'rs4988235',
        gene: 'MCM6 / LCT (-13910C>T)',
        chromosome: '2',
        name: 'Lactasa -13910 C>T',
        evidence: 'high',
        summary: 'Determinante genético primario de la persistencia de lactasa en edad adulta.',
        scientificContext: 'El alelo T confiere persistencia de lactasa dominante.',
        genotypes: {
          'CC': {
            genotype: 'CC',
            impact: 'elevated',
            scoreContribution: 0.95,
            label: 'No Persistencia de Lactasa (Intolerante en la Adultez)',
            description: 'Disminución progresiva de la enzima lactasa tras la infancia. Dificultad para digerir la lactosa de la leche entera.',
            effectMagnitude: 'No persistencia de lactasa'
          },
          'CT': {
            genotype: 'CT',
            impact: 'protective',
            scoreContribution: -0.7,
            label: 'Persistencia de Lactasa (Tolerante Heterocigoto)',
            description: 'Producción mantenida de lactasa en la edad adulta; digestión adecuada de productos lácteos.',
            effectMagnitude: 'Persistencia de lactasa'
          },
          'TT': {
            genotype: 'TT',
            impact: 'protective',
            scoreContribution: -0.95,
            label: 'Persistencia Completa de Lactasa (Tolerante Homocigoto)',
            description: 'Alta síntesis de lactasa intestinal continuada; digestión óptima de la lactosa.',
            effectMagnitude: 'Persistencia completa'
          }
        },
        pubMedIds: ['11788828', '15114531'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs4988235'
      },
      {
        rsid: 'rs182549',
        gene: 'MCM6 (-22018G>A)',
        chromosome: '2',
        name: 'MCM6 -22018 G>A',
        evidence: 'high',
        summary: 'Marcador en desequilibrio de ligamiento que corrobora la persistencia de lactasa.',
        scientificContext: 'El alelo A está fuertemente correlacionado con la tolerancia a la lactosa.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'protective', scoreContribution: -0.9, label: 'Persistencia de Lactasa (AA)', description: 'Tolerancia digestiva alta a lácteos.', effectMagnitude: 'Tolerante' },
          'AG': { genotype: 'AG', impact: 'protective', scoreContribution: -0.5, label: 'Persistencia de Lactasa (AG)', description: 'Tolerancia intermedia a alta.', effectMagnitude: 'Tolerante' },
          'GG': { genotype: 'GG', impact: 'elevated', scoreContribution: 0.8, label: 'No Persistencia (GG)', description: 'Baja producción adulta de lactasa.', effectMagnitude: 'No tolerante' }
        },
        pubMedIds: ['11788828', '15114531'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs182549'
      }
    ]
  },
  {
    id: 'caffeine_metabolism_athletic',
    title: 'Metabolismo de Cafeína y Rendimiento Deportivo (CYP1A2)',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Velocidad de aclaramiento hepático de la cafeína y su efecto ergogénico en el rendimiento físico y resistencia.',
    biologicalMechanism: 'La enzima citocromo P450 1A2 (CYP1A2) metaboliza más del 95% de la cafeína a paraxantina. El alelo -163C>A incrementa la inducibilidad enzimática.',
    lifestyleInsights: [
      'Metabolizadores rápidos (AA): Obtienen un beneficio ergogénico notable consumiendo 3-6 mg/kg de cafeína 45 minutos antes del ejercicio.',
      'Metabolizadores lentos (AC/CC): La cafeína permanece en sangre mucho más tiempo, pudiendo provocar palpitaciones, reflujo o empeorar el rendimiento si se toma en exceso.'
    ],
    baselineProbability: 45,
    minProbability: 10,
    maxProbability: 90,
    unit: '% de tasa de aclaramiento metabólico de cafeína',
    type: 'metabolic_speed',
    snps: [
      {
        rsid: 'rs762551',
        gene: 'CYP1A2 (*1F -163A>C)',
        chromosome: '15',
        name: 'CYP1A2 -163C>A',
        evidence: 'high',
        summary: 'Regulador maestro de la tasa de eliminación de la cafeína.',
        scientificContext: 'El alelo A aumenta la velocidad de metabolización.',
        genotypes: {
          'AA': {
            genotype: 'AA',
            impact: 'protective',
            scoreContribution: 0.9,
            label: 'Metabolizador Rápido de Cafeína (CYP1A2 *1A/*1A)',
            description: 'Aclaramiento acelerado. Mayor beneficio en rendimiento deportivo y menor riesgo de efectos cardiovasculares.',
            effectMagnitude: 'Metabolismo rápido ergogénico'
          },
          'AC': {
            genotype: 'AC',
            impact: 'moderate',
            scoreContribution: 0.2,
            label: 'Metabolizador Intermedio de Cafeína',
            description: 'Velocidad de eliminación media; limitar el consumo a primeras horas del día.',
            effectMagnitude: 'Metabolismo intermedio'
          },
          'CC': {
            genotype: 'CC',
            impact: 'elevated',
            scoreContribution: -0.8,
            label: 'Metabolizador Lento de Cafeína (*1F/*1F)',
            description: 'La cafeína permanece horas en circulación; evitar el consumo pasadas las 14:00 para no perturbar el sueño profundo.',
            effectMagnitude: 'Metabolismo lento'
          }
        },
        pubMedIds: ['16522833', '29509641'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs762551'
      }
    ]
  },
  {
    id: 'caffeine_anxiety_adora2a',
    title: 'Cafeína y Sensibilidad a la Ansiedad (ADORA2A)',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Sensibilidad a la sobreactivación del sistema nervioso central, nerviosismo y temblores inducidos por cafeína.',
    biologicalMechanism: 'La cafeína actúa como antagonista de los receptores de adenosina A2A (ADORA2A). El polimorfismo 1976C>T modula la respuesta ansiogénica.',
    lifestyleInsights: [
      'En individuos con genotipo TT, el café puede precipitar ansiedad aguda o insomnio a pesar de bajas dosis.',
      'Sustituir por té verde rico en L-teanina, que amortigua la sobreexcitación neuronal.'
    ],
    baselineProbability: 30,
    minProbability: 5,
    maxProbability: 85,
    unit: '% de susceptibilidad ansiogénica por cafeína',
    type: 'risk',
    snps: [
      {
        rsid: 'rs5751876',
        gene: 'ADORA2A (1976C>T)',
        chromosome: '22',
        name: 'Receptor de Adenosina A2A',
        evidence: 'high',
        summary: 'Predice la respuesta ansiogénica ante la ingesta de cafeína.',
        scientificContext: 'El alelo T está ligado a mayor excitación cerebral y taquicardia refleja.',
        genotypes: {
          'TT': {
            genotype: 'TT',
            impact: 'elevated',
            scoreContribution: 0.85,
            label: 'Alta Sensibilidad a Ansiedad por Cafeína (TT)',
            description: 'Mayor propensión a temblores, agitación y dificultad para conciliar el sueño incluso con 1 taza de café.',
            effectMagnitude: '2.5x respuesta ansiogénica'
          },
          'CT': {
            genotype: 'CT',
            impact: 'moderate',
            scoreContribution: 0.35,
            label: 'Sensibilidad Moderada a la Cafeína (CT)',
            description: 'Tolerancia moderada; evitar dosis elevadas (>200mg en una sola toma).',
            effectMagnitude: '1.3x respuesta'
          },
          'CC': {
            genotype: 'CC',
            impact: 'protective',
            scoreContribution: -0.4,
            label: 'Baja Sensibilidad a la Ansiedad (CC)',
            description: 'Tolerancia elevada; efecto estimulante sin desencadenar nerviosismo excesivo.',
            effectMagnitude: 'Buena tolerancia'
          }
        },
        pubMedIds: ['17514187', '18414649'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs5751876'
      }
    ]
  },
  {
    id: 'actn3_muscle_performance',
    title: 'Composición de Fibras Musculares y Potencia (ACTN3 R577X)',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Presencia de alfa-actinina-3 en fibras musculares de contracción rápida tipo IIX: Rendimiento de Potencia/Sprint vs Resistencia.',
    biologicalMechanism: 'La alfa-actinina-3 estabiliza el aparato contráctil en la línea Z muscular. El codón de parada prematuro R577X (rs1815739) resulta en ausencia de la proteína.',
    lifestyleInsights: [
      'Genotipo RR (Potencia): Alta capacidad de generación de fuerza explosiva, velocidad y aceleración en deportes de potencia.',
      'Genotipo XX (Resistencia): Mayor eficiencia metabólica mitocondrial oxidativa y recuperación muscular favorable en deportes de fondo.',
      'Genotipo RX (Mixto): Capacidad atlética versátil y adaptable a múltiples disciplinas deportivas.'
    ],
    baselineProbability: 40,
    minProbability: 10,
    maxProbability: 95,
    unit: '% de predisposición a fuerza explosiva y potencia',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs1815739',
        gene: 'ACTN3 (R577X)',
        chromosome: '11',
        name: 'ACTN3 R577X (p.Arg577Ter)',
        evidence: 'high',
        summary: 'El marcador genético deportivo más investigado en atletas olímpicos.',
        scientificContext: 'El alelo C (Arg577) produce alfa-actinina-3 funcional; el alelo T (Ter577) produce deficiencia completa no patológica.',
        genotypes: {
          'CC': {
            genotype: 'CC',
            impact: 'trait_present',
            scoreContribution: 0.9,
            label: 'Genotipo RR: Máxima Potencia y Fuerza Explosiva',
            description: 'Expresión completa de alfa-actinina-3 en miofibrillas rápidas. Óptimo para sprints, halterofilia, saltos y deportes de impacto.',
            effectMagnitude: 'Perfil velocista / potencia'
          },
          'CT': {
            genotype: 'CT',
            impact: 'average',
            scoreContribution: 0.2,
            label: 'Genotipo RX: Perfil Muscular Mixto / Versátil',
            description: 'Capacidad equilibrada de fuerza y tolerancia aeróbica. Muy adaptable a deportes de equipo y media distancia.',
            effectMagnitude: 'Perfil mixto versátil'
          },
          'TT': {
            genotype: 'TT',
            impact: 'trait_absent',
            scoreContribution: -0.9,
            label: 'Genotipo XX: Eficiencia Aeróbica y Resistencia',
            description: 'Ausencia natural de alfa-actinina-3 compensada por metabolismo oxidativo. Mayor resiliencia en maratón, ciclismo y deportes de fondo.',
            effectMagnitude: 'Perfil fondo / resistencia'
          }
        },
        pubMedIds: ['12879008', '18043716'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1815739'
      }
    ]
  },
  {
    id: 'vitamin_d_metabolism',
    title: 'Metabolismo y Niveles Séricos de Vitamina D (GC / VDR)',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Eficiencia en la síntesis, transporte por la proteína fijadora DBP y activación del receptor de vitamina D.',
    biologicalMechanism: 'Variantes en la globulina transportadora GC (rs2282679) reducen la biodisponibilidad plasmática de 25-hidroxivitamina D.',
    lifestyleInsights: [
      'En presencia de variantes de transporte lento, se requiere mayor tiempo de exposición solar o suplementación oral guiada.',
      'Consumir pescados grasos, yema de huevo y hongos expuestos al sol.',
      'Controlar niveles de 25(OH)D3 en análisis periódicos en otoño e invierno.'
    ],
    baselineProbability: 35,
    minProbability: 5,
    maxProbability: 80,
    unit: '% de tendencia a niveles basales bajos de vitamina D',
    type: 'risk',
    snps: [
      {
        rsid: 'rs2282679',
        gene: 'GC (Proteína Fijadora de Vitamina D)',
        chromosome: '4',
        name: 'GC rs2282679',
        evidence: 'high',
        summary: 'Principal locus genético asociado con concentraciones circulantes de 25(OH)D.',
        scientificContext: 'El alelo C disminuye la afinidad y concentración sérica de la globulina fijadora.',
        genotypes: {
          'CC': {
            genotype: 'CC',
            impact: 'elevated',
            scoreContribution: 0.8,
            label: 'Tendencia a Vitamina D Baja (Homocigoto CC)',
            description: 'Menor biodisponibilidad basal; mayor necesidad de suplementación en meses de baja radiación solar.',
            effectMagnitude: '1.8x propensión a déficit'
          },
          'AC': {
            genotype: 'AC',
            impact: 'moderate',
            scoreContribution: 0.35,
            label: 'Tendencia Moderada (Heterocigoto AC)',
            description: 'Niveles basales ligeramente reducidos.',
            effectMagnitude: '1.3x propensión'
          },
          'AA': {
            genotype: 'AA',
            impact: 'protective',
            scoreContribution: -0.4,
            label: 'Niveles Basales Óptimos (Homocigoto AA)',
            description: 'Transporte y disponibilidad adecuada de vitamina D en suero.',
            effectMagnitude: 'Niveles basales normales'
          }
        },
        pubMedIds: ['20585308', '20541618'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2282679'
      },
      {
        rsid: 'rs12794714',
        gene: 'DHCR7 / NADSYN1',
        chromosome: '11',
        name: 'DHCR7 rs12794714',
        evidence: 'high',
        summary: 'Regula la conversión cutánea de 7-deshidrocolesterol a previtamina D3.',
        scientificContext: 'El alelo A está asociado a menor síntesis endógena cutánea tras exposición a rayos UV.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.7, label: 'Menor Síntesis Cutánea (AA)', description: 'Síntesis fotoquímica cutánea de vitamina D3 menos eficiente.', effectMagnitude: '1.5x propensión' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.3, label: 'Síntesis Cutánea Intermedia (AG)', description: 'Tasa media de síntesis fotolumínica.', effectMagnitude: '1.2x propensión' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.3, label: 'Óptima Síntesis Cutánea (GG)', description: 'Buena tasa de conversión de colecalciferol.', effectMagnitude: 'Normal' }
        },
        pubMedIds: ['20585308', '20541618'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs12794714'
      }
    ]
  },
  {
    id: 'bitter_taste_perception',
    title: 'Percepción del Sabor Amargo (Receptor TAS2R38)',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Sensibilidad gustativa a compuestos amargos como glucosinolatos y tioureas presentes en verduras crucíferas (brócoli, coliflor, coles de Bruselas).',
    biologicalMechanism: 'Los polimorfismos en el receptor de sabor acoplado a proteína G TAS2R38 configuran los haplotipos PAV (perceptor agudo / supergustador) o AVI (no perceptor).',
    lifestyleInsights: [
      'Los "supergustadores" (PAV/PAV) pueden rechazar verduras saludables por amargor excesivo; cocinarlas al vapor con aceite de oliva virgen extra y una pizca de sal marina suaviza el sabor amargo.',
      'Suelen tener menor preferencia por café solo sin azúcar, cerveza amarga o pomelo.'
    ],
    baselineProbability: 50,
    minProbability: 5,
    maxProbability: 95,
    unit: '% de sensibilidad a compuestos amargos',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs713598',
        gene: 'TAS2R38 (Ala49Pro)',
        chromosome: '7',
        name: 'TAS2R38 Ala49Pro',
        evidence: 'high',
        summary: 'Determinante canónico de la capacidad de percibir sabores amargos (feniltiocarbamida / PROP).',
        scientificContext: 'El alelo G codifica prolina en el bucle transmembrana del receptor gustativo.',
        genotypes: {
          'GG': {
            genotype: 'GG',
            impact: 'trait_present',
            scoreContribution: 0.9,
            label: 'Supergustador de Amargor (Haplotipo PAV)',
            description: 'Sensibilidad gustativa muy aguda a vegetales amargos, café negro y flavonoides cítricos.',
            effectMagnitude: 'Alta percepción gustativa'
          },
          'CG': {
            genotype: 'CG',
            impact: 'average',
            scoreContribution: 0.1,
            label: 'Perceptor Moderado de Amargor (Haplotipo PAV/AVI)',
            description: 'Percepción equilibrada de sabores amargos con buena tolerancia culinaria.',
            effectMagnitude: 'Percepción moderada'
          },
          'CC': {
            genotype: 'CC',
            impact: 'trait_absent',
            scoreContribution: -0.9,
            label: 'No Perceptor de Amargor (Haplotipo AVI)',
            description: 'Baja o nula sensibilidad al amargor de glucosinolatos; alta tolerancia al brócoli, café solo y tónicas.',
            effectMagnitude: 'Baja percepción gustativa'
          }
        },
        pubMedIds: ['12595690', '15684539'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs713598'
      },
      {
        rsid: 'rs1726866',
        gene: 'TAS2R38 (Val262Ala)',
        chromosome: '7',
        name: 'TAS2R38 Val262Ala',
        evidence: 'high',
        summary: 'Segundo sitio polimórfico del haplotipo PAV/AVI para percepción de amargor.',
        scientificContext: 'El alelo C (alanina) se correlaciona con el fenotipo AVI no gustador.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'trait_present', scoreContribution: 0.85, label: 'Alta Sensibilidad al Amargor (Val/Val)', description: 'Percepción nítida de compuestos amargos.', effectMagnitude: 'Alta' },
          'CT': { genotype: 'CT', impact: 'average', scoreContribution: 0.2, label: 'Sensibilidad Media (Val/Ala)', description: 'Sensibilidad intermedia.', effectMagnitude: 'Media' },
          'CC': { genotype: 'CC', impact: 'trait_absent', scoreContribution: -0.85, label: 'Baja Sensibilidad (Ala/Ala)', description: 'Incapaz de percibir amargor moderado.', effectMagnitude: 'Baja' }
        },
        pubMedIds: ['12595690', '15684539'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1726866'
      }
    ]
  },
  {
    id: 'foxo3a_longevity',
    title: 'Gen de Longevidad FOXO3A y Resiliencia al Estrés Celular',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Capacidad de activación de programas de autofagia, reparación del ADN y resistencia al estrés oxidativo mediada por el factor de transcripción Forkhead Box O3.',
    biologicalMechanism: 'La variante rs2802292 en FOXO3A promueve una mayor afinidad y respuesta del factor de transcripción ante la restricción calórica y el ejercicio, regulando la supervivencia celular.',
    lifestyleInsights: [
      'El ayuno intermitente y el ejercicio en zona 2 potencian de forma sinérgica la translocación nuclear de FOXO3A.',
      'Dieta rica en polifenoles (resveratrol, quercetina) y consumo de té verde.'
    ],
    baselineProbability: 30,
    minProbability: 10,
    maxProbability: 85,
    unit: '% de puntuación de longevidad celular',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs2802292',
        gene: 'FOXO3A (Intrón 2)',
        chromosome: '6',
        name: 'FOXO3A rs2802292 (Variante de Centenarios)',
        evidence: 'high',
        summary: 'El gen más reproduciblemente asociado con longevidad humana excepcional y supervivencia saludable.',
        scientificContext: 'El alelo G se encuentra significativamente enriquecido en centenarios de múltiples poblaciones mundiales.',
        genotypes: {
          'GG': {
            genotype: 'GG',
            impact: 'protective',
            scoreContribution: 0.9,
            label: 'Alelo de Longevidad Homocigoto (GG)',
            description: 'Doble copia de la variante protectora; óptima activación de rutas de autofagia y mantenimiento celular.',
            effectMagnitude: '2.7x mayor probabilidad de longevidad saludable'
          },
          'TG': {
            genotype: 'TG',
            impact: 'protective',
            scoreContribution: 0.45,
            label: 'Portador Heterocigoto de Longevidad (TG)',
            description: 'Una copia del alelo FOXO3A protector.',
            effectMagnitude: '1.5x mayor probabilidad de longevidad'
          },
          'GT': {
            genotype: 'GT',
            impact: 'protective',
            scoreContribution: 0.45,
            label: 'Portador Heterocigoto de Longevidad (GT)',
            description: 'Una copia del alelo FOXO3A protector.',
            effectMagnitude: '1.5x mayor probabilidad de longevidad'
          },
          'TT': {
            genotype: 'TT',
            impact: 'average',
            scoreContribution: 0.0,
            label: 'Genotipo Estándar (TT)',
            description: 'Línea de base poblacional para envejecimiento biológico.',
            effectMagnitude: 'Basal'
          }
        },
        pubMedIds: ['18765803', '19196970'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2802292'
      }
    ]
  },
  {
    id: 'pcsk9_cardiovascular_protection',
    title: 'Protección Cardiovascular Natural (PCSK9 R46L)',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Aclaramiento hepático ultraeficiente de partículas de colesterol LDL y menor riesgo de aterosclerosis coronaria.',
    biologicalMechanism: 'La variante de pérdida de función R46L en PCSK9 evita la degradación lisosomal del receptor de LDL (LDLR), aumentando su reciclaje en la membrana de los hepatocitos.',
    lifestyleInsights: [
      'Los portadores de la variante R46L disfrutan de una reducción congénita natural del 15-30% en colesterol LDL a lo largo de toda su vida.',
      'Mantener hábitos cardiosaludables potencia al máximo esta ventaja biológica innata.'
    ],
    baselineProbability: 15,
    minProbability: 2,
    maxProbability: 80,
    unit: '% de eficiencia en aclaramiento de LDL',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs11591147',
        gene: 'PCSK9 (R46L)',
        chromosome: '1',
        name: 'PCSK9 R46L (p.Arg46Leu)',
        evidence: 'high',
        summary: 'Variante protectora que reduce significativamente los niveles plasmáticos de colesterol LDL.',
        scientificContext: 'La sustitución de guanina por timina (Arg46Leu) confiere una reducción sustancial del riesgo coronario acumulativo.',
        genotypes: {
          'TT': {
            genotype: 'TT',
            impact: 'protective',
            scoreContribution: 0.95,
            label: 'Protección Cardiovascular Máxima (Leu/Leu)',
            description: 'Aclaramiento hepático de LDL extraordinariamente rápido.',
            effectMagnitude: '~50% reducción de riesgo cardiovascular'
          },
          'GT': {
            genotype: 'GT',
            impact: 'protective',
            scoreContribution: 0.6,
            label: 'Portador de Variante Protectora PCSK9 R46L (Arg/Leu)',
            description: 'Niveles basales de LDL entre un 15% y un 25% más bajos que el promedio poblacional.',
            effectMagnitude: '~30% reducción de riesgo coronario'
          },
          'TG': {
            genotype: 'TG',
            impact: 'protective',
            scoreContribution: 0.6,
            label: 'Portador de Variante Protectora PCSK9 R46L (Arg/Leu)',
            description: 'Niveles basales de LDL significativamente más bajos.',
            effectMagnitude: '~30% reducción de riesgo coronario'
          },
          'GG': {
            genotype: 'GG',
            impact: 'average',
            scoreContribution: 0.0,
            label: 'Genotipo Basal (Arg/Arg)',
            description: 'Regulación fisiológica estándar de receptores de LDL.',
            effectMagnitude: 'Niveles poblacionales base'
          }
        },
        pubMedIds: ['16554528', '17079633'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs11591147'
      }
    ]
  },
  {
    id: 'omega3_conversion_fads1',
    title: 'Conversión Endógena de Ácidos Grasos Omega-3 y Omega-6 (FADS1 / FADS2)',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Eficiencia enzimática en la desaturación de ácidos grasos vegetales (ALA y LA) en formas bioactivas de cadena larga (EPA, DHA y ARA).',
    biologicalMechanism: 'El polimorfismo rs174546 en la desaturasa de ácidos grasos 1 (FADS1) regula la velocidad de elongación lipídica y los niveles tisulares de ácido araquidónico y EPA.',
    lifestyleInsights: [
      'Individuos con alelo C (baja conversión) sintetizan cantidades mínimas de EPA y DHA a partir de fuentes vegetales (lino, chía, nueces) y se benefician enormemente del consumo directo de pescado azul o microalgas.',
      'Individuos con genotipo TT (alta conversión) tienen mayor facilidad para formar EPA/ARA, pero deben cuidar el equilibrio de aceites vegetales ricos en Omega-6 proinflamatorios.'
    ],
    baselineProbability: 38,
    minProbability: 5,
    maxProbability: 90,
    unit: '% de eficiencia de conversión de ácidos grasos',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs174546',
        gene: 'FADS1 (Intrón 1)',
        chromosome: '11',
        name: 'Desaturasa FADS1 rs174546',
        evidence: 'high',
        summary: 'Controla la tasa de biosíntesis endógena de EPA y DHA a partir de precursores vegetales.',
        scientificContext: 'El alelo T incrementa fuertemente la expresión de FADS1 y la actividad delta-5 desaturasa.',
        genotypes: {
          'TT': {
            genotype: 'TT',
            impact: 'protective',
            scoreContribution: 0.85,
            label: 'Conversión Alta / Eficiente (TT)',
            description: 'Alta síntesis endógena de ácidos grasos poliinsaturados de cadena larga.',
            effectMagnitude: 'Alta conversión metabólica'
          },
          'CT': {
            genotype: 'CT',
            impact: 'average',
            scoreContribution: 0.35,
            label: 'Conversión Intermedia (CT)',
            description: 'Tasa media de desaturación; se recomienda consumo regular de Omega-3 preformado.',
            effectMagnitude: 'Conversión moderada'
          },
          'TC': {
            genotype: 'TC',
            impact: 'average',
            scoreContribution: 0.35,
            label: 'Conversión Intermedia (TC)',
            description: 'Tasa media de desaturación.',
            effectMagnitude: 'Conversión moderada'
          },
          'CC': {
            genotype: 'CC',
            impact: 'elevated',
            scoreContribution: -0.7,
            label: 'Conversión Baja / Reducida (CC)',
            description: 'Muy baja capacidad de transformar ALA vegetal en EPA y DHA bioactivo. Requiere suplementación o pescado graso.',
            effectMagnitude: 'Baja conversión endógena'
          }
        },
        pubMedIds: ['19727702', '20880340'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs174546'
      }
    ]
  },
  {
    id: 'vitamin_b12_absorption_fut2',
    title: 'Absorción y Niveles Séricos de Vitamina B12 (FUT2)',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Estado secretor gastrointestinal y biodisponibilidad de cobalamina (vitamina B12) a nivel de la mucosa intestinal.',
    biologicalMechanism: 'La mutación sin sentido W143X (rs602662) en la fucosiltransferasa 2 (FUT2) define el estado secretor/no secretor de antígenos del grupo ABH, modulando la microbiota colónica y la absorción de B12.',
    lifestyleInsights: [
      'Individuos no secretores (AA) tienden a presentar niveles plasmáticos basales de vitamina B12 significativamente más bajos de forma innata.',
      'Controlar periódicamente vitamina B12 sérica, ácido metilmalónico y homocisteína.',
      'Especialmente crítico en dietas vegetarianas o basadas en plantas.'
    ],
    baselineProbability: 25,
    minProbability: 5,
    maxProbability: 85,
    unit: '% de probabilidad de niveles subóptimos de B12',
    type: 'risk',
    snps: [
      {
        rsid: 'rs602662',
        gene: 'FUT2 (W143X / c.428G>A)',
        chromosome: '19',
        name: 'Fucosiltransferasa FUT2 rs602662',
        evidence: 'high',
        summary: 'Determinante genético primario de los niveles plasmáticos de vitamina B12 en poblaciones caucásicas.',
        scientificContext: 'El alelo A (stop codon 143) genera una enzima truncada no funcional (fenotipo no secretor).',
        genotypes: {
          'AA': {
            genotype: 'AA',
            impact: 'elevated',
            scoreContribution: 0.8,
            label: 'No Secretor (AA / Niveles de B12 más Bajos)',
            description: 'Mayor probabilidad de niveles séricos bajos de cobalamina; absorción entérica menos eficiente.',
            effectMagnitude: '~100-150 pg/mL menos de B12 en sangre'
          },
          'AG': {
            genotype: 'AG',
            impact: 'average',
            scoreContribution: 0.2,
            label: 'Secretor Heterocigoto (AG)',
            description: 'Absorción adecuada de vitamina B12 con niveles plasmáticos estables.',
            effectMagnitude: 'Niveles normales'
          },
          'GA': {
            genotype: 'GA',
            impact: 'average',
            scoreContribution: 0.2,
            label: 'Secretor Heterocigoto (GA)',
            description: 'Absorción adecuada de vitamina B12.',
            effectMagnitude: 'Niveles normales'
          },
          'GG': {
            genotype: 'GG',
            impact: 'protective',
            scoreContribution: -0.4,
            label: 'Secretor Homocigoto (GG / Óptima Absorción)',
            description: 'Alta expresión de antígenos secretores y óptima homeostasis de B12.',
            effectMagnitude: 'Niveles altos basales'
          }
        },
        pubMedIds: ['18776911', '19478796'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs602662'
      }
    ]
  },
  {
    id: 'tendon_ligament_injury_col5a1',
    title: 'Resistencia Tendinosa y Riesgo de Lesiones de Tejido Conectivo (COL5A1)',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Propiedades biomecánicas del colágeno tipo V, elasticidad tendinosa y susceptibilidad a tendinopatía aquilea o rotura de ligamento cruzado.',
    biologicalMechanism: 'La variante 3\' UTR rs12722 (BstUI RFLP) en COL5A1 regula la estabilidad del ARNm del colágeno fibrilar alfa-1 tipo V en los tendones.',
    lifestyleInsights: [
      'Individuos con genotipo CC poseen tendones más rígidos (ventaja en economía de carrera, pero mayor riesgo de microdesgarros o tendinitis crónica).',
      'Incorporar trabajo excéntrico de gemelos y soleo, calentamiento articular específico y periodización del volumen de saltos.',
      'Aporte adecuado de vitamina C y aminoácidos glicina/prolina (gelatina, caldo de huesos o colágeno hidrolizado antes de entrenar).'
    ],
    baselineProbability: 20,
    minProbability: 4,
    maxProbability: 60,
    type: 'risk',
    snps: [
      {
        rsid: 'rs12722',
        gene: 'COL5A1 (3\' UTR BstUI)',
        chromosome: '9',
        name: 'Colágeno Tipo V COL5A1 rs12722',
        evidence: 'high',
        summary: 'Marcador principal de vulnerabilidad a tendinopatías y flexibilidad articular.',
        scientificContext: 'El alelo C disminuye la compliance tendinosa y aumenta la rigidez fibrilar.',
        genotypes: {
          'CC': {
            genotype: 'CC',
            impact: 'elevated',
            scoreContribution: 0.8,
            label: 'Mayor Rigidez Tendinosa / Riesgo de Tendinitis (CC)',
            description: 'Tendones con menor viscoelasticidad; mayor reactividad a sobrecargas y tendinopatía de Aquiles.',
            effectMagnitude: '2.2x riesgo de tendinopatía'
          },
          'CT': {
            genotype: 'CT',
            impact: 'moderate',
            scoreContribution: 0.35,
            label: 'Viscoelasticidad Tendinosa Media (CT)',
            description: 'Equilibrio entre reactividad elástica y flexibilidad.',
            effectMagnitude: '1.3x riesgo'
          },
          'TC': {
            genotype: 'TC',
            impact: 'moderate',
            scoreContribution: 0.35,
            label: 'Viscoelasticidad Tendinosa Media (TC)',
            description: 'Equilibrio elástico.',
            effectMagnitude: '1.3x riesgo'
          },
          'TT': {
            genotype: 'TT',
            impact: 'protective',
            scoreContribution: -0.4,
            label: 'Mayor Flexibilidad y Protección Tendinosa (TT)',
            description: 'Fibrillas de colágeno con mayor amortiguación y menor tasa de lesiones por sobrecarga.',
            effectMagnitude: 'Riesgo bajo basal'
          }
        },
        pubMedIds: ['16552882', '19622524'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs12722'
      }
    ]
  },
  {
    id: 'alcohol_metabolism_adh1b',
    title: 'Metabolismo del Alcohol y Tasa de Conversión a Acetaldehído (ADH1B)',
    category: 'wellness',
    categoryLabel: 'Wellness',
    description: 'Velocidad de degradación oxidativa del etanol a acetaldehído por la enzima alcohol deshidrogenasa 1B.',
    biologicalMechanism: 'La sustitución Arg48His (rs1229984) en ADH1B multiplica por hasta 40 veces la tasa catalítica de oxidación del etanol, generando picos rápidos de acetaldehído que provocan enrojecimiento facial y aversión fisiológica al alcohol.',
    lifestyleInsights: [
      'Individuos con alelo A (His48) experimentan rubor facial, taquicardia y náuseas tempranas con pequeñas cantidades de alcohol, lo que actúa como un factor protector potente frente al consumo excesivo.',
      'En metabolizadores estándar (GG), el alcohol se procesa a velocidad normal, lo que requiere mayor moderación consciente.'
    ],
    baselineProbability: 18,
    minProbability: 2,
    maxProbability: 90,
    unit: '% de rapidez de metabolización inicial del alcohol',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs1229984',
        gene: 'ADH1B (Arg48His / c.143G>A)',
        chromosome: '4',
        name: 'Alcohol Deshidrogenasa ADH1B rs1229984',
        evidence: 'high',
        summary: 'Regula la tasa de conversión hepática inicial del alcohol en acetaldehído.',
        scientificContext: 'El alelo A confiere una hiperactividad catalítica muy rápida a la enzima ADH1B.',
        genotypes: {
          'AA': {
            genotype: 'AA',
            impact: 'protective',
            scoreContribution: 0.9,
            label: 'Oxidación Ultrarrápida / Rubor Facial Inmediato (AA)',
            description: 'Conversión inmediata de alcohol a acetaldehído con baja tolerancia y fuerte protección natural contra el consumo problemático.',
            effectMagnitude: 'Hiperactividad catalítica'
          },
          'AG': {
            genotype: 'AG',
            impact: 'moderate',
            scoreContribution: 0.45,
            label: 'Metabolizador Rápido de Etanol (AG)',
            description: 'Mayor sensibilidad al alcohol y síntomas de resaca o rubor más precoces.',
            effectMagnitude: 'Conversión rápida'
          },
          'GA': {
            genotype: 'GA',
            impact: 'moderate',
            scoreContribution: 0.45,
            label: 'Metabolizador Rápido de Etanol (GA)',
            description: 'Mayor sensibilidad al alcohol.',
            effectMagnitude: 'Conversión rápida'
          },
          'GG': {
            genotype: 'GG',
            impact: 'average',
            scoreContribution: 0.0,
            label: 'Metabolismo Estándar de Etanol (GG)',
            description: 'Velocidad habitual de aclaramiento de alcohol.',
            effectMagnitude: 'Basal habitual'
          }
        },
        pubMedIds: ['17088406', '19889852'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1229984'
      },
      {
        rsid: 'rs671',
        gene: 'ALDH2 (Glu504Lys)',
        chromosome: '12',
        name: 'Aldehído Deshidrogenasa ALDH2*2',
        evidence: 'high',
        summary: 'Inactivación del aclaramiento de acetaldehído que causa el síndrome de rubor asiático por alcohol.',
        scientificContext: 'El alelo A (Lys504) produce una subunidad ALDH2 inactiva dominante.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'elevated', scoreContribution: 0.95, label: 'Déficit Total de ALDH2 (AA)', description: 'Incapacidad de metabolizar acetaldehído; rubor extremo y náuseas inmediatas con alcohol.', effectMagnitude: 'Aversión y toxicidad' },
          'AG': { genotype: 'AG', impact: 'moderate', scoreContribution: 0.6, label: 'Déficit Parcial de ALDH2 (AG)', description: 'Rubor facial y taquicardia con pequeñas cantidades de alcohol.', effectMagnitude: 'Rubor moderado' },
          'GG': { genotype: 'GG', impact: 'protective', scoreContribution: -0.2, label: 'Actividad ALDH2 Normal (GG)', description: 'Eliminación enzimática rápida del acetaldehído.', effectMagnitude: 'Normal' }
        },
        pubMedIds: ['17088406', '19889852'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs671'
      }
    ]
  }
];
