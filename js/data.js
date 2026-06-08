// ── FINANCIAL CHARTS DATA ──
const facturacionData = {
  labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
  values: [158, 43, 86, 166, 181, 191, 207]
};

const gopData = {
  labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
  emea:   [26.8, -8.6, 18.5, 35.6, 39.1, 44.1, 58.2],
  amer:   [0.1, -1.5, -1.5, 2.8, 4.1, 6.3, 8]
};

// ── FIDELIZACIÓN DATA ──
const fidelizacionBarData = [
  { year: '2020', val: 568280, delta: null  },
  { year: '2021', val: 604196, delta: 35916 },
  { year: '2022', val: 674676, delta: 70480 },
  { year: '2023', val: 739741, delta: 57133 },
  { year: '2024', val: 782904, delta: 46163 },
  { year: '2025', val: 825297, delta: 42393 }
];

const fidelizacionDonutData = [
  { label: 'Internacional',        val: 372007, color: '#00263D' },
  { label: 'Andalucía',            val: 181589, color: '#1A3B55' },
  { label: 'Madrid',               val:  71579, color: '#2C5878' },
  { label: 'Cataluña',             val:  32197, color: '#3E6D8A' },
  { label: 'Castilla y León',      val:  22050, color: '#527E99' },
  { label: 'Comunidad Valenciana', val:  33716, color: '#6A95A8' },
  { label: 'Castilla-La Mancha',   val:  20915, color: '#85AEBA' },
  { label: 'Murcia',               val:  18599, color: '#9EC2CC' },
  { label: 'País Vasco',           val:  13868, color: '#B5D2DA' },
  { label: 'Extremadura',          val:  12270, color: '#CCE1E6' },
  { label: 'Otros',                val:  46507, color: '#E2EFF2' }
];

const FIDELIZACION_TOTAL = 825297;

// ── DIGITAL DATA ──
const digitalBarData = [
  { label: '253K', val: 253, color: '#5865B7', icon: 'F'  },
  { label: '231K', val: 231, color: '#D4326B', icon: 'I'  },
  { label: '23K',  val:  23, color: '#5C7FB8', icon: 'in' },
  { label: '29K',  val:  29, color: '#C44A7A', icon: 'T'  },
  { label: '7K',   val:   7, color: '#C0392B', icon: 'Y'  },
  { label: '3,6K', val: 3.6, color: '#111111', icon: 'X'  }
];

const digitalRingData = [
  { id: 'digRing1', pct: 0.78, big: '+15',  small: 'MILLION'  },
  { id: 'digRing2', pct: 0.62, big: '+500', small: 'THOUSAND' },
  { id: 'digRing3', pct: 0.22, big: '18%',  small: ''         }
];

// ── REVALORIZACIÓN DATA ──
const revalorizacionData = [
  { year: '2018', total:  52,   annual:  0   },
  { year: '2019', total:  65,   annual: 13   },
  { year: '2020', total:  72,   annual:  7   },
  { year: '2021', total:  81,   annual:  9   },
  { year: '2022', total:  95,   annual: 14   },
  { year: '2023', total: 100,   annual:  5   },
  { year: '2024', total: 104,   annual:  4   },
  { year: '2025', total: 109.3, annual:  5.3 }
];

// ── SECTION ARROWS ──
const SECTION_ARROWS = [
  { from: '#quienes',              to: '#resumen',        dark: false                        },
  { from: '#resumen',              to: '#rendimiento',    dark: true                         },
  { from: '#graficos-financieros', to: '#marcas',         dark: false                        },
  { from: '#marcas',               to: '#portfolio',      dark: true                         },
  { from: '#caribe-section',       to: '#origenes',       dark: true,  bg: '#001F33'         },
  { from: '#origenes',             to: '#valor',          dark: false                        },
  { from: '#valor',                to: '#por-que',        dark: true                         },
  { from: '#por-que',              to: '#fidelizacion',   dark: false, inside: true, bg: '#F2F5F8' },
  { from: '#fidelizacion',         to: '#digital',        dark: false                        },
  { from: '#digital',              to: '#ventas',         dark: false, padBot: 48            },
  { from: '#ventas',               to: '#revalor',        dark: false, pad: 20               },
  { from: '#revalor',              to: '#eficiencia',     dark: false, pad: 20               },
  { from: '#eficiencia',           to: '#gastro',         dark: false                        },
  { from: '#gastro',               to: '#hospitalidad',   dark: false                        },
  { from: '#hospitalidad',         to: '#ocio',           dark: true                         },
  { from: '#ocio',                 to: '#personas',       dark: false                        },
  { from: '#personas',             to: '#gobernanza',     dark: false                        },
  { from: '#gobernanza',           to: '#organigrama',    dark: false                        },
  { from: '#organigrama',          to: '#sostenibilidad', dark: false                        },
  { from: '#sostenibilidad',       to: '#futuro',         dark: true                         },
  { from: '#futuro',               to: '#alquiler',       dark: false                        },
  { from: '#alquiler',             to: '#alternativas',   dark: false                        },
  { from: '#alternativas',         to: '#reposicion',     dark: false                        },
  { from: '#reposicion',           to: '#contacto',       dark: false                        }
];

// ── MAP PINS ──
const SPAIN_PINS = {
  madrid:    { coords: [-3.7038, 40.4168], label: 'MADRID',    lblDir: 'above' },
  huelva:    { coords: [-6.9447, 37.2614], label: 'HUELVA',    lblDir: 'below' },
  sevilla:   { coords: [-5.9845, 37.3891], label: 'SEVILLA',   lblDir: 'above' },
  cadiz:     { coords: [-6.2422, 36.5297], label: 'CÁDIZ',     lblDir: 'below' },
  malaga:    { coords: [-4.4214, 36.7213], label: 'MÁLAGA',    lblDir: 'below' },
  granada:   { coords: [-3.5986, 37.1773], label: 'GRANADA',   lblDir: 'above' },
  almeria:   { coords: [-2.4637, 36.8340], label: 'ALMERÍA',   lblDir: 'below' },
  murcia:    { coords: [-1.1307, 37.9922], label: 'MURCIA',    lblDir: 'above' },
  valencia:  { coords: [-0.3763, 39.4699], label: 'VALENCIA',  lblDir: 'above' },
  barcelona: { coords: [ 2.1734, 41.3851], label: 'BARCELONA', lblDir: 'above' },
  mallorca:  { coords: [ 3.0176, 39.6953], label: 'MALLORCA',  lblDir: 'below' },
  menorca:   { coords: [ 4.0063, 39.9495], label: 'MENORCA',   lblDir: 'above' }
};

const CARIBE_PINS = {
  puertoplata: { coords: [-70.6892, 19.7930], label: 'PUERTO PLATA', lblDir: 'above' }
};
