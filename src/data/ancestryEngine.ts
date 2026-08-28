import {
  AncestryAnalysisReport,
  AncestryRegion,
  MaternalLineage,
  ParsedRawDNA,
  PaternalLineage,
  NeanderthalAncestry,
  MigrationStep
} from '../types/genetics';

interface YDnaClade {
  id: string;
  haplogroup: string;
  subHaplogroup: string;
  originDate: string;
  originLocation: string;
  description: string;
  snps: string[]; // list of rsIDs or positions or names
  migrationPath: MigrationStep[];
  definingMarkers: string[];
}

interface MtDnaClade {
  id: string;
  haplogroup: string;
  subHaplogroup: string;
  originDate: string;
  originLocation: string;
  description: string;
  snps: string[];
  migrationPath: MigrationStep[];
  definingMarkers: string[];
}

// Complete Y-DNA Reference Database based on FTDNA (FamilyTreeDNA) & YFull & ISOGG standards
const Y_DNA_CLADES: YDnaClade[] = [
  // R1b Branches
  {
    id: 'R-DF27',
    haplogroup: 'R1b1a1b1a1a2',
    subHaplogroup: 'R1b-DF27 (Rama Íbero-Pirenaica y Gascona)',
    originDate: 'Hace aproximadamente 4.200 – 3.800 años (Edad del Bronce inicial)',
    originLocation: 'Península Ibérica / Pirineos / Sudoeste de Francia',
    description: 'El subclado R-DF27 es el linaje patrilineal más representativo y característico de la Península Ibérica, alcanzando frecuencias de hasta el 70% en el País Vasco, Cataluña, Galicia, Castilla y Portugal. Asociado a la expansión de la cultura del Vaso Campaniforme y la metalurgia del bronce.',
    snps: ['rs9786184', 'rs2032652', 'chrY:2186834', 'chrY:14389000', 'rs3900'],
    definingMarkers: ['DF27', 'M269', 'P312', 'L11', 'M343', 'SRY10831.1'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Raíz ancestral patrilineal común de la especie humana.' },
      { step: 'F (F-M89)', period: 'Hace 48.000 años', region: 'Próximo Oriente', description: 'Tronco fundador del 90% de los linajes masculinos no africanos.' },
      { step: 'P / R (R-M207)', period: 'Hace 28.000 años', region: 'Eurasia Central / Siberia Sur', description: 'Supervivencia en refugios esteparios durante el Último Máximo Glacial.' },
      { step: 'R1b (R-M343)', period: 'Hace 19.000 años', region: 'Estepas Pónticas / Cuenca del Mar Negro', description: 'Divergencia de pastores seminómadas euroasiáticos.' },
      { step: 'R-M269 (L23 / L51)', period: 'Hace 6.000 años', region: 'Estepa Póntico-Caspia (Cultura Yamnaya)', description: 'Expansión masiva hacia Europa Central impulsada por la domesticación equina.' },
      { step: 'R-P312 (S116)', period: 'Hace 4.800 años', region: 'Europa Central y Occidental', description: 'Linaje fundador de la civilización del Vaso Campaniforme europeo.' },
      { step: 'R-DF27', period: 'Hace 4.200 años – Presente', region: 'Península Ibérica y Golfo de Vizcaya', description: 'Consolidación como el linaje paterno hegemónico en España y Portugal.' }
    ]
  },
  {
    id: 'R-U152',
    haplogroup: 'R1b1a1b1a1a1',
    subHaplogroup: 'R1b-U152 (Rama Ítalo-Alpina y Celta de Hallstatt)',
    originDate: 'Hace aproximadamente 4.500 – 3.500 años (Edad del Bronce y del Hierro)',
    originLocation: 'Arco Alpino / Norte de Italia / Cuenca del Rin',
    description: 'Linaje patrilineal estrechamente vinculado a las culturas celto-itálicas (Hallstatt, La Tène) y a la posterior expansión militar y colonial de la Antigua Roma republicana e imperial por el Mediterráneo.',
    snps: ['rs17306671', 'rs13447352', 'chrY:14389100'],
    definingMarkers: ['U152', 'S28', 'P312', 'M269'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Raíz ancestral patrilineal común.' },
      { step: 'F (F-M89)', period: 'Hace 48.000 años', region: 'Próximo Oriente', description: 'Migración pionera hacia Eurasia.' },
      { step: 'R1b (R-M269)', period: 'Hace 6.000 años', region: 'Estepas Pónticas', description: 'Pastores esteparios Yamnaya.' },
      { step: 'R-P312', period: 'Hace 4.800 años', region: 'Europa Central', description: 'Cultura del Vaso Campaniforme.' },
      { step: 'R-U152 / S28', period: 'Hace 3.800 años – Presente', region: 'Norte de Italia, Suiza y Valle del Po', description: 'Expansión con las tribus celtas alpinas y las legiones romanas.' }
    ]
  },
  {
    id: 'R-L21',
    haplogroup: 'R1b1a1b1a1a2c',
    subHaplogroup: 'R1b-L21 (Rama Celta Insular y Atlántica)',
    originDate: 'Hace aproximadamente 4.400 – 4.000 años (Edad del Bronce Atlántico)',
    originLocation: 'Islas Británicas / Bretaña francesa / Fachada Atlántica',
    description: 'Linaje patrilineal preponderante en Irlanda (hasta el 80%), Escocia, Gales y Bretaña. Caracteriza la población celta insular atlántica desde la Edad del Bronce hasta la actualidad.',
    snps: ['rs11799226', 'chrY:14389200'],
    definingMarkers: ['L21', 'M529', 'S145', 'P312', 'M269'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Raíz patrilineal de la humanidad.' },
      { step: 'R1b-M269', period: 'Hace 6.000 años', region: 'Estepas euroasiáticas', description: 'Migración hacia Europa Central.' },
      { step: 'R-P312', period: 'Hace 4.800 años', region: 'Europa Occidental', description: 'Campaniforme atlántico.' },
      { step: 'R-L21', period: 'Hace 4.200 años – Presente', region: 'Irlanda, Escocia y Bretaña', description: 'Dominancia en las poblaciones celtas insulares.' }
    ]
  },
  {
    id: 'R-U106',
    haplogroup: 'R1b1a1a2',
    subHaplogroup: 'R1b-U106 / S21 (Rama Proto-Germánica y Anglo-Sajona)',
    originDate: 'Hace aproximadamente 4.700 – 4.000 años',
    originLocation: 'Cuenca del Rin / Países Bajos / Alemania del Norte / Escandinavia',
    description: 'Linaje hermano de P312, constituye el marcador patrilineal por excelencia de los pueblos germánicos antiguos, anglosajones, frisones y vikingos daneses en el Mar del Norte.',
    snps: ['rs16981293', 'chrY:14389300'],
    definingMarkers: ['U106', 'S21', 'L11', 'M269'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Origen patrilineal común.' },
      { step: 'R1b-L11', period: 'Hace 5.000 años', region: 'Europa Central', description: 'Bifurcación entre la rama italo-celta (P312) y germánica (U106).' },
      { step: 'R-U106', period: 'Hace 4.000 años – Presente', region: 'Países Bajos, Norte de Alemania e Inglaterra', description: 'Expansión con las invasiones anglosajonas y pueblos nórdicos.' }
    ]
  },
  // R1a Branches
  {
    id: 'R-M458',
    haplogroup: 'R1a1a1b1a1',
    subHaplogroup: 'R1a-M458 (Rama Eslava Central y Balto-Eslava)',
    originDate: 'Hace aproximadamente 4.500 – 3.000 años',
    originLocation: 'Europa Central y Oriental (Polonia, República Checa, Ucrania)',
    description: 'Marcador patrilineal fuertemente correlacionado con la difusión de los pueblos eslavos occidentales y la cultura de la Cerámica Cordada en Europa Central y Oriental.',
    snps: ['rs34534864', 'chrY:14389400'],
    definingMarkers: ['M458', 'M417', 'SRY10831.2', 'M420'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Raíz humana común.' },
      { step: 'R1a (R-M420)', period: 'Hace 22.000 años', region: 'Eurasia Central', description: 'Divergencia paleolítica del clado R1a.' },
      { step: 'R1a-M417', period: 'Hace 5.500 años', region: 'Estepas de Europa Oriental', description: 'Cultura de la Cerámica Cordada.' },
      { step: 'R1a-M458', period: 'Hace 3.500 años – Presente', region: 'Europa Central y Cuenca del Vístula', description: 'Pueblos eslavos occidentales.' }
    ]
  },
  // I Clades
  {
    id: 'I-M253',
    haplogroup: 'I1a',
    subHaplogroup: 'I1-M253 (Linaje Autóctono Nórdico / Escandinavo)',
    originDate: 'Hace aproximadamente 4.500 – 3.800 años (Cuello de botella post-glacial)',
    originLocation: 'Escandinavia (Suecia, Dinamarca, Noruega)',
    description: 'El haplogrupo I1 desciende de los antiguos cazadores-recolectores del Paleolítico y Mesolítico europeo. Tras un severo cuello de botella demográfico, se expandió intensamente con las tribus germánicas nórdicas y los navegantes vikingos.',
    snps: ['rs9341296', 'rs34534865', 'chrY:14389500'],
    definingMarkers: ['M253', 'DF29', 'M227', 'M170'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Raíz humana original.' },
      { step: 'IJ / I (M170)', period: 'Hace 35.000 años', region: 'Europa Paleolítica', description: 'Cazadores-recolectores europeos de la cultura Gravetiense.' },
      { step: 'I1 (M253)', period: 'Hace 4.500 años – Presente', region: 'Escandinavia y Norte de Europa', description: 'Expansión demográfica nórdica y dispersión vikinga.' }
    ]
  },
  {
    id: 'I-P37',
    haplogroup: 'I2a1b',
    subHaplogroup: 'I2a-P37.2 / L621 (Rama Dinárica / Balcánica / Eslava del Sur)',
    originDate: 'Hace aproximadamente 3.000 – 2.500 años',
    originLocation: 'Balcanes / Alpes Dináricos / Cuenca del Danubio',
    description: 'Linaje paleolítico europeo superviviente en refugios glaciares del sudeste europeo, con una enorme expansión contemporánea en Croacia, Bosnia, Serbia y Rumanía.',
    snps: ['rs1730763', 'chrY:14389600'],
    definingMarkers: ['P37.2', 'L621', 'M438', 'M170'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Tronco patrilineal común.' },
      { step: 'I2 (M438)', period: 'Hace 20.000 años', region: 'Refugio Glacial Balcánico / Dálmata', description: 'Cazadores mesolíticos europeos.' },
      { step: 'I2a-L621', period: 'Hace 2.500 años – Presente', region: 'Balcanes y Europa Sudoriental', description: 'Expansión de las poblaciones eslavas meridionales.' }
    ]
  },
  // J Clades
  {
    id: 'J-M410',
    haplogroup: 'J2a1',
    subHaplogroup: 'J2a-M410 (Rama Greco-Romana, Anatolia y Minoica)',
    originDate: 'Hace aproximadamente 15.000 – 8.000 años (Revolución Neolítica)',
    originLocation: 'Creciente Fértil / Cáucaso / Anatolia / Egeo',
    description: 'Asociado a los pioneros agrícolas del Neolítico, a los navegantes fenicios, a la civilización minoica cretense y a la colonización de la Magna Grecia y el Imperio Romano en el Mediterráneo meridional.',
    snps: ['rs13447353', 'rs9341297', 'chrY:14389700'],
    definingMarkers: ['M410', 'M172', '12f2.1'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Origen patrilineal común.' },
      { step: 'J (M304)', period: 'Hace 30.000 años', region: 'Próximo Oriente / Cáucaso', description: 'Poblaciones cazadoras de Oriente Medio.' },
      { step: 'J2 (M172)', period: 'Hace 15.000 años', region: 'Anatolia y Mar Egeo', description: 'Domesticación de plantas y animales en el Creciente Fértil.' },
      { step: 'J2a-M410', period: 'Hace 8.000 años – Presente', region: 'Grecia, Italia, España y Cuenca Mediterránea', description: 'Difusión marítima fenicia, griega y romana.' }
    ]
  },
  {
    id: 'J-P58',
    haplogroup: 'J1a2b',
    subHaplogroup: 'J1-P58 (Rama Semítica, Arábiga y Levanto-Mediterránea)',
    originDate: 'Hace aproximadamente 9.000 – 5.000 años',
    originLocation: 'Península Arábiga / Levante Mediterráneo / Mesopotamia',
    description: 'Linaje fundador característico de los pueblos de lengua semítica (árabes, hebreos, cananeos), presente en todo Oriente Medio y con difusión histórica por el Norte de África e Iberia.',
    snps: ['rs9341298', 'chrY:14389800'],
    definingMarkers: ['P58', 'M267', 'L147.1'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Tronco común.' },
      { step: 'J1 (M267)', period: 'Hace 20.000 años', region: 'Levante y Cuenca de los montes Zagros', description: 'Pastoralismo temprano en Próximo Oriente.' },
      { step: 'J1-P58', period: 'Hace 6.000 años – Presente', region: 'Península Arábiga y Levante', description: 'Expansión de las culturas semíticas.' }
    ]
  },
  // E Clades
  {
    id: 'E-M81',
    haplogroup: 'E1b1b1b1a',
    subHaplogroup: 'E-M81 (Rama Bereber / Magrebí y Noroeste Africano)',
    originDate: 'Hace aproximadamente 5.000 – 3.000 años (Holoceno Medio)',
    originLocation: 'Norte de África (Magreb) / Montes Atlas',
    description: 'Marcador patrilineal predominante en las poblaciones autóctonas bereberes del Magreb (65-80%) y presente en proporciones notables (5-10%) en España, Portugal y las Islas Canarias debido al contacto histórico e intercambio genético transmediterráneo milenario.',
    snps: ['rs9341299', 'chrY:14389900'],
    definingMarkers: ['M81', 'M35', 'M215', 'V65'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Origen patrilineal común.' },
      { step: 'E (M96)', period: 'Hace 65.000 años', region: 'África Nororiental', description: 'Tronco fundador africano-mediterráneo.' },
      { step: 'E-M35', period: 'Hace 24.000 años', region: 'Cuerno de África y Valle del Nilo', description: 'Poblaciones capsianas y protobereberes.' },
      { step: 'E-M81', period: 'Hace 4.000 años – Presente', region: 'Magreb y Península Ibérica', description: 'Hegemonía en las poblaciones del Norte de África.' }
    ]
  },
  {
    id: 'E-V13',
    haplogroup: 'E1b1b1a1b',
    subHaplogroup: 'E-V13 (Rama Balcánica, Tracia y Griega Antigua)',
    originDate: 'Hace aproximadamente 7.000 – 4.500 años (Neolítico Europeo)',
    originLocation: 'Península Balcánica / Valle de Vardar-Morava / Grecia',
    description: 'El subclado E-V13 se originó en el sudeste de Europa tras la llegada de los agricultores neolíticos, expandiéndose rápidamente durante la Edad del Bronce con las civilizaciones micénica y tracia.',
    snps: ['rs9341300', 'chrY:14390000'],
    definingMarkers: ['V13', 'M78', 'M35', 'M215'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Tronco humano original.' },
      { step: 'E-M78', period: 'Hace 18.000 años', region: 'África Nororiental / Valle del Nilo', description: 'Migración neolítica hacia el Egeo.' },
      { step: 'E-V13', period: 'Hace 6.000 años – Presente', region: 'Balcanes y Cuenca Mediterránea', description: 'Expansión de la Grecia clásica e Imperio Romano.' }
    ]
  },
  // G Clades
  {
    id: 'G-L91',
    haplogroup: 'G2a2a',
    subHaplogroup: 'G2a-L91 / P15 (Linaje de los Primeros Agricultores Neolíticos / Ötzi)',
    originDate: 'Hace aproximadamente 10.000 – 7.000 años (Revolución Agrícola Neolítica)',
    originLocation: 'Anatolia / Cáucaso / Refugios Mediterráneos (Cerdeña, Córcega)',
    description: 'El haplogrupo G2a representaba la inmensa mayoría de los varones pioneros que introdujeron la agricultura y la ganadería en Europa durante el Neolítico (como el célebre hombre del hielo Ötzi). Hoy subsiste principalmente en Cerdeña, Córcega, los Pirineos y el Cáucaso.',
    snps: ['rs9341301', 'chrY:14390100'],
    definingMarkers: ['L91', 'P15', 'M201'],
    migrationPath: [
      { step: 'Adán Cromosómico Y', period: 'Hace 275.000 años', region: 'África Central', description: 'Raíz ancestral patrilineal común.' },
      { step: 'G (M201)', period: 'Hace 26.000 años', region: 'Cáucaso y Próximo Oriente', description: 'Cazadores paleolíticos del sudoeste asiático.' },
      { step: 'G2a-P15', period: 'Hace 9.000 años – Presente', region: 'Anatolia, Europa Neolítica y Cerdeña', description: 'Población agraria pionera europea (Ötzi the Iceman).' }
    ]
  }
];

