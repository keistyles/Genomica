import { TraitDefinition } from '../types/genetics';

export const PERSONAL_TRAITS_DATA: TraitDefinition[] = [
  {
    id: 'eye_color_clarity',
    title: 'Color y Claridad de los Ojos (Azul / Verde / Marrón)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Predicción de la pigmentación del iris humano regulada por el elemento potenciador de OCA2 en el intrón 86 de HERC2.',
    biologicalMechanism: 'El polimorfismo rs12913832 en HERC2 actúa como un interruptor transcripcional maestro que controla la expresión del gen OCA2 en melanocitos del estroma del iris.',
    lifestyleInsights: [
      'Los ojos claros (GG) contienen menor concentración de eumelanina estromal y son más sensibles al deslumbramiento y radiación UV solar.',
      'Se recomienda el uso de gafas de sol con protección UV400 en exteriores luminosos.'
    ],
    baselineProbability: 35,
    minProbability: 2,
    maxProbability: 98,
    unit: '% de probabilidad de ojos claros',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs12913832',
        gene: 'HERC2 / OCA2',
        chromosome: '15',
        name: 'Interruptor del Color de Ojos (rs12913832)',
        evidence: 'high',
        summary: 'Explica más del 85% de la variación entre ojos azules/verdes y marrones en poblaciones europeas.',
        scientificContext: 'El alelo G disminuye drásticamente la transcripción de OCA2, resultando en ausencia de melanina en el iris (ojos azules). El alelo A mantiene la producción de pigmento marrón.',
        genotypes: {
          'GG': {
            genotype: 'GG',
            impact: 'trait_present',
            scoreContribution: 0.95,
            label: 'Ojos Claros (Azules o Verdes)',
            description: 'Homocigoto para la variante que inactiva la pigmentación marrón del iris. >90% de probabilidad de tener ojos azules, grises o verdes claros.',
            effectMagnitude: 'Fenotipo de ojos claros recesivo',
            populationFrequency: '~65% en Europa del Norte, ~25% en España'
          },
          'AG': {
            genotype: 'AG',
            impact: 'average',
            scoreContribution: 0.1,
            label: 'Ojos Mixtos / Avellana / Verdes Oscuros',
            description: 'Heterocigoto con expresión intermedia de pigmento. Alta probabilidad de ojos verdes, avellana o marrones claros.',
            effectMagnitude: 'Fenotipo intermedio',
            populationFrequency: '~40%'
          },
          'AA': {
            genotype: 'AA',
            impact: 'trait_absent',
            scoreContribution: -0.9,
            label: 'Ojos Oscuros (Marrones o Negros)',
            description: 'Homocigoto para la síntesis activa de eumelanina estromal. >95% de probabilidad de tener ojos marrones u oscuros.',
            effectMagnitude: 'Fenotipo de ojos marrones dominante',
            populationFrequency: '~75% a nivel global'
          }
        },
        pubMedIds: ['18172690', '18252222'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs12913832'
      },
      {
        rsid: 'rs1800407',
        gene: 'OCA2 (Arg419Gln)',
        chromosome: '15',
        name: 'OCA2 Arg419Gln (rs1800407)',
        evidence: 'high',
        summary: 'Regula matices verdes y claros en el color del iris.',
        scientificContext: 'El alelo T (Gln419) disminuye la actividad transportadora en melanosomas.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'trait_present', scoreContribution: 0.8, label: 'Modulador de Ojos Verdes/Claros (TT)', description: 'Favorece tonalidades verdes y avellana claras.', effectMagnitude: 'Tono claro' },
          'CT': { genotype: 'CT', impact: 'average', scoreContribution: 0.3, label: 'Portador de Ojos Claros (CT)', description: 'Tono intermedio.', effectMagnitude: 'Tono intermedio' },
          'CC': { genotype: 'CC', impact: 'trait_absent', scoreContribution: -0.5, label: 'Pigmentación Basal OCA2 (CC)', description: 'Mayor intensidad de pigmento.', effectMagnitude: 'Oscuro' }
        },
        pubMedIds: ['18172690', '18252222'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1800407'
      }
    ]
  },
  {
    id: 'red_hair_freckles',
    title: 'Probabilidad de ser Pelirrojo y Pecas (MC1R)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Predisposición al cabello pelirrojo, tono de piel muy claro (fototipo I) y aparición de pecas (efélides) mediada por el receptor de melanocortina 1.',
    biologicalMechanism: 'Variantes de pérdida de función en MC1R impiden la conversión de feomelanina (pigmento rojo/amarillento) en eumelanina (pigmento marrón/negro fotoprotector).',
    lifestyleInsights: [
      'Los portadores de dos variantes de MC1R sintetizan predominantemente feomelanina, que genera radicales libres al exponerse al sol.',
      'Uso diario imprescindible de protector solar SPF 50+ de amplio espectro.'
    ],
    baselineProbability: 4,
    minProbability: 1,
    maxProbability: 95,
    unit: '% de probabilidad de fenotipo pelirrojo',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs1805007',
        gene: 'MC1R (Arg151Cys)',
        chromosome: '16',
        name: 'MC1R Arg151Cys (Variante R mayor)',
        evidence: 'high',
        summary: 'La variante con mayor penetrancia para pelo pelirrojo y fototipo sensible.',
        scientificContext: 'La sustitución Cys151 altera el acoplamiento a la proteína Gs adenilil ciclasa.',
        genotypes: {
          'TT': {
            genotype: 'TT',
            impact: 'trait_present',
            scoreContribution: 0.95,
            label: 'Pelirrojo / Piel muy clara (Homocigoto Cys151)',
            description: 'Alta probabilidad de cabello pelirrojo natural, pecas abundantes y quemadura solar fácil.',
            effectMagnitude: 'Penetrancia muy alta'
          },
          'CT': {
            genotype: 'CT',
            impact: 'moderate',
            scoreContribution: 0.45,
            label: 'Portador de Variante Pelirroja (Heterocigoto)',
            description: 'Pelo castaño o rubio con reflejos cobrizos, presencia moderada de pecas y tendencia al enrojecimiento cutáneo.',
            effectMagnitude: 'Portador recesivo'
          },
          'CC': {
            genotype: 'CC',
            impact: 'trait_absent',
            scoreContribution: -0.5,
            label: 'Genotipo No Pelirrojo Estándar',
            description: 'Actividad normal del receptor MC1R y producción equilibrada de eumelanina.',
            effectMagnitude: 'Basal'
          }
        },
        pubMedIds: ['10873394', '18488028'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1805007'
      },
      {
        rsid: 'rs1805008',
        gene: 'MC1R (Arg160Trp)',
        chromosome: '16',
        name: 'MC1R Arg160Trp (Variante R)',
        evidence: 'high',
        summary: 'Segunda variante principal de pelo pelirrojo y susceptibilidad a pecas.',
        scientificContext: 'La mutación Trp160 anula la señalización intracelular mediada por AMPc.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'trait_present', scoreContribution: 0.9, label: 'Variante Pelirroja Homocigota (Trp/Trp)', description: 'Cabello pelirrojo, piel clara y pecas.', effectMagnitude: 'Penetrancia alta' },
          'CT': { genotype: 'CT', impact: 'moderate', scoreContribution: 0.4, label: 'Portador Heterocigoto Trp160', description: 'Portador de un alelo de pelo rojo.', effectMagnitude: 'Portador' },
          'CC': { genotype: 'CC', impact: 'trait_absent', scoreContribution: -0.4, label: 'Sin Variante Trp160 (CC)', description: 'Función basal.', effectMagnitude: 'Basal' }
        },
        pubMedIds: ['10873394', '18488028'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1805008'
      }
    ]
  },
  {
    id: 'hair_curl_texture',
    title: 'Forma y Textura del Pelo (Liso vs Rizado / Ondulado)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Determinación genética de la curvatura y grosor del tallo capilar a partir de la tricohialina y el receptor EDAR.',
    biologicalMechanism: 'Variantes en el gen de la tricohialina (TCHH) en el cromosoma 1 modulan la reticulación de filamentos intermedios de queratina en la vaina radicular interna del folículo piloso.',
    lifestyleInsights: [
      'El cabello rizado u ondulado tiene mayor tendencia a la sequedad debido a que los lípidos del sebo tardan más en distribuirse por la fibra.',
      'Se benefician de acondicionadores nutritivos ricos en aceites emolientes y técnicas "curly".'
    ],
    baselineProbability: 40,
    minProbability: 5,
    maxProbability: 92,
    unit: '% de tendencia a cabello rizado/ondulado',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs11803731',
        gene: 'TCHH (Tricohialina)',
        chromosome: '1',
        name: 'TCHH Leu790Pro',
        evidence: 'high',
        summary: 'Principal determinante genético de pelo rizado vs liso en poblaciones de ascendencia europea.',
        scientificContext: 'El alelo T modifica la conformación helicoidal de la proteína de la vaina folicular.',
        genotypes: {
          'TT': {
            genotype: 'TT',
            impact: 'trait_present',
            scoreContribution: 0.85,
            label: 'Pelo Rizado u Ondulado Marcado',
            description: 'Estructura folicular asimétrica que produce curvatura natural y volumen en la fibra capilar.',
            effectMagnitude: 'Fenotipo rizado/ondulado'
          },
          'AT': {
            genotype: 'AT',
            impact: 'average',
            scoreContribution: 0.35,
            label: 'Pelo Ligeramente Ondulado / Flexible',
            description: 'Fenotipo intermedio con ondas suaves según la longitud del cabello.',
            effectMagnitude: 'Fenotipo mixto'
          },
          'AA': {
            genotype: 'AA',
            impact: 'trait_absent',
            scoreContribution: -0.6,
            label: 'Pelo Liso / Recto',
            description: 'Folículo piloso de sección cilíndrica recta y fibra lisa uniforme.',
            effectMagnitude: 'Fenotipo liso'
          }
        },
        pubMedIds: ['19812544', '20498708'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs11803731'
      }
    ]
  },
  {
    id: 'male_pattern_baldness',
    title: 'Calvicie y Alopecia Androgenética',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Sensibilidad folicular a la dihidrotestosterona (DHT) y miniaturización progresiva de los folículos capilares.',
    biologicalMechanism: 'El receptor de andrógenos (AR) en el cromosoma X y el locus 20p11 actúan sinérgicamente incrementando la sensibilidad androgénica del folículo piloso coronal.',
    lifestyleInsights: [
      'La detección temprana permite opciones preventivas eficaces como inhibidores de la 5-alfa reductasa o minoxidil tópico/oral.',
      'Control del estrés oxidativo y mantener niveles adecuados de ferritina y zinc.'
    ],
    baselineProbability: 40,
    minProbability: 10,
    maxProbability: 88,
    unit: '% de probabilidad de alopecia androgenética',
    type: 'risk',
    snps: [
      {
        rsid: 'rs6152',
        gene: 'AR (Receptor Androgénico)',
        chromosome: 'X',
        name: 'AR G1733A Locus Cromosoma X',
        evidence: 'high',
        summary: 'El factor genético ligado al cromosoma X más potente en alopecia masculina.',
        scientificContext: 'El alelo G se asocia con mayor afinidad de unión y respuesta a andrógenos circulantes.',
        genotypes: {
          'GG': {
            genotype: 'GG',
            impact: 'elevated',
            scoreContribution: 0.8,
            label: 'Alta Sensibilidad Androgénica Folicular (Alelo G)',
            description: 'Mayor tasa de miniaturización folicular coronal ante niveles fisiológicos de DHT.',
            effectMagnitude: '2.3x probabilidad de recesión capilar'
          },
          'GA': {
            genotype: 'GA',
            impact: 'moderate',
            scoreContribution: 0.35,
            label: 'Sensibilidad Moderada (Heterocigoto en mujeres)',
            description: 'Sensibilidad intermedia.',
            effectMagnitude: '1.3x probabilidad'
          },
          'AA': {
            genotype: 'AA',
            impact: 'protective',
            scoreContribution: -0.6,
            label: 'Baja Sensibilidad Androgénica (Alelo A Protector)',
            description: 'Folículos capilares altamente resistentes a la acción de la DHT.',
            effectMagnitude: 'Protección frente a alopecia precoz'
          }
        },
        pubMedIds: ['15902657', '18849991'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs6152'
      },
      {
        rsid: 'rs2180439',
        gene: '20p11 locus (PAX1)',
        chromosome: '20',
        name: 'Locus Autosómico 20p11',
        evidence: 'high',
        summary: 'Locus no ligado al cromosoma X transmitido por vía paterna o materna.',
        scientificContext: 'Interacciona epistáticamente con el receptor de andrógenos.',
        genotypes: {
          'TT': {
            genotype: 'TT',
            impact: 'elevated',
            scoreContribution: 0.7,
            label: 'Locus 20p11 Variante de Riesgo (TT)',
            description: 'Incrementa el riesgo de calvicie precoz en la línea de implantación frontal y coronilla.',
            effectMagnitude: '1.7x riesgo'
          },
          'CT': {
            genotype: 'CT',
            impact: 'moderate',
            scoreContribution: 0.3,
            label: 'Locus 20p11 Heterocigoto (CT)',
            description: 'Riesgo moderado.',
            effectMagnitude: '1.25x riesgo'
          },
          'CC': {
            genotype: 'CC',
            impact: 'average',
            scoreContribution: 0.0,
            label: 'Locus 20p11 Basal (CC)',
            description: 'Línea de base poblacional.',
            effectMagnitude: 'Estándar'
          }
        },
        pubMedIds: ['18849991', '18849992'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs2180439'
      }
    ]
  },
  {
    id: 'earwax_and_body_odor',
    title: 'Tipo de Cerumen y Olor Corporal Axilar (ABCC11)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Tipo de cerumen del conducto auditivo (húmedo/pegajoso vs seco/escamoso) y secreción apocrina de precursores de olor axilar.',
    biologicalMechanism: 'La bomba de transporte ABC en el gen ABCC11 (538G>A) secreta componentes lipídicos y aminoácidos conjugados en glándulas ceruminosas y apocrinas.',
    lifestyleInsights: [
      'Las personas con genotipo AA no producen sustratos para las bacterias axilares (Corynebacterium), por lo que carecen prácticamente de olor corporal.',
      'No requieren el uso diario de desodorantes antitranspirantes convencionales.'
    ],
    baselineProbability: 80,
    minProbability: 2,
    maxProbability: 99,
    unit: '% de probabilidad de cerumen húmedo y olor habitual',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs17822931',
        gene: 'ABCC11',
        chromosome: '16',
        name: 'ABCC11 538G>A (Gly180Arg)',
        evidence: 'high',
        summary: 'Determinante monogénico mendeliano perfecto del tipo de cerumen y secreción apocrina.',
        scientificContext: 'La mutación G538A causa pérdida completa de la función del transportador.',
        genotypes: {
          'AA': {
            genotype: 'AA',
            impact: 'trait_present',
            scoreContribution: -0.95,
            label: 'Cerumen Seco e Inodoro (Genotipo AA)',
            description: 'Cerumen grisáceo y seco; glándulas apocrinas no secretan precursores de mal olor corporal.',
            effectMagnitude: 'Fenotipo seco e inodoro'
          },
          'GA': {
            genotype: 'GA',
            impact: 'trait_absent',
            scoreContribution: 0.7,
            label: 'Cerumen Húmedo y Olor Corporal Normal (GA)',
            description: 'Portador dominante de cerumen húmedo; secreción apocrina activa habitual.',
            effectMagnitude: 'Fenotipo húmedo habitual'
          },
          'GG': {
            genotype: 'GG',
            impact: 'trait_absent',
            scoreContribution: 0.9,
            label: 'Cerumen Húmedo / Pegajoso Clásico (GG)',
            description: 'Cerumen marrón/dorado húmedo; producción estándar de sudor apocrino con olor.',
            effectMagnitude: 'Fenotipo húmedo clásico'
          }
        },
        pubMedIds: ['16444273', '19597561'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs17822931'
      }
    ]
  },
  {
    id: 'photic_sneeze_reflex',
    title: 'Reflejo del Estornudo Fótico (Síndrome ACHOO)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Tendencia a estornudar involuntariamente al pasar de la penumbra a una fuente de luz brillante o al mirar directamente al sol.',
    biologicalMechanism: 'Cruce de señales neurales entre el nervio óptico (II par) y las ramas maxilares del nervio trigémino (V par) a nivel mesencefálico.',
    lifestyleInsights: [
      'Es un rasgo benigno autosómico dominante presente en aproximadamente 1 de cada 4 personas.',
      'Llevar gafas oscuras al salir de túneles conduciendo para evitar estornudos en ráfaga.'
    ],
    baselineProbability: 25,
    minProbability: 5,
    maxProbability: 80,
    unit: '% de probabilidad del reflejo',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs10427255',
        gene: 'Locus 2q22.3 (ZEB2)',
        chromosome: '2',
        name: 'Marcador del Estornudo por Luz Solar',
        evidence: 'high',
        summary: 'Variante genética asociada al reflejo ACHOO (Autosomal Dominant Compelling Helio-Ophthalmic Outburst).',
        scientificContext: 'El alelo C condiciona hiperexcitabilidad trigeminal refleja ante la estimulación fótica.',
        genotypes: {
          'CC': {
            genotype: 'CC',
            impact: 'trait_present',
            scoreContribution: 0.85,
            label: 'Estornudo Fótico Presente (Homocigoto CC)',
            description: 'Alta propensión a desencadenar estornudos al mirar hacia el sol o luz intensa.',
            effectMagnitude: 'Reflejo muy manifiesto'
          },
          'CT': {
            genotype: 'CT',
            impact: 'trait_present',
            scoreContribution: 0.55,
            label: 'Reflejo Fótico Presente (Heterocigoto CT)',
            description: 'Presencia del rasgo autosómico dominante del estornudo por luz.',
            effectMagnitude: 'Reflejo presente'
          },
          'TT': {
            genotype: 'TT',
            impact: 'trait_absent',
            scoreContribution: -0.6,
            label: 'Sin Reflejo Fótico (TT)',
            description: 'No se produce estimulación del nervio trigémino con la luz brillante.',
            effectMagnitude: 'Sin reflejo fótico'
          }
        },
        pubMedIds: ['20585627', '21666692'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs10427255'
      }
    ]
  },
  {
    id: 'mthfr_methylation',
    title: 'Gen MTHFR (Metilación y Metabolismo del Folato)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Eficiencia enzimática de la metilentetrahidrofolato reductasa en la síntesis de 5-MTHF y reciclaje de homocisteína.',
    biologicalMechanism: 'La mutación termolábil C677T (Ala222Val) y A1298C reducen la actividad catalítica de MTHFR, disminuyendo la donación de grupos metilo para neurotransmisores y ADN.',
    lifestyleInsights: [
      'En portadores homocigotos (677TT), priorizar folato activo natural (L-metilfolato o 5-MTHF) y vitamina B12 en lugar de ácido fólico sintético no metilado.',
      'Consumir verduras de hoja verde oscura, legumbres y alimentos ricos en colina y betaína.',
      'Monitorizar niveles de homocisteína sérica.'
    ],
    baselineProbability: 12,
    minProbability: 2,
    maxProbability: 75,
    unit: '% de reducción en la actividad enzimática basal',
    type: 'metabolic_speed',
    snps: [
      {
        rsid: 'rs1801133',
        gene: 'MTHFR (C677T)',
        chromosome: '1',
        name: 'MTHFR C677T (Ala222Val)',
        evidence: 'high',
        summary: 'Principal variante termolábil que reduce la conversión de folato en su forma bioactiva.',
        scientificContext: 'La sustitución C>T disminuye la estabilidad térmica de la enzima.',
        genotypes: {
          'TT': {
            genotype: 'TT',
            impact: 'elevated',
            scoreContribution: 0.9,
            label: 'Reducción Enzimática Severa (Homocigoto 677TT)',
            description: 'Actividad de MTHFR reducida aproximadamente un 65-70%. Mayor tendencia a homocisteína elevada.',
            effectMagnitude: 'Actividad enzimática ~30-35%'
          },
          'CT': {
            genotype: 'CT',
            impact: 'moderate',
            scoreContribution: 0.45,
            label: 'Reducción Enzimática Moderada (Heterocigoto 677CT)',
            description: 'Actividad de MTHFR reducida aproximadamente un 30-35%.',
            effectMagnitude: 'Actividad enzimática ~65-70%'
          },
          'CC': {
            genotype: 'CC',
            impact: 'protective',
            scoreContribution: -0.4,
            label: 'Actividad Enzimática Óptima (Homocigoto 677CC)',
            description: 'Capacidad completa de conversión de folato y metilación celular óptima.',
            effectMagnitude: 'Actividad enzimática 100%'
          }
        },
        pubMedIds: ['7647779', '9618979'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1801133'
      },
      {
        rsid: 'rs1801131',
        gene: 'MTHFR (A1298C)',
        chromosome: '1',
        name: 'MTHFR A1298C (Glu429Ala)',
        evidence: 'high',
        summary: 'Segunda variante funcional en el dominio regulador C-terminal de MTHFR.',
        scientificContext: 'Afecta la inhibición alostérica por S-adenosilmetionina (SAMe).',
        genotypes: {
          'CC': {
            genotype: 'CC',
            impact: 'moderate',
            scoreContribution: 0.4,
            label: 'Homocigoto 1298CC (Actividad ~60%)',
            description: 'Reducción moderada de la función enzimática.',
            effectMagnitude: 'Disminución del 40%'
          },
          'AC': {
            genotype: 'AC',
            impact: 'average',
            scoreContribution: 0.2,
            label: 'Heterocigoto 1298AC',
            description: 'Leve disminución de la actividad.',
            effectMagnitude: 'Disminución del 15%'
          },
          'AA': {
            genotype: 'AA',
            impact: 'average',
            scoreContribution: 0.0,
            label: 'Genotipo Normal 1298AA',
            description: 'Sin mutación en este codón.',
            effectMagnitude: '100% actividad'
          }
        },
        pubMedIds: ['9618979', '11788828'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1801131'
      }
    ]
  },
  {
    id: 'comt_dopamine_metabolism',
    title: 'Gen COMT Val158Met (Metabolismo de Dopamina)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Velocidad de degradación enzimática de catecolaminas (dopamina, noradrenalina) en la corteza prefrontal: Perfil Guerrero vs Estratega.',
    biologicalMechanism: 'La catecol-O-metiltransferasa (COMT) con el alelo Met158 es termolábil y degrada la dopamina 4 veces más despacio, aumentando la dopamina cortical basal.',
    lifestyleInsights: [
      'Perfil Met/Met (Estratega): Alta concentración en tareas intelectuales complejas, pero mayor susceptibilidad al estrés agudo y cafeína.',
      'Perfil Val/Val (Guerrero): Mayor resiliencia bajo presión extrema o estrés competitivo, pero requiere mayor estímulo para concentrarse.'
    ],
    baselineProbability: 50,
    minProbability: 10,
    maxProbability: 90,
    unit: '% de actividad de degradación dopaminérgica',
    type: 'metabolic_speed',
    snps: [
      {
        rsid: 'rs4680',
        gene: 'COMT (Val158Met)',
        chromosome: '22',
        name: 'COMT Val158Met (rs4680)',
        evidence: 'high',
        summary: 'Regulador maestro de los niveles basales de dopamina y noradrenalina prefrontal.',
        scientificContext: 'La sustitución G>A (Val>Met) disminuye la estabilidad térmica de la enzima.',
        genotypes: {
          'AA': {
            genotype: 'AA',
            impact: 'trait_present',
            scoreContribution: 0.9,
            label: 'Met/Met: Perfil Estratega (Degradación Lenta)',
            description: 'Altos niveles basales de dopamina prefrontal; excelente memoria de trabajo y foco, pero menor tolerancia a la cafeína y al estrés sobrecargante.',
            effectMagnitude: 'Actividad enzimática reducida 75%'
          },
          'AG': {
            genotype: 'AG',
            impact: 'average',
            scoreContribution: 0.0,
            label: 'Val/Met: Perfil Equilibrado Intermedio',
            description: 'Equilibrio óptimo entre agilidad cognitiva y tolerancia al estrés bajo presión.',
            effectMagnitude: 'Actividad intermedia'
          },
          'GG': {
            genotype: 'GG',
            impact: 'trait_absent',
            scoreContribution: -0.9,
            label: 'Val/Val: Perfil Guerrero (Degradación Rápida)',
            description: 'Rápido aclaramiento de dopamina; alta resiliencia y calma en situaciones de estrés agudo, respuesta óptima al ejercicio intenso.',
            effectMagnitude: 'Actividad enzimática máxima'
          }
        },
        pubMedIds: ['15956988', '17008817'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs4680'
      }
    ]
  },
  {
    id: 'maoa_warrior_gene',
    title: 'Gen Guerrero MAO-A (Monoamino Oxidasa A / Reactividad e Impulsividad)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Tasa de reciclaje enzimático de serotonina, noradrenalina y dopamina: reactividad conductual ante la provocación, control de impulsos y asertividad competitiva.',
    biologicalMechanism: 'La monoamino oxidasa A (MAOA, codificada en el cromosoma X) desamina las monoaminas neurotransmisoras. La variante rs6323 (Arg297) modula los niveles basales de la enzima.',
    lifestyleInsights: [
      'Individuos con variante de baja actividad enzimática (MAOA-L) muestran mayor asertividad e intensidad emocional ante situaciones de conflicto.',
      'El ejercicio físico regular y las técnicas de autorregulación emocional optimizan el autocontrol y canalizan positivamente la alta energía competitiva.'
    ],
    baselineProbability: 45,
    minProbability: 10,
    maxProbability: 90,
    unit: '% de actividad de MAOA',
    type: 'metabolic_speed',
    snps: [
      {
        rsid: 'rs6323',
        gene: 'MAOA (Arg297 / Gen Guerrero)',
        chromosome: 'X',
        name: 'MAOA rs6323 (R297R)',
        evidence: 'high',
        summary: 'Marcador principal de tasa transcripcional de monoamino oxidasa A.',
        scientificContext: 'El alelo T se correlaciona con menor actividad catalítica de MAOA (perfil MAOA-L), mientras que el alelo G confiere alta actividad (MAOA-H).',
        genotypes: {
          'TT': {
            genotype: 'TT',
            impact: 'trait_present',
            scoreContribution: 0.85,
            label: 'MAOA-L: Baja Actividad (Mayor Reactividad y Audacia)',
            description: 'Degradación más lenta de noradrenalina y serotonina; mayor intensidad en la toma de decisiones rápidas, tolerancia al riesgo y temperamento asertivo.',
            effectMagnitude: 'Baja degradación de monoaminas'
          },
          'T': {
            genotype: 'T',
            impact: 'trait_present',
            scoreContribution: 0.85,
            label: 'MAOA-L Hemicigoto (Varón): Alta Reactividad Conductual',
            description: 'Cromosoma X con alelo de baja actividad de MAOA.',
            effectMagnitude: 'Perfil Guerrero MAOA-L'
          },
          'GT': {
            genotype: 'GT',
            impact: 'average',
            scoreContribution: 0.1,
            label: 'MAOA Intermedio (Mujer Heterocigota)',
            description: 'Actividad enzimática moderada.',
            effectMagnitude: 'Nivel medio'
          },
          'GG': {
            genotype: 'GG',
            impact: 'trait_absent',
            scoreContribution: -0.85,
            label: 'MAOA-H: Alta Actividad (Rápido Aclaramiento)',
            description: 'Rápida metabolización de catecolaminas; mayor inhibición de conductas impulsivas y calma bajo provocación.',
            effectMagnitude: 'Alta degradación de monoaminas'
          },
          'G': {
            genotype: 'G',
            impact: 'trait_absent',
            scoreContribution: -0.85,
            label: 'MAOA-H Hemicigoto (Varón): Mayor Inhibición de Impulsos',
            description: 'Cromosoma X con alelo de alta actividad de MAOA.',
            effectMagnitude: 'Perfil MAOA-H'
          }
        },
        pubMedIds: ['12161658', '18635832'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs6323'
      }
    ]
  },
  {
    id: 'oxtr_social_empathy',
    title: 'Receptor de Oxitocina OXTR (Empatía Afectiva y Conexión Social)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Sensibilidad a la oxitocina: procesamiento de señales emocionales ajenas, calidez interpersonal vs distanciamiento analítico objetivo.',
    biologicalMechanism: 'El polimorfismo rs53576 en el intrón 3 del gen OXTR influye en la densidad de receptores de oxitocina en la amígdala y el núcleo estriado ventral.',
    lifestyleInsights: [
      'Portadores del alelo A muestran mayor facilidad para el análisis lógico desapegado de las emociones ajenas y menor susceptibilidad al contagio emocional.',
      'Portadores del genotipo GG poseen mayor receptividad intuitiva a microexpresiones faciales y beneficio reforzado de interacciones sociales cercanas.'
    ],
    baselineProbability: 40,
    minProbability: 10,
    maxProbability: 95,
    unit: '% de sensibilidad a la oxitocina',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs53576',
        gene: 'OXTR (Intrón 3)',
        chromosome: '3',
        name: 'OXTR rs53576 (Variante de Empatía y Sociabilidad)',
        evidence: 'high',
        summary: 'El marcador más investigado en psicología genética sobre empatía y conductas prosociales.',
        scientificContext: 'El alelo G incrementa la expresión del receptor de oxitocina y la conectividad amígdala-córtex cingulado anterior.',
        genotypes: {
          'GG': {
            genotype: 'GG',
            impact: 'trait_present',
            scoreContribution: 0.9,
            label: 'Alta Sensibilidad a la Oxitocina / Alta Empatía Afectiva',
            description: 'Mayor facilidad para interpretar el estado anímico de los demás, búsqueda natural de conexión interpersonal y mayor reducción de cortisol ante el apoyo social.',
            effectMagnitude: 'Mayor densidad de receptores OXTR'
          },
          'AG': {
            genotype: 'AG',
            impact: 'average',
            scoreContribution: 0.1,
            label: 'Sensibilidad Social Equilibrada',
            description: 'Equilibrio entre empatía afectiva y capacidad de análisis pragmático racional.',
            effectMagnitude: 'Sensibilidad intermedia'
          },
          'AA': {
            genotype: 'AA',
            impact: 'trait_absent',
            scoreContribution: -0.85,
            label: 'Perfil Analítico / Menor Contagio Emocional',
            description: 'Menor reactividad visceral a las emociones ajenas; mayor capacidad para mantener la cabeza fría y tomar decisiones difíciles sin sesgo afectivo.',
            effectMagnitude: 'Menor reactividad oxitocinérgica'
          }
        },
        pubMedIds: ['19934046', '21949397'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs53576'
      }
    ]
  },
  {
    id: 'drd4_novelty_seeking',
    title: 'Receptor de Dopamina DRD4 (Búsqueda de Novedad y Riesgo)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Sensibilidad del sistema de recompensa ante experiencias novedosas, curiosidad exploratoria, afición al riesgo e hiperfoco estimulante.',
    biologicalMechanism: 'Variantes en el promotor del receptor D4 de dopamina (DRD4) alteran la transducción de señales placenteras en el sistema mesocorticolímbico.',
    lifestyleInsights: [
      'Individuos con alta búsqueda de novedad rinden extraordinariamente en entornos cambiantes, emprendimiento y proyectos dinámicos no rutinarios.',
      'Canalizar mediante deportes de acción o metas retadoras continuas.'
    ],
    baselineProbability: 30,
    minProbability: 5,
    maxProbability: 85,
    unit: '% de tendencia a la búsqueda de novedad',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs1800955',
        gene: 'DRD4 (-521 C/T)',
        chromosome: '11',
        name: 'DRD4 -521C/T Promotor',
        evidence: 'high',
        summary: 'Regula la tasa de transcripción basal del receptor dopaminérgico D4.',
        scientificContext: 'El alelo C incrementa un 40% la transcripción de DRD4 en comparación con el alelo T.',
        genotypes: {
          'CC': {
            genotype: 'CC',
            impact: 'trait_present',
            scoreContribution: 0.85,
            label: 'Alta Búsqueda de Novedad y Curiosidad Exploratoria',
            description: 'Mayor avidez por estímulos nuevos, predisposición a explorar nuevas ideas, proyectos y entornos.',
            effectMagnitude: 'Mayor expresión de DRD4'
          },
          'CT': {
            genotype: 'CT',
            impact: 'average',
            scoreContribution: 0.1,
            label: 'Nivel Medio de Búsqueda de Novedad',
            description: 'Apertura equilibrada a la innovación con aprecio por la estabilidad.',
            effectMagnitude: 'Expresión intermedia'
          },
          'TT': {
            genotype: 'TT',
            impact: 'trait_absent',
            scoreContribution: -0.75,
            label: 'Preferencia por la Predictibilidad y Estabilidad',
            description: 'Mayor confort en entornos estructurados, rutinas consolidadas y menor inclinación al riesgo innecesario.',
            effectMagnitude: 'Baja expresión de DRD4'
          }
        },
        pubMedIds: ['10643872', '12497645'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1800955'
      }
    ]
  },
  {
    id: 'bdnf_synaptic_plasticity',
    title: 'Plasticidad Sináptica y Memoria Emocional (BDNF Val66Met)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Eficiencia en la secreción dependiente de actividad del factor neurotrófico derivado del cerebro en hipocampo y corteza prefrontal.',
    biologicalMechanism: 'La variante Val66Met (rs6265) en el pro-dominio de BDNF impide su empaquetamiento adecuado en vesículas secretoras reguladas.',
    lifestyleInsights: [
      'Portadores del alelo Met obtienen beneficios extraordinarios del ejercicio aeróbico regular, que estimula potentemente la síntesis compensatoria de BDNF.',
      'La meditación y la estimulación intelectual continua fomentan la neurogénesis en el giro dentado hipocampal.'
    ],
    baselineProbability: 50,
    minProbability: 15,
    maxProbability: 95,
    unit: '% de plasticidad sináptica basal',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs6265',
        gene: 'BDNF (Val66Met)',
        chromosome: '11',
        name: 'BDNF Val66Met (rs6265)',
        evidence: 'high',
        summary: 'Polimorfismo fundamental en neuroplasticidad, consolidación de memoria y resiliencia cerebral.',
        scientificContext: 'La sustitución G>A (Val66Met) altera el tráfico intracelular y la liberación sináptica de BDNF maduro.',
        genotypes: {
          'GG': {
            genotype: 'GG',
            impact: 'trait_present',
            scoreContribution: 0.85,
            label: 'Val/Val: Máxima Secreción y Plasticidad Sináptica',
            description: 'Liberación óptima de BDNF ante el aprendizaje y el esfuerzo cognitivo; consolidación ágil de la memoria espacial.',
            effectMagnitude: '100% secreción regulada'
          },
          'AG': {
            genotype: 'AG',
            impact: 'average',
            scoreContribution: 0.0,
            label: 'Val/Met: Plasticidad y Memoria Intermedia',
            description: 'Secreción moderadamente reducida de BDNF; respuesta muy favorable al ejercicio físico como potenciador cognitivo.',
            effectMagnitude: 'Secreción reducida un 25%'
          },
          'AA': {
            genotype: 'AA',
            impact: 'moderate',
            scoreContribution: -0.7,
            label: 'Met/Met: Sensibilidad al Estrés y Memoria Emocional Vívida',
            description: 'Menor secreción espontánea de BDNF hipocampal; fijación muy profunda de memorias emocionales y necesidad de descanso reparador.',
            effectMagnitude: 'Secreción reducida un 40%'
          }
        },
        pubMedIds: ['12547970', '16839358'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs6265'
      }
    ]
  },
  {
    id: 'clock_chronotype_sleep',
    title: 'Cronotipo Circadiano y Preferencia Diurna / Nocturna (CLOCK 3111T>C)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Alineación del marcapasos circadiano central en el núcleo supraquiasmático y predisposición a ser persona matutina ("alondra") o vespertina ("búho").',
    biologicalMechanism: 'La variante 3111T>C (rs1801260) en la región 3\' UTR del gen CLOCK modula la longitud del periodo circadiano endógeno y la fase de secreción de melatonina.',
    lifestyleInsights: [
      'Individuos con alelo C (vespertinos) alcanzan su pico de alerta cognitiva por la tarde/noche y tienen mayor vulnerabilidad al desfase horario social si deben madrugar de forma forzada.',
      'La exposición a luz solar intensa durante los primeros 30 minutos tras despertar y evitar pantallas azules antes de acostarse ayuda a anclar el ciclo circadiano.'
    ],
    baselineProbability: 40,
    minProbability: 5,
    maxProbability: 95,
    unit: '% de probabilidad de cronotipo vespertino / nocturno',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs1801260',
        gene: 'CLOCK (3111T>C)',
        chromosome: '4',
        name: 'Gen Circadiano CLOCK rs1801260',
        evidence: 'high',
        summary: 'Determinante genético clásico de la ritmicidad circadiana y necesidad de sueño.',
        scientificContext: 'El alelo C alarga el periodo del oscilador circadiano intrínseco.',
        genotypes: {
          'CC': {
            genotype: 'CC',
            impact: 'trait_present',
            scoreContribution: 0.9,
            label: 'Cronotipo Vespertino Fuerte ("Búho Nocturno")',
            description: 'Retraso de fase circadiana; mayor energía y productividad mental a última hora de la tarde o en la noche.',
            effectMagnitude: 'Fase circadiana tardía (+1.5h)'
          },
          'TC': {
            genotype: 'TC',
            impact: 'average',
            scoreContribution: 0.4,
            label: 'Cronotipo Intermedio / Vespertino Moderado',
            description: 'Flexibilidad horaria con inclinación a acostarse algo más tarde.',
            effectMagnitude: 'Fase circadiana intermedia'
          },
          'CT': {
            genotype: 'CT',
            impact: 'average',
            scoreContribution: 0.4,
            label: 'Cronotipo Intermedio / Vespertino Moderado',
            description: 'Flexibilidad horaria con inclinación a acostarse algo más tarde.',
            effectMagnitude: 'Fase circadiana intermedia'
          },
          'TT': {
            genotype: 'TT',
            impact: 'trait_absent',
            scoreContribution: -0.8,
            label: 'Cronotipo Matutino ("Alondra")',
            description: 'Facilidad natural para despertar temprano con pleno rendimiento cognitivo desde primera hora de la mañana.',
            effectMagnitude: 'Fase circadiana temprana'
          }
        },
        pubMedIds: ['9500547', '18388569'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1801260'
      }
    ]
  },
  {
    id: 'drd2_ankk1_reward_system',
    title: 'Densidad de Receptores Dopaminérgicos D2 y Búsqueda de Recompensa (ANKK1 / DRD2 Taq1A)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Densidad de receptores D2 en el cuerpo estriado cerebral y modulación de la motivación, gratificación y susceptibilidad a conductas impulsivas.',
    biologicalMechanism: 'La variante Taq1A (rs1800497 Glu713Lys en ANKK1) se asocia a una reducción del 30-40% en la densidad de receptores D2 estriatales en el sistema mesolímbico.',
    lifestyleInsights: [
      'Portadores del alelo A1 (T) pueden requerir estímulos de mayor intensidad para experimentar el mismo nivel de satisfacción placentera.',
      'Canalizar la búsqueda de dopamina hacia metas desafiantes, deportes de impacto o proyectos creativos intensos.',
      'Atención a hábitos con riesgo de dependencia (alimentos ultraprocesados hiperpalatables, videojuegos o compras impulsivas).'
    ],
    baselineProbability: 30,
    minProbability: 10,
    maxProbability: 85,
    unit: '% de probabilidad de menor densidad de receptores D2',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs1800497',
        gene: 'ANKK1 / DRD2 (Taq1A)',
        chromosome: '11',
        name: 'Receptor Dopamina D2 Taq1A (rs1800497)',
        evidence: 'high',
        summary: 'Regula la disponibilidad de receptores de dopamina D2 en el circuito de recompensa estriatal.',
        scientificContext: 'El alelo T (antiguamente alelo A1) se asocia a menor densidad de unión a D2.',
        genotypes: {
          'TT': {
            genotype: 'TT',
            impact: 'trait_present',
            scoreContribution: 0.85,
            label: 'Alelo A1/A1: Menor Densidad D2 / Alta Búsqueda de Estímulos',
            description: 'Reducción marcada de receptores estriatales D2; necesidad de estímulos intensos para experimentar satisfacción.',
            effectMagnitude: '~40% menos densidad de D2'
          },
          'CT': {
            genotype: 'CT',
            impact: 'average',
            scoreContribution: 0.35,
            label: 'Alelo A1/A2: Densidad D2 Intermedia',
            description: 'Equilibrio moderado en el sistema de refuerzo y motivación.',
            effectMagnitude: '~20% menos densidad de D2'
          },
          'TC': {
            genotype: 'TC',
            impact: 'average',
            scoreContribution: 0.35,
            label: 'Alelo A1/A2: Densidad D2 Intermedia',
            description: 'Equilibrio moderado en el sistema de refuerzo y motivación.',
            effectMagnitude: '~20% menos densidad de D2'
          },
          'CC': {
            genotype: 'CC',
            impact: 'trait_absent',
            scoreContribution: -0.7,
            label: 'Alelo A2/A2: Densidad Óptima de Receptores D2',
            description: 'Niveles basales normales de receptores D2; satisfacción equilibrada con recompensas cotidianas estándar.',
            effectMagnitude: 'Densidad receptora basal óptima'
          }
        },
        pubMedIds: ['1973059', '18086552'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1800497'
      }
    ]
  },
  {
    id: 'skin_sun_sensitivity_tyr',
    title: 'Fotosensibilidad Cutánea y Tendencia a Quemaduras Solares (TYR / SLC45A2)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Capacidad de síntesis de eumelanina protectora en los melanocitos basales de la epidermis ante la radiación ultravioleta.',
    biologicalMechanism: 'Polimorfismos en tirosinasa (TYR rs1042602) y en el transportador SLC45A2 (rs16891982) modulan la actividad enzimática que convierte tirosina en dopaquinona y melanina oscura.',
    lifestyleInsights: [
      'Personas con variantes hipopigmentantes queman con facilidad y broncean poco (fototipos I-II de Fitzpatrick).',
      'Uso imprescindible de fotoprotector solar SPF 50+ de amplio espectro frente a UVA/UVB.',
      'Consumo de carotenoides (betacaroteno, licopeno, astaxantina) como fotoprotectores orales biológicos.'
    ],
    baselineProbability: 35,
    minProbability: 5,
    maxProbability: 95,
    unit: '% de fotosensibilidad cutánea',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs1042602',
        gene: 'TYR (Arg402Gln / c.1205G>A)',
        chromosome: '11',
        name: 'Tirosinasa TYR rs1042602',
        evidence: 'high',
        summary: 'Modula la actividad catalítica termolábil de la tirosinasa y la pigmentación cutánea.',
        scientificContext: 'El alelo A (Gln402) produce una enzima termolábil que sintetiza menos eumelanina a 37°C.',
        genotypes: {
          'AA': {
            genotype: 'AA',
            impact: 'trait_present',
            scoreContribution: 0.85,
            label: 'Alta Fotosensibilidad / Piel Clara y Fácil Quemadura (AA)',
            description: 'Baja capacidad de síntesis de melanina protectora; tendencia a eritema solar inmediato y pecas.',
            effectMagnitude: 'Alta fotosensibilidad UV'
          },
          'AG': {
            genotype: 'AG',
            impact: 'average',
            scoreContribution: 0.3,
            label: 'Fotosensibilidad Media / Bronceado Gradual (AG)',
            description: 'Pigmentación intermedia; quema moderada con capacidad de bronceado posterior.',
            effectMagnitude: 'Fotosensibilidad moderada'
          },
          'GA': {
            genotype: 'GA',
            impact: 'average',
            scoreContribution: 0.3,
            label: 'Fotosensibilidad Media / Bronceado Gradual (GA)',
            description: 'Pigmentación intermedia.',
            effectMagnitude: 'Fotosensibilidad moderada'
          },
          'GG': {
            genotype: 'GG',
            impact: 'trait_absent',
            scoreContribution: -0.7,
            label: 'Tolerancia Solar Alta / Bronceado Rápido (GG)',
            description: 'Tirosinasa termoestable; rápida fotoprotección y bronceado con baja propensión a quemaduras.',
            effectMagnitude: 'Baja fotosensibilidad'
          }
        },
        pubMedIds: ['18488028', '19812544'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1042602'
      },
      {
        rsid: 'rs16891982',
        gene: 'SLC45A2 (Leu374Phe)',
        chromosome: '5',
        name: 'SLC45A2 Leu374Phe (rs16891982)',
        evidence: 'high',
        summary: 'Determinante fundamental de piel clara vs oscura en poblaciones europeas.',
        scientificContext: 'El alelo G (Leu374) es característico de piel muy clara en Europa.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'trait_present', scoreContribution: 0.85, label: 'Piel Clara Europea (Leu/Leu)', description: 'Tono de piel claro y fotosensible.', effectMagnitude: 'Fototipo claro' },
          'CG': { genotype: 'CG', impact: 'average', scoreContribution: 0.2, label: 'Fototipo Intermedio (Leu/Phe)', description: 'Tono medio con buena tolerancia solar.', effectMagnitude: 'Fototipo medio' },
          'CC': { genotype: 'CC', impact: 'trait_absent', scoreContribution: -0.8, label: 'Fototipo Moreno / Alta Protección (Phe/Phe)', description: 'Piel más pigmentada y muy resistente a quemaduras.', effectMagnitude: 'Fototipo oscuro' }
        },
        pubMedIds: ['18488028', '18086552'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs16891982'
      }
    ]
  },
  {
    id: 'pain_sensitivity_oprm1',
    title: 'Sensibilidad al Dolor y Respuesta a Endorfinas (OPRM1 A118G)',
    category: 'personal_traits',
    categoryLabel: 'Rasgos personales',
    description: 'Afinidad de unión del receptor opioide mu-1 por las beta-endorfinas y modulación de la percepción subjetiva del umbral doloroso.',
    biologicalMechanism: 'La mutación c.118A>G (rs1799971 / Asn40Asp) en OPRM1 elimina un sitio de N-glicosilación en el dominio extracelular del receptor opioide mu, reduciendo la afinidad por endorfinas endógenas.',
    lifestyleInsights: [
      'Portadores del alelo G (Asp40) pueden percibir estímulos nociceptivos con mayor agudeza o requerir dosis diferentes de analgésicos opioides.',
      'Técnicas de biofeedback, respiración profunda y terapia miofascial incrementan la liberación compensatoria de endorfinas.',
      'El ejercicio físico regular actúa como un potente analgésico fisiológico natural.'
    ],
    baselineProbability: 25,
    minProbability: 5,
    maxProbability: 80,
    unit: '% de sensibilidad a estímulos nociceptivos',
    type: 'phenotype',
    snps: [
      {
        rsid: 'rs1799971',
        gene: 'OPRM1 (A118G / Asn40Asp)',
        chromosome: '6',
        name: 'Receptor Opioide Mu-1 OPRM1 rs1799971',
        evidence: 'high',
        summary: 'Determinante genético primario de la respuesta analgésica y tolerancia al dolor somático.',
        scientificContext: 'El alelo G disminuye la densidad funcional del receptor opioide mu.',
        genotypes: {
          'GG': {
            genotype: 'GG',
            impact: 'trait_present',
            scoreContribution: 0.8,
            label: 'Mayor Sensibilidad al Dolor / Menor Afinidad Endorfínica (GG)',
            description: 'Menor amortiguación natural del dolor por endorfinas; mayor reactividad a estímulos dolorosos intensos.',
            effectMagnitude: 'Umbral de dolor reducido'
          },
          'AG': {
            genotype: 'AG',
            impact: 'average',
            scoreContribution: 0.35,
            label: 'Sensibilidad al Dolor Intermedia (AG)',
            description: 'Respuesta analgésica estándar con variabilidad moderada.',
            effectMagnitude: 'Umbral de dolor intermedio'
          },
          'GA': {
            genotype: 'GA',
            impact: 'average',
            scoreContribution: 0.35,
            label: 'Sensibilidad al Dolor Intermedia (GA)',
            description: 'Respuesta analgésica estándar.',
            effectMagnitude: 'Umbral de dolor intermedio'
          },
          'AA': {
            genotype: 'AA',
            impact: 'trait_absent',
            scoreContribution: -0.5,
            label: 'Alta Tolerancia al Dolor / Óptima Unión Endorfínica (AA)',
            description: 'Excelente amortiguación analgésica endógena ante el estrés físico y el dolor.',
            effectMagnitude: 'Alta tolerancia natural'
          }
        },
        pubMedIds: ['12497645', '16839358'],
        snpediaUrl: 'https://bots.snpedia.com/index.php/rs1799971'
      }
    ]
  }
];
