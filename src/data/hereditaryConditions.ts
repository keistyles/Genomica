import { TraitDefinition } from '../types/genetics';

export const HEREDITARY_CONDITIONS_DATA: TraitDefinition[] = [
  {
    id: 'cystic_fibrosis',
    title: 'Fibrosis quística (CFTR F508del)',
    category: 'hereditary_conditions',
    categoryLabel: 'Condiciones hereditarias',
    description: 'Estado de portador para la alteración en el canal epitelial de cloruro CFTR que condiciona secreciones mucosas espesas.',
    biologicalMechanism: 'La deleción de tres nucleótidos (F508del) produce un mal plegamiento y degradación prematura de la proteína canal CFTR.',
    lifestyleInsights: [
      'Si se es portador (heterocigoto), la persona no padece la enfermedad, pero puede transmitir la variante a la descendencia.',
      'Se aconseja consejo genético de pareja en caso de planificación reproductiva.'
    ],
    baselineProbability: 3,
    minProbability: 0,
    maxProbability: 100,
    type: 'carrier',
    inheritanceMode: 'Autosómica recesiva',
    snps: [
      {
        rsid: 'rs113993960',
        gene: 'CFTR',
        chromosome: '7',
        name: 'CFTR DeltaF508 (p.Phe508del)',
        evidence: 'high',
        summary: 'Mutación causal más común en fibrosis quística en poblaciones europeas.',
        scientificContext: 'Deleción del aminoácido fenilalanina en posición 508.',
        genotypes: {
          'DD': { genotype: 'DD', impact: 'variant_present', scoreContribution: 1.0, label: 'Afectado (Homocigoto Mutado)', description: 'Dos copias mutadas; fenotipo de fibrosis quística.', effectMagnitude: 'Patogénico' },
          'ID': { genotype: 'ID', impact: 'variant_present', scoreContribution: 0.5, label: 'Portador Asintomático (1 copia)', description: 'Portador sano de una variante patogénica en CFTR.', effectMagnitude: 'Portador recesivo' },
          'II': { genotype: 'II', impact: 'variant_absent', scoreContribution: 0.0, label: 'Variante ausente (No portador)', description: 'Genotipo de referencia sin deleción F508del.', effectMagnitude: 'Sin variante patogénica' }
        },
        defaultImpact: { genotype: '--', impact: 'variant_absent', scoreContribution: 0.0, label: 'Variante no detectada', description: 'No se detecta la variante patogénica.', effectMagnitude: 'Negativo' }
      }
    ]
  },
  {
    id: 'hemochromatosis',
    title: 'Hemocromatosis hereditaria tipo 1 (HFE C282Y / H63D)',
    category: 'hereditary_conditions',
    categoryLabel: 'Condiciones hereditarias',
    description: 'Alteración en la regulación de la absorción intestinal de hierro con riesgo de sobrecarga tisular progresiva.',
    biologicalMechanism: 'Las mutaciones C282Y y H63D en la proteína HFE reducen la síntesis de hepcidina hepática, aumentando la absorción no regulada de hierro.',
    lifestyleInsights: [
      'Monitorización periódica de ferritina e índice de saturación de transferrina (IST).',
      'Evitar suplementos innecesarios con hierro o dosis muy altas de vitamina C con las comidas.',
      'Las flebotomías terapéuticas previenen eficazmente el daño hepático y articular en homocigotos.'
    ],
    baselineProbability: 7,
    minProbability: 0,
    maxProbability: 100,
    type: 'carrier',
    inheritanceMode: 'Autosómica recesiva',
    snps: [
      {
        rsid: 'rs1800562',
        gene: 'HFE (C282Y)',
        chromosome: '6',
        name: 'HFE C282Y (p.Cys282Tyr)',
        evidence: 'high',
        summary: 'Principal variante genética responsable de la hemocromatosis clínica.',
        scientificContext: 'La presencia de homocigosis A/A (Tyr282Tyr) causa sobrecarga de hierro en adultos.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'variant_present', scoreContribution: 1.0, label: 'Homocigoto C282Y (Alto riesgo de sobrecarga)', description: 'Riesgo elevado de acumulación patológica de hierro férrico.', effectMagnitude: 'Penetrancia clínica variable' },
          'AG': { genotype: 'AG', impact: 'variant_present', scoreContribution: 0.4, label: 'Portador Heterocigoto C282Y', description: 'Portador de una copia; niveles de hierro habitualmente normales o levemente altos.', effectMagnitude: 'Portador' },
          'GG': { genotype: 'GG', impact: 'variant_absent', scoreContribution: 0.0, label: 'Variante ausente (Genotipo Cys/Cys)', description: 'Regulación normal de la síntesis de hepcidina.', effectMagnitude: 'Sin variante patogénica' }
        }
      },
      {
        rsid: 'rs1799945',
        gene: 'HFE (H63D)',
        chromosome: '6',
        name: 'HFE H63D (p.His63Asp)',
        evidence: 'high',
        summary: 'Variante secundaria de penetrancia moderada.',
        scientificContext: 'En combinación con C282Y (heterocigoto compuesto C282Y/H63D) puede causar elevación de ferritina.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'variant_present', scoreContribution: 0.5, label: 'Homocigoto H63D', description: 'Leve tendencia a saturación elevada de transferrina.', effectMagnitude: 'Baja penetrancia' },
          'CG': { genotype: 'CG', impact: 'variant_present', scoreContribution: 0.2, label: 'Heterocigoto H63D', description: 'Portador de la variante H63D.', effectMagnitude: 'Portador leve' },
          'CC': { genotype: 'CC', impact: 'variant_absent', scoreContribution: 0.0, label: 'Variante ausente (His/His)', description: 'Genotipo de referencia.', effectMagnitude: 'Normal' }
        }
      }
    ]
  },
  {
    id: 'alpha_1_antitrypsin_deficiency',
    title: 'Déficit de Alfa-1 Antitripsina (SERPINA1 Pi*Z / Pi*S)',
    category: 'hereditary_conditions',
    categoryLabel: 'Condiciones hereditarias',
    description: 'Deficiencia en el inhibidor proteásico sérico que protege los alvéolos pulmonares y el parénquima hepático.',
    biologicalMechanism: 'La mutación Pi*Z (Glu342Lys) provoca polimerización intracelular en hepatocitos y falta de protección antiproteasa en el pulmón.',
    lifestyleInsights: [
      'Evitar estrictamente el humo de tabaco y la exposición a polvos y vapores ocupacionales.',
      'Control de función hepática y espirometría pulmonar.',
      'Vacunación antigripal y antineumocócica para proteger las vías respiratorias.'
    ],
    baselineProbability: 3,
    minProbability: 0,
    maxProbability: 100,
    type: 'carrier',
    inheritanceMode: 'Autosómica recesiva',
    snps: [
      {
        rsid: 'rs28929474',
        gene: 'SERPINA1 (Pi*Z)',
        chromosome: '14',
        name: 'Alelo Z (Glu342Lys)',
        evidence: 'high',
        summary: 'La variante más severa del déficit de alfa-1 antitripsina.',
        scientificContext: 'El alelo T (Lys342) condiciona retención proteica y niveles plasmáticos muy bajos (<15%).',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'variant_present', scoreContribution: 1.0, label: 'Genotipo Pi*ZZ (Déficit Severo)', description: 'Concentraciones séricas de AAT muy bajas; alto riesgo de enfisema pulmonar.', effectMagnitude: 'Déficit severo' },
          'CT': { genotype: 'CT', impact: 'variant_present', scoreContribution: 0.5, label: 'Genotipo Pi*MZ (Portador)', description: 'Portador de la variante Z; niveles séricos de AAT al ~60%.', effectMagnitude: 'Portador' },
          'CC': { genotype: 'CC', impact: 'variant_absent', scoreContribution: 0.0, label: 'Genotipo Pi*MM (Normal)', description: 'Niveles fisiológicos óptimos de alfa-1 antitripsina.', effectMagnitude: 'Normal' }
        }
      },
      {
        rsid: 'rs17580',
        gene: 'SERPINA1 (Pi*S)',
        chromosome: '14',
        name: 'Alelo S (Glu264Val)',
        evidence: 'high',
        summary: 'Variante de déficit moderado.',
        scientificContext: 'El alelo T reduce moderadamente la concentración plasmática (~80%).',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'variant_present', scoreContribution: 0.4, label: 'Genotipo Pi*SS', description: 'Reducción moderada de AAT.', effectMagnitude: 'Déficit leve' },
          'AT': { genotype: 'AT', impact: 'variant_present', scoreContribution: 0.2, label: 'Genotipo Pi*MS (Portador)', description: 'Portador del alelo S con niveles funcionales adecuados.', effectMagnitude: 'Portador' },
          'AA': { genotype: 'AA', impact: 'variant_absent', scoreContribution: 0.0, label: 'Genotipo Normal', description: 'Sin mutación Pi*S.', effectMagnitude: 'Normal' }
        }
      }
    ]
  },
  {
    id: 'familial_breast_ovarian_cancer_brca',
    title: 'Cáncer de mama y ovario hereditario (BRCA1 / BRCA2)',
    category: 'hereditary_conditions',
    categoryLabel: 'Condiciones hereditarias',
    description: 'Estado de portador de variantes de alta penetrancia en genes reparadores de roturas de doble cadena de ADN (recombinación homóloga).',
    biologicalMechanism: 'Pérdida de función en BRCA1 o BRCA2 que impide la reparación fiel del ADN celular, favoreciendo la inestabilidad genómica.',
    lifestyleInsights: [
      'En caso de detectarse una variante patogénica, se requiere confirmación diagnóstica mediante secuenciación clínica NGS.',
      'Seguimiento especializado en unidades de consejo genético oncológico.',
      'Protocolos de cribado precoz con resonancia magnética mamaria.'
    ],
    baselineProbability: 0.5,
    minProbability: 0,
    maxProbability: 100,
    type: 'carrier',
    inheritanceMode: 'Autosómica dominante',
    snps: [
      {
        rsid: 'rs80357906',
        gene: 'BRCA1 (185delAG)',
        chromosome: '17',
        name: 'BRCA1 c.68_69delAG',
        evidence: 'high',
        summary: 'Mutación fundadora patogénica con cambio de pauta de lectura.',
        scientificContext: 'Genera codón de parada prematuro y proteína no funcional.',
        genotypes: {
          'DD': { genotype: 'DD', impact: 'variant_present', scoreContribution: 1.0, label: 'Variante Patogénica Detectada', description: 'Portador de mutación truncante en BRCA1.', effectMagnitude: 'Alto riesgo de penetrancia oncológica' },
          'ID': { genotype: 'ID', impact: 'variant_present', scoreContribution: 1.0, label: 'Variante Patogénica Heterocigota', description: 'Portador de una copia patogénica.', effectMagnitude: 'Patogénico' },
          'II': { genotype: 'II', impact: 'variant_absent', scoreContribution: 0.0, label: 'Variante ausente (Negativo)', description: 'No se detecta la deleción patogénica 185delAG.', effectMagnitude: 'Sin variante patogénica' }
        },
        defaultImpact: { genotype: '--', impact: 'variant_absent', scoreContribution: 0.0, label: 'Variante ausente', description: 'No se detecta la mutación.', effectMagnitude: 'Negativo' }
      }
    ]
  },
  {
    id: 'gaucher_disease',
    title: 'Enfermedad de Gaucher tipo 1 (GBA N370S)',
    category: 'hereditary_conditions',
    categoryLabel: 'Condiciones hereditarias',
    description: 'Déficit de la enzima lisosomal glucocerebrosidasa con acumulación de glucosilceramida en macrófagos.',
    biologicalMechanism: 'La mutación N370S (p.Asn370Ser) en GBA altera la actividad hidrolítica lisosomal.',
    lifestyleInsights: [
      'Los portadores simples (heterocigotos) no desarrollan enfermedad de Gaucher.',
      'Control de niveles de plaquetas y hemoglobina en personas diagnosticadas.',
      'Existe terapia de reemplazo enzimático y reducción de sustrato muy eficaz.'
    ],
    baselineProbability: 1,
    minProbability: 0,
    maxProbability: 100,
    type: 'carrier',
    inheritanceMode: 'Autosómica recesiva',
    snps: [
      {
        rsid: 'rs76763715',
        gene: 'GBA (N370S)',
        chromosome: '1',
        name: 'GBA N370S (p.Asn409Ser)',
        evidence: 'high',
        summary: 'Variante patogénica más prevalente en Gaucher no neuropático.',
        scientificContext: 'La sustitución A>G causa deficiencia enzimática.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'variant_present', scoreContribution: 1.0, label: 'Homocigoto Mutado (Gaucher tipo 1)', description: 'Dos copias de N370S; fenotipo Gaucher moderado/tardío.', effectMagnitude: 'Patogénico' },
          'AG': { genotype: 'AG', impact: 'variant_present', scoreContribution: 0.5, label: 'Portador Asintomático (1 copia)', description: 'Portador recesivo de la variante N370S.', effectMagnitude: 'Portador' },
          'AA': { genotype: 'AA', impact: 'variant_absent', scoreContribution: 0.0, label: 'Variante ausente (No portador)', description: 'Actividad glucocerebrosidasa normal.', effectMagnitude: 'Normal' }
        }
      }
    ]
  },
  {
    id: 'familial_mediterranean_fever',
    title: 'Fiebre mediterránea familiar (MEFV M694V)',
    category: 'hereditary_conditions',
    categoryLabel: 'Condiciones hereditarias',
    description: 'Enfermedad autoinflamatoria caracterizada por episodios recurrentes de fiebre y poliserositis.',
    biologicalMechanism: 'Mutaciones en la proteína pirina (MEFV) provocan una activación incontrolada del inflamasoma NLRP3 y sobreproducción de IL-1β.',
    lifestyleInsights: [
      'El tratamiento continuo con colchicina previene eficazmente las crisis de serositis y la amiloidosis renal.',
      'Mantener control de la proteína amiloide A sérica.',
      'Evitar situaciones de estrés físico o fatiga extrema.'
    ],
    baselineProbability: 1.5,
    minProbability: 0,
    maxProbability: 100,
    type: 'carrier',
    inheritanceMode: 'Autosómica recesiva',
    snps: [
      {
        rsid: 'rs61732874',
        gene: 'MEFV (M694V)',
        chromosome: '16',
        name: 'MEFV M694V (p.Met694Val)',
        evidence: 'high',
        summary: 'La mutación de pirina con mayor severidad inflamatoria.',
        scientificContext: 'El alelo G causa pérdida del control inhibitorio del inflamasoma.',
        genotypes: {
          'GG': { genotype: 'GG', impact: 'variant_present', scoreContribution: 1.0, label: 'Homocigoto M694V (Afectado)', description: 'Alto riesgo de crisis autoinflamatorias y respuesta óptima a colchicina.', effectMagnitude: 'Patogénico' },
          'AG': { genotype: 'AG', impact: 'variant_present', scoreContribution: 0.5, label: 'Portador Heterocigoto M694V', description: 'Portador de una copia de pirina mutada.', effectMagnitude: 'Portador' },
          'AA': { genotype: 'AA', impact: 'variant_absent', scoreContribution: 0.0, label: 'Variante ausente', description: 'Función fisiológica normal de la pirina.', effectMagnitude: 'Normal' }
        }
      }
    ]
  },
  {
    id: 'factor_v_leiden_thrombophilia',
    title: 'Trombofilia Hereditaria por Factor V Leiden (F5 G1691A / R506Q)',
    category: 'hereditary_conditions',
    categoryLabel: 'Condiciones hereditarias',
    description: 'Resistencia a la Proteína C Activada (APC) y predisposición genética a tromboembolismo venoso profundo y embolia pulmonar.',
    biologicalMechanism: 'La mutación G1691A en el factor V de la coagulación elimina el sitio de escisión proteolítica por la proteína C activada, prolongando la generación de trombina.',
    lifestyleInsights: [
      'Comunicar el estado de portador antes de cirugías mayores, inmovilizaciones prolongadas o vuelos de larga distancia (>6 horas).',
      'Evitar el uso de anticonceptivos orales combinados con estrógenos y terapia hormonal sustitutiva.',
      'Uso de medias de compresión graduada en viajes y mantener hidratación constante.'
    ],
    baselineProbability: 4.5,
    minProbability: 0,
    maxProbability: 100,
    type: 'carrier',
    inheritanceMode: 'Autosómica dominante',
    snps: [
      {
        rsid: 'rs6025',
        gene: 'F5 (R506Q / Factor V Leiden)',
        chromosome: '1',
        name: 'Factor V Leiden rs6025 (G1691A)',
        evidence: 'high',
        summary: 'La causa genética más prevalente de trombofilia hereditaria en poblaciones de origen europeo.',
        scientificContext: 'La sustitución Arg506Gln (alelo A) confiere resistencia a la inactivación anticoagulante mediada por la proteína C.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'variant_present', scoreContribution: 1.0, label: 'Homocigoto Factor V Leiden (Alto Riesgo Trombótico)', description: 'Dos copias mutadas; incremento de 50 a 80 veces en el riesgo de trombosis venosa.', effectMagnitude: '50-80x riesgo de TEV' },
          'AG': { genotype: 'AG', impact: 'variant_present', scoreContribution: 0.6, label: 'Portador Heterocigoto Factor V Leiden', description: 'Una copia del alelo de Leiden; incremento de 4 a 8 veces en el riesgo de trombosis venosa.', effectMagnitude: '4-8x riesgo de TEV' },
          'GA': { genotype: 'GA', impact: 'variant_present', scoreContribution: 0.6, label: 'Portador Heterocigoto Factor V Leiden', description: 'Una copia del alelo de Leiden.', effectMagnitude: '4-8x riesgo de TEV' },
          'GG': { genotype: 'GG', impact: 'variant_absent', scoreContribution: 0.0, label: 'Genotipo Normal (No Portador)', description: 'Sensibilidad normal del Factor V a la proteína C activada.', effectMagnitude: 'Sin variante patogénica' }
        }
      }
    ]
  },
  {
    id: 'prothrombin_g20210a_thrombophilia',
    title: 'Trombofilia por Mutación del Gen de la Protrombina (F2 G20210A)',
    category: 'hereditary_conditions',
    categoryLabel: 'Condiciones hereditarias',
    description: 'Hipercoagulabilidad debida a sobreexpresión transcripcional del factor II de la coagulación (protrombina).',
    biologicalMechanism: 'La mutación G20210A en la región 3\' UTR de F2 aumenta la estabilidad del ARN mensajero y eleva un 30% los niveles plasmáticos de protrombina.',
    lifestyleInsights: [
      'Precaución con factores de riesgo trombótico adquiridos: tabaquismo, sedentarismo, sobrepeso.',
      'Profilaxis antitrombótica recomendada en el puerperio y postoperatorio inmediato bajo supervisión hematológica.'
    ],
    baselineProbability: 2.5,
    minProbability: 0,
    maxProbability: 100,
    type: 'carrier',
    inheritanceMode: 'Autosómica dominante',
    snps: [
      {
        rsid: 'rs1799963',
        gene: 'F2 (Protrombina 3\' UTR G20210A)',
        chromosome: '11',
        name: 'Protrombina G20210A rs1799963',
        evidence: 'high',
        summary: 'Segunda anomalía genética más común predisponente a trombosis venosa.',
        scientificContext: 'El alelo A potencia la eficiencia de procesamiento del extremo 3\' del pre-ARNm de protrombina.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'variant_present', scoreContribution: 1.0, label: 'Homocigoto Protrombina 20210A (Alto Riesgo)', description: 'Niveles marcadamente elevados de protrombina circulante.', effectMagnitude: '20-30x riesgo de TEV' },
          'AG': { genotype: 'AG', impact: 'variant_present', scoreContribution: 0.5, label: 'Portador Heterocigoto Protrombina 20210A', description: 'Portador de una copia; elevación moderada de protrombina.', effectMagnitude: '2.5-4x riesgo de TEV' },
          'GA': { genotype: 'GA', impact: 'variant_present', scoreContribution: 0.5, label: 'Portador Heterocigoto Protrombina 20210A', description: 'Portador de una copia.', effectMagnitude: '2.5-4x riesgo de TEV' },
          'GG': { genotype: 'GG', impact: 'variant_absent', scoreContribution: 0.0, label: 'Genotipo Normal (No Portador)', description: 'Niveles fisiológicos basales de protrombina.', effectMagnitude: 'Sin variante patogénica' }
        }
      }
    ]
  },
  {
    id: 'wilson_disease_atp7b',
    title: 'Enfermedad de Wilson / Toxicosis de Cobre (ATP7B H1069Q)',
    category: 'hereditary_conditions',
    categoryLabel: 'Condiciones hereditarias',
    description: 'Estado de portador para la deficiencia en la ATPasa transportadora de cobre encargada de su excreción biliar e incorporación en ceruloplasmina.',
    biologicalMechanism: 'La mutación H1069Q (rs76151636) en el dominio de unión a ATP de ATP7B impide el tráfico vesicular de cobre, provocando su acumulación tóxica en hígado, ganglios basales cerebrales y córnea (anillo de Kayser-Fleischer).',
    lifestyleInsights: [
      'Los portadores heterocigotos son asintomáticos y presentan metabolismo de cobre generalmente conservado.',
      'En individuos homocigotos o heterocigotos compuestos, el diagnóstico precoz permite tratamiento quelante (d-penicilamina, trientina) y sales de zinc con pronóstico excelente.',
      'Asesoramiento genético recomendado en caso de consanguinidad o antecedentes familiares.'
    ],
    baselineProbability: 1.5,
    minProbability: 0,
    maxProbability: 100,
    type: 'carrier',
    inheritanceMode: 'Autosómica recesiva',
    snps: [
      {
        rsid: 'rs76151636',
        gene: 'ATP7B (H1069Q / c.3207C>A)',
        chromosome: '13',
        name: 'ATP7B p.His1069Gln',
        evidence: 'high',
        summary: 'Mutación patogénica más frecuente en la enfermedad de Wilson en personas de ascendencia europea (30-70% de alelos mutados).',
        scientificContext: 'La sustitución de histidina por glutamina en el codón 1069 desestabiliza el plegamiento térmico del transportador ATPasa de tipo P.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'variant_present', scoreContribution: 1.0, label: 'Homocigoto Afectado H1069Q', description: 'Dos copias mutadas; defecto severo en la excreción biliar de cobre.', effectMagnitude: 'Patogénico / Enfermedad de Wilson' },
          'CA': { genotype: 'CA', impact: 'variant_present', scoreContribution: 0.5, label: 'Portador Heterocigoto Asintomático', description: 'Portador de una copia patogénica; sin acumulación patológica de cobre.', effectMagnitude: 'Portador recesivo' },
          'AC': { genotype: 'AC', impact: 'variant_present', scoreContribution: 0.5, label: 'Portador Heterocigoto Asintomático', description: 'Portador de una copia patogénica.', effectMagnitude: 'Portador recesivo' },
          'CC': { genotype: 'CC', impact: 'variant_absent', scoreContribution: 0.0, label: 'Variante Ausente (No Portador)', description: 'Función transportadora de cobre normal.', effectMagnitude: 'Sin variante patogénica' }
        }
      }
    ]
  },
  {
    id: 'phenylketonuria_pku_pah',
    title: 'Fenilcetonuria Clásica (PAH R408W)',
    category: 'hereditary_conditions',
    categoryLabel: 'Condiciones hereditarias',
    description: 'Estado de portador para el déficit de fenilalanina hidroxilasa (PAH), enzima encargada de convertir fenilalanina en tirosina.',
    biologicalMechanism: 'La mutación c.1222C>T (p.Arg408Trp / rs5030858) en el exón 12 produce agregación e inactivación catalítica de la enzima PAH hepática.',
    lifestyleInsights: [
      'Los portadores heterocigotos (CT) son sanos y metabolizan normalmente la fenilalanina de la dieta.',
      'En homocigotos, el diagnóstico neonatal temprano y la dieta restringida en fenilalanina previenen totalmente el daño neurológico e intelectual.',
      'Relevante para el asesoramiento reproductivo preconcepcional.'
    ],
    baselineProbability: 1.8,
    minProbability: 0,
    maxProbability: 100,
    type: 'carrier',
    inheritanceMode: 'Autosómica recesiva',
    snps: [
      {
        rsid: 'rs5030858',
        gene: 'PAH (c.1222C>T / R408W)',
        chromosome: '12',
        name: 'Fenilalanina Hidroxilasa R408W',
        evidence: 'high',
        summary: 'Variante clásica más prevalente de fenilcetonuria en poblaciones europeas.',
        scientificContext: 'La arginina 408 es fundamental para la oligomerización activa de la enzima PAH.',
        genotypes: {
          'TT': { genotype: 'TT', impact: 'variant_present', scoreContribution: 1.0, label: 'Homocigoto Mutado (Fenilcetonuria Clásica)', description: 'Pérdida casi total de actividad de fenilalanina hidroxilasa.', effectMagnitude: 'Patogénico' },
          'CT': { genotype: 'CT', impact: 'variant_present', scoreContribution: 0.5, label: 'Portador Heterocigoto Asintomático', description: 'Portador sano de un alelo mutado en PAH.', effectMagnitude: 'Portador recesivo' },
          'TC': { genotype: 'TC', impact: 'variant_present', scoreContribution: 0.5, label: 'Portador Heterocigoto Asintomático', description: 'Portador sano.', effectMagnitude: 'Portador recesivo' },
          'CC': { genotype: 'CC', impact: 'variant_absent', scoreContribution: 0.0, label: 'Genotipo Normal (No Portador)', description: 'Actividad enzimática PAH normal.', effectMagnitude: 'Sin variante patogénica' }
        }
      }
    ]
  },
  {
    id: 'hypertrophic_cardiomyopathy_mybpc3',
    title: 'Miocardiopatía Hipertrófica Familiar (MYBPC3 Arg502Gln)',
    category: 'hereditary_conditions',
    categoryLabel: 'Condiciones hereditarias',
    description: 'Predisposición monogénica al engrosamiento sarcomérico del ventrículo izquierdo e hipertrofia miocárdica asimétrica.',
    biologicalMechanism: 'La mutación c.1505G>A (rs397516035 / p.Arg502Gln) en la proteína fijadora de miosina C cardiaca altera la relajación y mecanotransducción sarcomérica.',
    lifestyleInsights: [
      'En individuos portadores se recomiendan ecocardiogramas y resonancia magnética cardiaca periódicas.',
      'Evitar deportes extenuantes de alta intensidad competitiva sin evaluación cardiológica previa.',
      'Revisión en cascada de familiares de primer grado.'
    ],
    baselineProbability: 1.0,
    minProbability: 0,
    maxProbability: 100,
    type: 'carrier',
    inheritanceMode: 'Autosómica dominante',
    snps: [
      {
        rsid: 'rs397516035',
        gene: 'MYBPC3 (c.1505G>A / R502Q)',
        chromosome: '11',
        name: 'MYBPC3 p.Arg502Gln',
        evidence: 'high',
        summary: 'Mutación fundadora frecuente causal de miocardiopatía hipertrófica hereditaria.',
        scientificContext: 'La presencia de una copia del alelo A causa desorganización miofibrilar y susceptibilidad a hipertrofia ventricular.',
        genotypes: {
          'AA': { genotype: 'AA', impact: 'variant_present', scoreContribution: 1.0, label: 'Homocigoto Portador (Alto Riesgo Estructural)', description: 'Dos copias mutadas; hipertrofia ventricular severa de inicio temprano.', effectMagnitude: 'Patogénico' },
          'GA': { genotype: 'GA', impact: 'variant_present', scoreContribution: 0.85, label: 'Portador Heterocigoto (Penetrancia Dependiente de la Edad)', description: 'Portador de la variante de miocardiopatía; requiere seguimiento cardiológico.', effectMagnitude: 'Patogénico / Dominante' },
          'AG': { genotype: 'AG', impact: 'variant_present', scoreContribution: 0.85, label: 'Portador Heterocigoto', description: 'Portador de la variante de miocardiopatía.', effectMagnitude: 'Patogénico / Dominante' },
          'GG': { genotype: 'GG', impact: 'variant_absent', scoreContribution: 0.0, label: 'Genotipo Normal (No Portador)', description: 'Estructura sarcomérica sin la mutación Arg502Gln.', effectMagnitude: 'Sin variante patogénica' }
        }
      }
    ]
  }
];