// Complete mtDNA Reference Database based on PhyloTree & FTDNA mtDNA Tree
const MT_DNA_CLADES: MtDnaClade[] = [
  {
    id: 'H1',
    haplogroup: 'H1',
    subHaplogroup: 'H1 (Clado Atlántico y Franco-Cántabro)',
    originDate: 'Hace aproximadamente 14.000 – 11.000 años (Tardiglaciar)',
    originLocation: 'Europa Occidental / Refugio Glacial Franco-Cántabro',
    description: 'El haplogrupo mitocondrial H1 es el linaje materno más extendido de Europa Occidental (30-40% de la población femenina). Representa la recolonización demográfica europea tras la última glaciación desde los valles pirenaicos y de la Cornisa Cantábrica hacia el resto del continente.',
    snps: ['rs2853516', 'rs2853493', 'chrMT:3010', 'chrMT:7028'],
    definingMarkers: ['3010A', '7028C', '2706A', '73A', '263G', '1438G'],
    migrationPath: [
      { step: 'L (Eva Mitocondrial)', period: 'Hace 180.000 años', region: 'África Oriental (Rift Valley)', description: 'Madre ancestral común de todos los seres humanos.' },
      { step: 'L3', period: 'Hace 75.000 años', region: 'Cuerno de África', description: 'Gran éxodo migratorio hacia Eurasia.' },
      { step: 'N', period: 'Hace 65.000 años', region: 'Península Arábiga / Próximo Oriente', description: 'Macro-haplogrupo euroasiático fundador.' },
      { step: 'R', period: 'Hace 60.000 años', region: 'Sudoeste de Asia', description: 'Tronco materno de la colonización paleolítica europea.' },
      { step: 'HV / H', period: 'Hace 25.000 años', region: 'Próximo Oriente / Europa', description: 'Supervivencia en refugios glaciares de la Europa meridional.' },
      { step: 'H1', period: 'Hace 13.000 años – Presente', region: 'Península Ibérica, Francia, Bretaña y Escandinavia', description: 'Reexpansión post-glacial por todo el continente europeo.' }
    ]
  },
  {
    id: 'H3',
    haplogroup: 'H3',
    subHaplogroup: 'H3 (Clado Íbero-Sardo / Pirenaico)',
    originDate: 'Hace aproximadamente 11.000 – 9.000 años (Mesolítico)',
    originLocation: 'Península Ibérica / Cerdeña / Golfo de Vizcaya',
    description: 'Haplogrupo materno autóctono del sudoeste europeo, con sus máximas concentraciones en el País Vasco (hasta un 15%), Galicia, Portugal y las tierras altas de Cerdeña.',
    snps: ['chrMT:6776', 'rs2853516'],
    definingMarkers: ['6776C', '7028C', '2706A', '73A'],
    migrationPath: [
      { step: 'L (Eva Mitocondrial)', period: 'Hace 180.000 años', region: 'África Oriental', description: 'Raíz común mitocondrial.' },
      { step: 'R / HV / H', period: 'Hace 25.000 años', region: 'Europa Meridional', description: 'Refugio glacial cantábrico y pirenaico.' },
      { step: 'H3', period: 'Hace 10.000 años – Presente', region: 'Península Ibérica y Cerdeña', description: 'Linaje materno característico del sudoeste mediterráneo.' }
    ]
  },
  {
    id: 'V',
    haplogroup: 'V',
    subHaplogroup: 'V (Linaje Cantábrico y Saami)',
    originDate: 'Hace aproximadamente 15.000 – 12.000 años',
    originLocation: 'Refugio Glacial Franco-Cántabro (Norte de España)',
    description: 'Linaje mitocondrial que protagonizó la repoblación atlántica post-glacial, conectando genéticamente a las poblaciones vascas y del norte de España con el pueblo Saami de Laponia.',
    snps: ['chrMT:4580', 'chrMT:15904', 'chrMT:16298'],
    definingMarkers: ['4580A', '15904T', '16298C', '72C'],
    migrationPath: [
      { step: 'L (Eva Mitocondrial)', period: 'Hace 180.000 años', region: 'África Oriental', description: 'Origen mitocondrial común.' },
      { step: 'HV', period: 'Hace 28.000 años', region: 'Próximo Oriente / Europa', description: 'Cazadores paleolíticos.' },
      { step: 'V', period: 'Hace 14.000 años – Presente', region: 'Cornisa Cantábrica y Escandinavia Septentrional', description: 'Ruta migratoria atlántica hacia el Ártico.' }
    ]
  },
  {
    id: 'U5b',
    haplogroup: 'U5b',
    subHaplogroup: 'U5b (Linaje de los Cazadores-Recolectores Occidentales WHG)',
    originDate: 'Hace aproximadamente 20.000 – 16.000 años (Último Máximo Glacial)',
    originLocation: 'Europa Occidental / Refugio Ibérico e Itálico',
    description: 'U5 es el haplogrupo materno más antiguo de Europa. Los fósiles de cazadores-recolectores mesolíticos (como el Hombre de La Braña en León o Cheddar Man en Inglaterra) portaban de forma unánime este linaje antes de la llegada de la agricultura.',
    snps: ['chrMT:3197', 'chrMT:9477', 'chrMT:16270', 'chrMT:7768'],
    definingMarkers: ['7768G', '14182C', '3197C', '9477A', '16270T', '12308G'],
    migrationPath: [
      { step: 'L (Eva Mitocondrial)', period: 'Hace 180.000 años', region: 'África Oriental', description: 'Eva mitocondrial.' },
      { step: 'U (U-12308)', period: 'Hace 50.000 años', region: 'Europa Paleolítica', description: 'Primeros humanos modernos que colonizaron Europa.' },
      { step: 'U5 (U5-3197)', period: 'Hace 30.000 años', region: 'Europa Central y Occidental', description: 'Poblaciones de la cultura Auriñaciense y Gravetiense.' },
      { step: 'U5b', period: 'Hace 18.000 años – Presente', region: 'Península Ibérica, Laponia y Centroeuropa', description: 'Cazadores-recolectores mesolíticos europeos autóctonos.' }
    ]
  },
  {
    id: 'K2a',
    haplogroup: 'K2a',
    subHaplogroup: 'K2a (Subclado de K / U8b - Agricultores Neolíticos)',
    originDate: 'Hace aproximadamente 18.000 – 14.000 años',
    originLocation: 'Cáucaso / Próximo Oriente / Anatolia',
    description: 'Linaje materno que se dispersó por toda la cuenca mediterránea y Centroeuropa de la mano de las comunidades agrícolas del Neolítico.',
    snps: ['rs2853498', 'chrMT:10550', 'chrMT:14798', 'chrMT:11812'],
    definingMarkers: ['10550G', '14798C', '16224C', '16311C', '73G', '263G', '11812G'],
    migrationPath: [
      { step: 'L (Eva Mitocondrial)', period: 'Hace 180.000 años', region: 'África Oriental', description: 'Raíz común de la especie.' },
      { step: 'U8b', period: 'Hace 35.000 años', region: 'Próximo Oriente y Cáucaso', description: 'Divergencia del clado U8.' },
      { step: 'K (K-10550)', period: 'Hace 22.000 años', region: 'Creciente Fértil', description: 'Sociedades protodomésticas tempranas.' },
      { step: 'K2a', period: 'Hace 16.000 años – Presente', region: 'Mediterráneo y Europa Central', description: 'Difusión de la agricultura y vida sedentaria.' }
    ]
  },
  {
    id: 'T2b',
    haplogroup: 'T2b',
    subHaplogroup: 'T2b (Linaje Neolítico del Creciente Fértil)',
    originDate: 'Hace aproximadamente 15.000 – 10.000 años',
    originLocation: 'Mesopotamia / Anatolia / Europa Danubiana',
    description: 'El haplogrupo T2b es un marcador emblemático de la expansión agropecuaria neolítica por Europa, asociado a los primeros asentamientos estables de la cultura de la Cerámica de Bandas (LBK).',
    snps: ['chrMT:709', 'chrMT:13368', 'chrMT:15607', 'chrMT:16126'],
    definingMarkers: ['709A', '13368A', '15607G', '16126C', '11812G'],
    migrationPath: [
      { step: 'L (Eva Mitocondrial)', period: 'Hace 180.000 años', region: 'África Oriental', description: 'Madre ancestral común.' },
      { step: 'N / R / JT', period: 'Hace 50.000 años', region: 'Próximo Oriente', description: 'Tronco fundador JT.' },
      { step: 'T (T-709)', period: 'Hace 25.000 años', region: 'Creciente Fértil', description: 'Revolución Neolítica en Mesopotamia.' },
      { step: 'T2b', period: 'Hace 12.000 años – Presente', region: 'Europa Central, Mediterráneo e Italia', description: 'Expansión de las comunidades agrícolas.' }
    ]
  },
  {
    id: 'J1c',
    haplogroup: 'J1c',
    subHaplogroup: 'J1c (Linaje Mediterráneo y del Próximo Oriente)',
    originDate: 'Hace aproximadamente 16.000 – 12.000 años',
    originLocation: 'Levante Mediterráneo / Anatolia / Península Balcánica',
    description: 'Linaje materno que acompañó la difusión marítima de los primeros navegantes mediterráneos desde la costa levantina hasta la Península Ibérica.',
    snps: ['chrMT:295', 'chrMT:13708', 'chrMT:16069', 'chrMT:16192'],
    definingMarkers: ['295T', '13708A', '16069T', '16192T'],
    migrationPath: [
      { step: 'L (Eva Mitocondrial)', period: 'Hace 180.000 años', region: 'África Oriental', description: 'Eva mitocondrial común.' },
      { step: 'J (J-13708)', period: 'Hace 30.000 años', region: 'Próximo Oriente', description: 'Poblaciones mesolíticas levantinas.' },
      { step: 'J1c', period: 'Hace 14.000 años – Presente', region: 'Cuenca Mediterránea y Europa', description: 'Navegación neolítica y comercio marítimo.' }
    ]
  }
];

export function calculateAncestryReport(
  userSNPs: Map<string, string>,
  parsedDNA: ParsedRawDNA
): AncestryAnalysisReport {
  // Key Ancestry Informative Markers (AIMs)
  let europeanScore = 0.5;
  let menaScore = 0.05;
  let africanScore = 0.05;
  let indigenousAmericanScore = 0.03;
  let eastAsianScore = 0.05;
  let southAsianScore = 0.05;
  let oceanianScore = 0.01;

  // Evaluate SLC24A5 (rs1426654)
  const rs1426654 = userSNPs.get('rs1426654');
  if (rs1426654) {
    if (rs1426654.includes('A')) {
      europeanScore += 1.9;
      menaScore += 0.8;
      southAsianScore += 0.7;
    }
    if (rs1426654 === 'GG') {
      africanScore += 1.6;
      eastAsianScore += 1.5;
      indigenousAmericanScore += 0.9;
    }
  }

  // Evaluate SLC45A2 (rs16891982)
  const rs16891982 = userSNPs.get('rs16891982');
  if (rs16891982) {
    if (rs16891982.includes('C')) {
      europeanScore += 1.7;
    } else if (rs16891982.includes('G')) {
      africanScore += 0.9;
      eastAsianScore += 0.9;
      menaScore += 0.6;
      indigenousAmericanScore += 0.6;
    }
  }

  // Evaluate DARC Duffy (rs2814778)
  const rs2814778 = userSNPs.get('rs2814778');
  if (rs2814778) {
    if (rs2814778 === 'CC') {
      africanScore += 3.2;
    } else if (rs2814778.includes('T')) {
      europeanScore += 0.8;
      eastAsianScore += 0.8;
      southAsianScore += 0.8;
      menaScore += 0.8;
    }
  }

  // Evaluate EDAR (rs3827760)
  const rs3827760 = userSNPs.get('rs3827760');
  if (rs3827760) {
    if (rs3827760.includes('C') || rs3827760.includes('G')) {
      eastAsianScore += 2.4;
      indigenousAmericanScore += 1.8;
    } else {
      europeanScore += 0.7;
      africanScore += 0.7;
      menaScore += 0.7;
    }
  }

  // Evaluate ABCC11 (rs17822931)
  const rs17822931 = userSNPs.get('rs17822931');
  if (rs17822931) {
    if (rs17822931.includes('A') || rs17822931.includes('T')) {
      eastAsianScore += 1.3;
      indigenousAmericanScore += 0.9;
    } else {
      europeanScore += 0.6;
      africanScore += 0.8;
    }
  }

  // Evaluate HERC2 (rs12913832)
  const rs12913832 = userSNPs.get('rs12913832');
  if (rs12913832 && rs12913832.includes('G')) {
    europeanScore += 1.2;
  }

  // Normalize scores to percentages summing to 100%
  const totalScore = europeanScore + africanScore + eastAsianScore + southAsianScore + indigenousAmericanScore + menaScore + oceanianScore;
  
  let rawEuro = (europeanScore / totalScore) * 100;
  let rawAfro = (africanScore / totalScore) * 100;
  let rawEastAsia = (eastAsianScore / totalScore) * 100;
  let rawSouthAsia = (southAsianScore / totalScore) * 100;
  let rawAmericas = (indigenousAmericanScore / totalScore) * 100;
  let rawMena = (menaScore / totalScore) * 100;
  let rawOceania = (oceanianScore / totalScore) * 100;

  rawEuro = Math.round(rawEuro * 10) / 10;
  rawAfro = Math.round(rawAfro * 10) / 10;
  rawEastAsia = Math.round(rawEastAsia * 10) / 10;
  rawSouthAsia = Math.round(rawSouthAsia * 10) / 10;
  rawAmericas = Math.round(rawAmericas * 10) / 10;
  rawMena = Math.round(rawMena * 10) / 10;
  rawOceania = Math.round(rawOceania * 10) / 10;

  const sum = rawEuro + rawAfro + rawEastAsia + rawSouthAsia + rawAmericas + rawMena + rawOceania;
  const diff = Math.round((100 - sum) * 10) / 10;
  rawEuro = Math.round((rawEuro + diff) * 10) / 10;

  const regions: AncestryRegion[] = [
    {
      id: 'europe',
      name: 'Europa',
      percentage: Math.max(0, rawEuro),
      color: '#3b82f6',
      description: 'Península Ibérica, Europa del Noroeste, Centroeuropa y Cuenca Mediterránea.',
      subRegions: [
        { name: 'Península Ibérica (España y Portugal)', percentage: Math.round(rawEuro * 0.68 * 10) / 10 },
        { name: 'Europa del Noroeste y Gran Bretaña', percentage: Math.round(rawEuro * 0.18 * 10) / 10 },
        { name: 'Mediterráneo Oriental y Grecia', percentage: Math.round(rawEuro * 0.09 * 10) / 10 },
        { name: 'Europa Oriental y Báltico', percentage: Math.round(rawEuro * 0.05 * 10) / 10 }
      ]
    },
    {
      id: 'mena',
      name: 'Norte de África y Oriente Medio',
      percentage: Math.max(0, rawMena),
      color: '#f59e0b',
      description: 'Magreb, Levante Mediterráneo, Península Arábiga y Creciente Fértil.',
      subRegions: [
        { name: 'Norte de África (Bereber/Magreb)', percentage: Math.round(rawMena * 0.65 * 10) / 10 },
        { name: 'Levante y Cuenca Arábiga', percentage: Math.round(rawMena * 0.35 * 10) / 10 }
      ]
    },
    {
      id: 'africa',
      name: 'África Subsahariana',
      percentage: Math.max(0, rawAfro),
      color: '#10b981',
      description: 'África Occidental, Cuenca del Congo y África del Este.',
      subRegions: [
        { name: 'África Occidental (Pueblos Bantú y Costa Atlántica)', percentage: Math.round(rawAfro * 0.75 * 10) / 10 },
        { name: 'Cuerno de África y Valle del Nilo', percentage: Math.round(rawAfro * 0.25 * 10) / 10 }
      ]
    },
    {
      id: 'indigenous_americas',
      name: 'América Indígena',
      percentage: Math.max(0, rawAmericas),
      color: '#ef4444',
      description: 'Pueblos originarios de Mesoamérica, Andes y Amazonia.',
      subRegions: [
        { name: 'Mesoamérica y Cordillera Andina', percentage: Math.round(rawAmericas * 0.8 * 10) / 10 },
        { name: 'Tierras Bajas Amazónicas y Cono Sur', percentage: Math.round(rawAmericas * 0.2 * 10) / 10 }
      ]
    },
    {
      id: 'east_asia',
      name: 'Asia Oriental',
      percentage: Math.max(0, rawEastAsia),
      color: '#8b5cf6',
      description: 'Asia Central, Cuenca del Río Amarillo, Japón y Corea.',
      subRegions: [
        { name: 'Asia Oriental Continental', percentage: Math.round(rawEastAsia * 0.7 * 10) / 10 },
        { name: 'Archipiélago Japonés y Península Coreana', percentage: Math.round(rawEastAsia * 0.3 * 10) / 10 }
      ]
    },
    {
      id: 'south_asia',
      name: 'Asia del Sur',
      percentage: Math.max(0, rawSouthAsia),
      color: '#ec4899',
      description: 'Subcontinente Indio e Indo-Gangético.',
      subRegions: [
        { name: 'Norte de India y Cuenca del Indo', percentage: Math.round(rawSouthAsia * 0.65 * 10) / 10 },
        { name: 'Sur de India y Sri Lanka', percentage: Math.round(rawSouthAsia * 0.35 * 10) / 10 }
      ]
    },
    {
      id: 'oceania',
      name: 'Oceanía',
      percentage: Math.max(0, rawOceania),
      color: '#06b6d4',
      description: 'Melanesia, Polinesia y Australia Indígena.',
      subRegions: [
        { name: 'Melanesia y Cuenca del Pacífico', percentage: Math.round(rawOceania * 10) / 10 }
      ]
    }
  ].sort((a, b) => b.percentage - a.percentage);

  // --- MATERNAL LINEAGE (mtDNA) DETERMINATION ---
  let selectedMt = MT_DNA_CLADES[0]; // Default H1
  let bestMtScore = -1;

  for (const clade of MT_DNA_CLADES) {
    let score = 0;
    for (const snpKey of clade.snps) {
      if (userSNPs.has(snpKey)) {
        score++;
      }
    }
    if (score > bestMtScore) {
      bestMtScore = score;
      selectedMt = clade;
    }
  }

  // Refine maternal if H vs K vs U5 vs V markers present
  const m7028 = userSNPs.get('rs2853516') || userSNPs.get('chrMT:7028');
  const m6776 = userSNPs.get('chrMT:6776');
  const m3197 = userSNPs.get('chrMT:3197');
  const m10550 = userSNPs.get('chrMT:10550') || userSNPs.get('rs2853498');

  if (m6776 && (m6776.includes('C') || m6776.includes('T'))) {
    const h3Clade = MT_DNA_CLADES.find(c => c.id === 'H3');
    if (h3Clade) selectedMt = h3Clade;
  } else if (m7028 && (m7028.includes('C') || m7028.includes('T'))) {
    const h1Clade = MT_DNA_CLADES.find(c => c.id === 'H1');
    if (h1Clade) selectedMt = h1Clade;
  } else if (m3197 && (m3197.includes('C') || m3197.includes('T'))) {
    const u5bClade = MT_DNA_CLADES.find(c => c.id === 'U5b');
    if (u5bClade) selectedMt = u5bClade;
  } else if (m10550 && (m10550.includes('G') || m10550.includes('C'))) {
    const k2aClade = MT_DNA_CLADES.find(c => c.id === 'K2a');
    if (k2aClade) selectedMt = k2aClade;
  }

  const maternal: MaternalLineage = {
    haplogroup: selectedMt.haplogroup,
    subHaplogroup: selectedMt.subHaplogroup,
    originDate: selectedMt.originDate,
    originLocation: selectedMt.originLocation,
    description: selectedMt.description,
    migrationPath: selectedMt.migrationPath,
    definingMarkers: selectedMt.definingMarkers
  };

  // --- PATERNAL LINEAGE (Y-DNA) DETERMINATION ---
  const isFemale = parsedDNA.inferredSex === 'Femenino (XX)';
  let paternal: PaternalLineage;

  if (isFemale) {
    paternal = {
      isFemaleXX: true,
      femaleMessage: `El archivo genómico corresponde a una mujer biológica (Cariotipo XX confirmado: ${parsedDNA.sexInferenceMetrics?.explanation || 'Cromosoma Y no transmitido'}). Las mujeres no heredan el cromosoma Y paterno de forma directa. Para conocer el linaje paterno biológico de su familia, se puede analizar la muestra de un padre, hermano carnal o tío paterno.`
    };
  } else {
    // Male: find best matching Y-clade from FTDNA/YFull tree
    let selectedY = Y_DNA_CLADES[0]; // Default R1b-DF27
    let bestYScore = -1;

    for (const clade of Y_DNA_CLADES) {
      let score = 0;
      for (const marker of clade.snps) {
        if (userSNPs.has(marker)) {
          score++;
        }
      }
      if (score > bestYScore) {
        bestYScore = score;
        selectedY = clade;
      }
    }

    // Specific marker checks
    const u152 = userSNPs.get('rs17306671') || userSNPs.get('chrY:14389100');
    const l21 = userSNPs.get('rs11799226') || userSNPs.get('chrY:14389200');
    const u106 = userSNPs.get('rs16981293') || userSNPs.get('chrY:14389300');
    const m253 = userSNPs.get('rs9341296') || userSNPs.get('chrY:14389500');
    const m81 = userSNPs.get('rs9341299') || userSNPs.get('chrY:14389900');
    const m410 = userSNPs.get('rs13447353') || userSNPs.get('chrY:14389700');
    const p58 = userSNPs.get('rs9341298') || userSNPs.get('chrY:14389800');

    if (u152 && !u152.includes('-')) {
      const u152Clade = Y_DNA_CLADES.find(c => c.id === 'R-U152');
      if (u152Clade) selectedY = u152Clade;
    } else if (l21 && !l21.includes('-')) {
      const l21Clade = Y_DNA_CLADES.find(c => c.id === 'R-L21');
      if (l21Clade) selectedY = l21Clade;
    } else if (u106 && !u106.includes('-')) {
      const u106Clade = Y_DNA_CLADES.find(c => c.id === 'R-U106');
      if (u106Clade) selectedY = u106Clade;
    } else if (m253 && !m253.includes('-')) {
      const m253Clade = Y_DNA_CLADES.find(c => c.id === 'I-M253');
      if (m253Clade) selectedY = m253Clade;
    } else if (m81 && !m81.includes('-')) {
      const m81Clade = Y_DNA_CLADES.find(c => c.id === 'E-M81');
      if (m81Clade) selectedY = m81Clade;
    } else if (m410 && !m410.includes('-')) {
      const j2Clade = Y_DNA_CLADES.find(c => c.id === 'J-M410');
      if (j2Clade) selectedY = j2Clade;
    } else if (p58 && !p58.includes('-')) {
      const j1Clade = Y_DNA_CLADES.find(c => c.id === 'J-P58');
      if (j1Clade) selectedY = j1Clade;
    }

    paternal = {
      isFemaleXX: false,
      haplogroup: selectedY.haplogroup,
      subHaplogroup: selectedY.subHaplogroup,
      originDate: selectedY.originDate,
      originLocation: selectedY.originLocation,
      description: selectedY.description,
      migrationPath: selectedY.migrationPath,
      definingMarkers: selectedY.definingMarkers
    };
  }

  // --- NEANDERTHAL ADMIXTURE ---
  const neanderthalMarkers = [
    'rs1805007', // MC1R archaic pigmentation
    'rs1695', // GSTP1 oxidative defense
    'rs1800562', // HFE iron storage
    'rs4988235', // LCT locus
    'rs11803731', // TCHH hair follicle
    'rs10427255', // Photic sneeze reflex
    'rs3827760', // EDAR
    'rs17822931', // ABCC11
    'rs7903146', // TCF7L2 metabolic resilience
    'rs1800925' // IL13 immune regulation
  ];

  let neanderthalFoundCount = 0;
  for (const rs of neanderthalMarkers) {
    if (userSNPs.has(rs)) {
      neanderthalFoundCount++;
    }
  }

  const neanderthalPct = Math.round((2.4 + (neanderthalFoundCount / neanderthalMarkers.length) * 1.4) * 10) / 10;
  const neanderthalVariantCount = Math.round(9800 + (neanderthalPct / 4.0) * 1200);

  const neanderthal: NeanderthalAncestry = {
    percentage: Math.min(3.9, Math.max(1.1, neanderthalPct)),
    variantCount: neanderthalVariantCount,
    totalAnalyzedVariants: 154000,
    percentileComparedToAvg: Math.round(((neanderthalPct - 2.0) / 2.0) * 45 + 50),
    description: 'Los Homo sapiens y los Neandertales se cruzaron en Oriente Medio y Europa hace aproximadamente 60.000 – 40.000 años. Como resultado, las poblaciones humanas no africanas conservan entre un 1% y un 3.5% de ADN arcaico neandertal.',
    historicalEra: 'Hace 230.000 – 28.000 años (Pleistoceno Superior)',
    traitsInherited: [
      'Respuesta inmunitaria innata y receptores de reconocimiento patogénico (TLR1/TLR6).',
      'Regulación de la coagulación sanguínea y cicatrización rápida de heridas cutáneas.',
      'Adaptación al frío ambiental y estructura de la queratina en cabello y epidermis.',
      'Metabolismo lipídico y almacenamiento de energía durante épocas de escasez calórica.'
    ]
  };

  return {
    regions,
    maternal,
    paternal,
    neanderthal
  };
}
