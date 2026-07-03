export const MOCK_USER = {
  id: 'mock-user-001',
  email: 'consultor@kova.co',
  firstName: 'María',
  lastName: 'Consultora',
  role: 'CONSULTANT',
  tenantId: 'mock-tenant-001',
  companyId: null,
};

export const MOCK_DASHBOARD = {
  kpis: {
    activeClients: 5,
    activeProcesses: 3,
    activeCandidates: 18,
    interviewsToday: 2,
    pendingReviews: 4,
    stalledProcesses: 1,
    dueSoon: 2,
    activeDeals: 3,
    pendingTasks: 9,
    hiresThisMonth: 2,
  },
  todayWork: [
    { id: 'tw1', title: 'Llamar cliente TechSales', priority: 'HIGH', type: 'Llamada', processId: 'seed-vacancy-001', processTitle: 'Ejecutivo Comercial B2B' },
    { id: 'tw2', title: 'Revisar prueba de Juan Pérez', priority: 'HIGH', type: 'Prueba', processId: 'seed-vacancy-001', candidateId: 'c1' },
    { id: 'tw3', title: 'Agendar entrevista con Laura Méndez', priority: 'MEDIUM', type: 'Entrevista', processId: 'seed-vacancy-002' },
    { id: 'tw4', title: 'Enviar finalistas a TechSales', priority: 'HIGH', type: 'Finalistas', processId: 'seed-vacancy-001' },
    { id: 'tw5', title: 'Responder correo cliente Distribuidora Andina', priority: 'MEDIUM', type: 'Correo', processId: 'seed-vacancy-002' },
    { id: 'tw6', title: 'Enviar propuesta comercial', priority: 'LOW', type: 'Comercial', processId: null },
  ],
  recruitmentFunnel: [
    { stage: 'Prospectados', count: 24 },
    { stage: 'Contactados', count: 18 },
    { stage: 'Respondieron', count: 12 },
    { stage: 'Entrevistados', count: 8 },
    { stage: 'Pruebas', count: 5 },
    { stage: 'Cliente', count: 3 },
    { stage: 'Oferta', count: 2 },
    { stage: 'Contratados', count: 1 },
  ],
  commercialFunnel: [
    { stage: 'Prospecto', count: 8 },
    { stage: 'Contacto', count: 6 },
    { stage: 'Reunión', count: 4 },
    { stage: 'Propuesta', count: 3 },
    { stage: 'Negociación', count: 2 },
    { stage: 'Ganado', count: 1 },
  ],
  pipeline: [
    { stage: 'APPLIED', _count: { stage: 6 } },
    { stage: 'SCREENING', _count: { stage: 4 } },
    { stage: 'INTERVIEW', _count: { stage: 3 } },
    { stage: 'ASSESSMENT', _count: { stage: 2 } },
    { stage: 'CLIENT_REVIEW', _count: { stage: 2 } },
    { stage: 'OFFER', _count: { stage: 1 } },
  ],
  recentActivity: [
    {
      id: '1',
      description: 'Candidato Juan Pérez movido a Entrevista',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: { firstName: 'María', lastName: 'Consultora' },
    },
    {
      id: '2',
      description: 'Discovery completado para TechSales Colombia',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      user: { firstName: 'María', lastName: 'Consultora' },
    },
    {
      id: '3',
      description: 'Nuevo proceso: Ejecutivo Comercial B2B',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user: { firstName: 'Admin', lastName: 'Kova' },
    },
  ],
  alerts: [
    { id: '1', title: 'Proceso sin actividad - Distribuidora Andina', status: 'OVERDUE', dueDate: new Date(Date.now() - 86400000).toISOString() },
    { id: '2', title: 'Entrevista mañana con Ana Gómez', status: 'PENDING', dueDate: new Date(Date.now() + 86400000).toISOString() },
  ],
};

export const MOCK_COMPANIES = [
  {
    id: 'seed-company-001',
    name: 'TechSales Colombia SAS',
    sector: 'Tecnología B2B',
    industry: 'Software',
    city: 'Bogotá',
    status: 'ACTIVE',
    email: 'contacto@techsales.co',
    phone: '+57 300 123 4567',
    consultants: [{ consultant: { id: '1', firstName: 'María', lastName: 'Consultora', email: 'consultor@kova.co' } }],
    _count: { vacancies: 2, contacts: 3 },
  },
  {
    id: 'seed-company-002',
    name: 'Distribuidora Andina',
    sector: 'Distribución',
    industry: 'Consumo masivo',
    city: 'Medellín',
    status: 'ACTIVE',
    email: 'comercial@andina.co',
    phone: '+57 310 987 6543',
    consultants: [{ consultant: { id: '1', firstName: 'María', lastName: 'Consultora', email: 'consultor@kova.co' } }],
    _count: { vacancies: 1, contacts: 2 },
  },
  {
    id: 'seed-company-003',
    name: 'Innovatech Solutions',
    sector: 'Tecnología',
    industry: 'SaaS',
    city: 'Bogotá',
    status: 'ACTIVE',
    email: 'hr@innovatech.co',
    phone: '+57 320 555 8899',
    consultants: [{ consultant: { id: '1', firstName: 'María', lastName: 'Consultora', email: 'consultor@kova.co' } }],
    _count: { vacancies: 1, contacts: 1 },
  },
  {
    id: 'seed-company-004',
    name: 'Logística Total SAS',
    sector: 'Logística',
    industry: 'Transporte',
    city: 'Cali',
    status: 'PAUSED',
    email: 'talento@logisticatotal.co',
    phone: '+57 315 444 2211',
    consultants: [{ consultant: { id: '1', firstName: 'María', lastName: 'Consultora', email: 'consultor@kova.co' } }],
    _count: { vacancies: 1, contacts: 2 },
  },
];

export const MOCK_VACANCIES = [
  {
    id: 'seed-vacancy-001',
    title: 'Ejecutivo Comercial B2B',
    status: 'SEARCH_ACTIVE',
    city: 'Bogotá',
    modality: 'Híbrido',
    priority: 'HIGH',
    company: { id: 'seed-company-001', name: 'TechSales Colombia SAS' },
    _count: { candidates: 2 },
    interviewsCount: 2,
    finalistsCount: 0,
    testsCount: 4,
    progress: 50,
    consultantName: 'María Consultora',
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    nextActionTitle: 'Entrevista con Juan Pérez',
    nextActionDetail: 'Mañana, 10:00 AM',
    requiredDate: new Date(Date.now() + 21 * 86400000).toISOString(),
  },
  {
    id: 'seed-vacancy-002',
    title: 'Gerente Comercial Regional',
    status: 'FINALISTS',
    city: 'Medellín',
    modality: 'Presencial',
    priority: 'MEDIUM',
    company: { id: 'seed-company-002', name: 'Distribuidora Andina' },
    _count: { candidates: 1 },
    interviewsCount: 1,
    finalistsCount: 1,
    testsCount: 2,
    progress: 70,
    consultantName: 'María Consultora',
    createdAt: new Date(Date.now() - 23 * 86400000).toISOString(),
    nextActionTitle: 'Entrevista final',
    nextActionDetail: 'Viernes, 16 may · 02:00 PM',
    requiredDate: new Date(Date.now() + 45 * 86400000).toISOString(),
  },
  {
    id: 'seed-vacancy-003',
    title: 'Account Executive B2B',
    status: 'APPROVAL_PENDING',
    city: 'Bogotá',
    modality: 'Remoto',
    priority: 'MEDIUM',
    company: { id: 'seed-company-003', name: 'Innovatech Solutions' },
    _count: { candidates: 3 },
    interviewsCount: 0,
    finalistsCount: 0,
    testsCount: 1,
    progress: 30,
    consultantName: 'María Consultora',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    nextActionTitle: 'Revisar candidatos',
    nextActionDetail: 'Hoy, 04:00 PM',
    requiredDate: new Date(Date.now() + 30 * 86400000).toISOString(),
  },
  {
    id: 'seed-vacancy-004',
    title: 'Coordinador de Ventas',
    status: 'PAUSED',
    city: 'Cali',
    modality: 'Presencial',
    priority: 'LOW',
    company: { id: 'seed-company-004', name: 'Logística Total SAS' },
    _count: { candidates: 1 },
    interviewsCount: 0,
    finalistsCount: 0,
    testsCount: 0,
    progress: 15,
    consultantName: 'María Consultora',
    createdAt: new Date(Date.now() - 31 * 86400000).toISOString(),
    nextActionTitle: 'Proceso pausado',
    nextActionDetail: 'Retomar cuando se reactive',
    requiredDate: new Date(Date.now() + 60 * 86400000).toISOString(),
  },
];

export const MOCK_CANDIDATES = [
  {
    id: 'c1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@email.com',
    phone: '+57 301 555 1234',
    city: 'Bogotá',
    status: 'ACTIVE',
    ranking: 1,
    compatibility: 92,
    currentStage: 'INTERVIEW',
    source: 'LinkedIn',
    skills: ['Prospección', 'Negociación', 'Cierre de ventas', 'Venta consultiva', 'Gestión de pipeline'],
    scores: { experiencia: 100, habilidades: 95, educacion: 85, cultura: 90 },
    vacancies: [{ vacancy: { id: 'seed-vacancy-001', title: 'Ejecutivo Comercial B2B', company: { name: 'TechSales Colombia SAS' } } }],
  },
  {
    id: 'c2',
    firstName: 'Ana',
    lastName: 'Gómez',
    email: 'ana.gomez@email.com',
    phone: '+57 302 555 5678',
    city: 'Bogotá',
    status: 'ACTIVE',
    ranking: 2,
    compatibility: 87,
    currentStage: 'ASSESSMENT',
    source: 'Referido',
    skills: ['Negociación', 'Presentación comercial', 'Manejo de objeciones', 'Inteligencia emocional', 'Trabajo en equipo'],
    scores: { experiencia: 85, habilidades: 80, educacion: 75, cultura: 85 },
    vacancies: [{ vacancy: { id: 'seed-vacancy-001', title: 'Ejecutivo Comercial B2B', company: { name: 'TechSales Colombia SAS' } } }],
  },
  {
    id: 'c3',
    firstName: 'Carlos',
    lastName: 'Ruiz',
    email: 'carlos.ruiz@email.com',
    phone: '+57 310 555 9012',
    city: 'Medellín',
    status: 'ACTIVE',
    ranking: 1,
    compatibility: 78,
    currentStage: 'SCREENING',
    source: 'Computrabajo',
    skills: ['Liderazgo comercial', 'Cuentas clave', 'Análisis de mercado', 'Negociación', 'Pricing'],
    scores: { experiencia: 90, habilidades: 80, educacion: 70, cultura: 72 },
    vacancies: [{ vacancy: { id: 'seed-vacancy-002', title: 'Gerente Comercial Regional', company: { name: 'Distribuidora Andina' } } }],
  },
];

const CANDIDATE_DETAIL: Record<string, Record<string, unknown>> = {
  c1: {
    experiences: [
      { id: 'e1', company: 'SoftCorp', role: 'Ejecutivo de Ventas', period: '2021 - 2024', achievement: 'Superó la meta anual 130% dos años seguidos.' },
      { id: 'e2', company: 'DataSell', role: 'Representante Comercial', period: '2018 - 2021', achievement: 'Abrió 40 cuentas nuevas B2B.' },
    ],
    competencies: [
      { name: 'Prospección', score: 90 },
      { name: 'Negociación', score: 88 },
      { name: 'Cierre', score: 92 },
      { name: 'Comunicación', score: 85 },
    ],
    notes: [{ id: 'n1', text: 'Muy buena actitud en la primera llamada. Fuerte en venta consultiva.', author: 'María Consultora', date: new Date(Date.now() - 2 * 86400000).toISOString() }],
  },
  c2: {
    experiences: [
      { id: 'e1', company: 'VentasPro', role: 'Asesora Comercial Senior', period: '2020 - 2024', achievement: 'Lideró equipo de 5 vendedores.' },
    ],
    competencies: [
      { name: 'Prospección', score: 82 },
      { name: 'Negociación', score: 90 },
      { name: 'Cierre', score: 80 },
      { name: 'Comunicación', score: 91 },
    ],
    notes: [{ id: 'n1', text: 'Excelente comunicación. Validar experiencia en ticket alto.', author: 'María Consultora', date: new Date(Date.now() - 3 * 86400000).toISOString() }],
  },
  c3: {
    experiences: [
      { id: 'e1', company: 'Distribuidora Norte', role: 'Gerente Regional', period: '2019 - 2024', achievement: 'Creció la región 45% en 3 años.' },
    ],
    competencies: [
      { name: 'Planeación', score: 85 },
      { name: 'Negociación', score: 79 },
      { name: 'Orientación al logro', score: 83 },
      { name: 'Liderazgo', score: 88 },
    ],
    notes: [],
  },
};

export function getMockCandidate(id: string) {
  const base = MOCK_CANDIDATES.find((c) => c.id === id);
  if (!base) return null;
  const detail = CANDIDATE_DETAIL[id] ?? { experiences: [], competencies: [], notes: [] };
  return {
    ...base,
    ...detail,
    vacancyTitle: base.vacancies[0]?.vacancy.title,
    companyName: base.vacancies[0]?.vacancy.title.includes('Regional') ? 'Distribuidora Andina' : 'TechSales Colombia SAS',
    profileSummary: id === 'c1'
      ? 'Ejecutivo comercial B2B con 6 años de experiencia en software. Fuerte en prospección y cierre consultivo.'
      : id === 'c2'
        ? 'Asesora comercial senior con experiencia liderando equipos pequeños. Excelente comunicación.'
        : 'Gerente regional con trayectoria en consumo masivo.',
  };
}

export const MOCK_JOB_PROFILES = [
  {
    id: 'jp1',
    vacancyId: 'seed-vacancy-001',
    title: 'Ejecutivo Comercial B2B',
    company: 'TechSales Colombia SAS',
    objective: 'Generar nuevos negocios B2B mediante venta consultiva, cumpliendo la meta mensual de ventas.',
    functions: ['Prospectar cuentas nuevas', 'Realizar demos de producto', 'Negociar y cerrar contratos', 'Gestionar el pipeline en el CRM'],
    kpis: ['Ventas mensuales', 'Nuevas cuentas abiertas', 'Tasa de conversión', 'Ciclo de venta promedio'],
    competencies: [
      { name: 'Prospección', weight: 5 },
      { name: 'Negociación', weight: 5 },
      { name: 'Cierre', weight: 4 },
      { name: 'Comunicación', weight: 4 },
      { name: 'Disciplina', weight: 3 },
    ],
    knowledge: ['Venta consultiva B2B', 'Manejo de CRM', 'SaaS / tecnología'],
    experience: '3+ años en ventas B2B, preferible en tecnología o software.',
    targetCompanies: ['SoftCorp', 'DataSell', 'CloudVentas'],
    avoidCompanies: ['Retail masivo puerta a puerta'],
    successFactors: ['Autonomía', 'Resiliencia ante el no', 'Orientación a datos'],
    failureReasons: ['Falta de disciplina en el pipeline', 'Poca tolerancia a ciclos largos'],
    expectations: { d30: 'Conocer producto y mercado, primeras reuniones agendadas.', d60: 'Pipeline construido y primeras oportunidades avanzadas.', d90: 'Primeros cierres y meta parcial cumplida.' },
    autoGenerated: true,
  },
  {
    id: 'jp2',
    vacancyId: 'seed-vacancy-002',
    title: 'Gerente Comercial Regional',
    company: 'Distribuidora Andina',
    objective: 'Liderar el equipo comercial de la región y asegurar el cumplimiento de las metas de venta.',
    functions: ['Dirigir el equipo comercial', 'Definir estrategia regional', 'Gestionar cuentas clave', 'Reportar resultados a dirección'],
    kpis: ['Venta regional', 'Rotación del equipo', 'Cumplimiento de meta', 'Margen'],
    competencies: [
      { name: 'Planeación', weight: 5 },
      { name: 'Liderazgo', weight: 5 },
      { name: 'Negociación', weight: 4 },
      { name: 'Orientación al logro', weight: 4 },
    ],
    knowledge: ['Gestión de equipos comerciales', 'Consumo masivo', 'Presupuestos'],
    experience: '5+ años liderando equipos comerciales.',
    targetCompanies: ['Distribuidora Norte', 'Consumo SAS'],
    avoidCompanies: [],
    successFactors: ['Liderazgo cercano', 'Visión estratégica'],
    failureReasons: ['Microgestión', 'Débil manejo de datos'],
    expectations: { d30: 'Diagnóstico del equipo y la región.', d60: 'Plan de acción implementado.', d90: 'Mejora medible en indicadores.' },
    autoGenerated: true,
  },
];

export const MOCK_INTERVIEWS = [
  {
    id: 'iv1', candidateId: 'c1', candidateName: 'Juan Pérez', vacancy: 'Ejecutivo Comercial B2B',
    status: 'COMPLETED', scheduledAt: new Date(Date.now() - 2 * 86400000).toISOString(), score: 88,
    questions: [
      { q: 'Cuéntame de una venta compleja que hayas cerrado.', competency: 'Cierre', score: 9 },
      { q: '¿Cómo prospectas cuentas nuevas?', competency: 'Prospección', score: 8 },
      { q: 'Describe una negociación difícil.', competency: 'Negociación', score: 9 },
    ],
  },
  {
    id: 'iv2', candidateId: 'c2', candidateName: 'Ana Gómez', vacancy: 'Ejecutivo Comercial B2B',
    status: 'SCHEDULED', scheduledAt: new Date(Date.now() + 1 * 86400000).toISOString(), score: null,
    questions: [
      { q: 'Cuéntame de una venta compleja que hayas cerrado.', competency: 'Cierre', score: null },
      { q: '¿Cómo prospectas cuentas nuevas?', competency: 'Prospección', score: null },
    ],
  },
];

export const ASSESSMENT_TYPE_LABELS: Record<string, string> = {
  COMMERCIAL: 'Prueba Comercial',
  TECHNICAL: 'Prueba Técnica',
  BEHAVIORAL: 'Prueba Conductual',
  ROLE_PLAY: 'Role Play',
  'Prueba Comercial': 'Prueba Comercial',
  'Prueba Técnica': 'Prueba Técnica',
  'Prueba Conductual': 'Prueba Conductual',
  'Role Play': 'Role Play',
};

export const MOCK_ASSESSMENTS = [
  {
    id: 'as1',
    candidateId: 'c1',
    candidateName: 'Juan Pérez',
    vacancyId: 'seed-vacancy-001',
    vacancyTitle: 'Ejecutivo Comercial B2B',
    companyName: 'TechSales Colombia SAS',
    type: 'Prueba Comercial',
    competency: 'Venta consultiva',
    score: 90,
    maxScore: 100,
    result: 'Aprobado',
    durationMinutes: 42,
    completedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    comments: 'Excelente manejo de objeciones y cierre consultivo.',
    mistakes: ['Pregunta 7: No detalló el proceso de calificación de prospectos BANT'],
  },
  {
    id: 'as2',
    candidateId: 'c1',
    candidateName: 'Juan Pérez',
    vacancyId: 'seed-vacancy-001',
    vacancyTitle: 'Ejecutivo Comercial B2B',
    companyName: 'TechSales Colombia SAS',
    type: 'Role Play',
    competency: 'Negociación',
    score: 85,
    maxScore: 100,
    result: 'Aprobado',
    durationMinutes: 28,
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    comments: 'Buen manejo de la negociación, reforzar propuesta de valor.',
    mistakes: ['Escenario 2: Cedió descuento antes de validar necesidad', 'Escenario 4: Propuesta de valor genérica, no adaptada al cliente'],
  },
  {
    id: 'as3',
    candidateId: 'c2',
    candidateName: 'Ana Gómez',
    vacancyId: 'seed-vacancy-001',
    vacancyTitle: 'Ejecutivo Comercial B2B',
    companyName: 'TechSales Colombia SAS',
    type: 'Prueba Conductual',
    competency: 'Resiliencia',
    score: 78,
    maxScore: 100,
    result: 'Aprobado',
    durationMinutes: 35,
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    comments: 'Responde bien bajo presión. Comunicación clara.',
    mistakes: ['Pregunta 3: Ejemplo de rechazo sin acción concreta de recuperación', 'Pregunta 8: Tendencia a culpar al mercado en lugar de plan de acción'],
  },
  {
    id: 'as4',
    candidateId: 'c2',
    candidateName: 'Ana Gómez',
    vacancyId: 'seed-vacancy-001',
    vacancyTitle: 'Ejecutivo Comercial B2B',
    companyName: 'TechSales Colombia SAS',
    type: 'Prueba Comercial',
    competency: 'Prospección',
    score: 82,
    maxScore: 100,
    result: 'Aprobado',
    durationMinutes: 38,
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    comments: 'Buena estructura de prospección B2B.',
    mistakes: ['Pregunta 5: Canales de prospección limitados a LinkedIn', 'Pregunta 9: No midió tasa de respuesta ni conversión por canal'],
  },
  {
    id: 'as5',
    candidateId: 'c3',
    candidateName: 'Carlos Ruiz',
    vacancyId: 'seed-vacancy-002',
    vacancyTitle: 'Gerente Comercial Regional',
    companyName: 'Distribuidora Andina',
    type: 'Prueba Comercial',
    competency: 'Planeación',
    score: 72,
    maxScore: 100,
    result: 'En revisión',
    durationMinutes: 55,
    completedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    comments: 'Plan comercial sólido pero le falta profundidad en KPIs.',
    mistakes: ['Pregunta 2: KPIs sin metas numéricas por vendedor', 'Pregunta 6: No incluyó plan de contingencia', 'Pregunta 10: Proyección de ventas sin respaldo histórico'],
  },
  {
    id: 'as6',
    candidateId: 'c3',
    candidateName: 'Carlos Ruiz',
    vacancyId: 'seed-vacancy-002',
    vacancyTitle: 'Gerente Comercial Regional',
    companyName: 'Distribuidora Andina',
    type: 'Prueba Técnica',
    competency: 'Gestión de equipos',
    score: 68,
    maxScore: 100,
    result: 'En revisión',
    durationMinutes: 47,
    completedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    comments: 'Experiencia relevante, validar liderazgo en campo.',
    mistakes: ['Pregunta 4: No describió método de coaching 1:1', 'Pregunta 7: Indicadores de desempeño del equipo incompletos', 'Pregunta 11: Sin plan de retención de talento comercial'],
  },
];

export const MOCK_FINALISTS = {
  vacancy: 'Ejecutivo Comercial B2B',
  company: 'TechSales Colombia SAS',
  candidates: [
    { name: 'Juan Pérez', compatibility: 92, interview: 88, assessment: 90, strengths: ['Cierre', 'Prospección'], risks: ['Ticket alto por validar'], recommendation: 'Altamente recomendado' },
    { name: 'Ana Gómez', compatibility: 87, interview: 84, assessment: 78, strengths: ['Comunicación', 'Negociación'], risks: ['Experiencia B2B media'], recommendation: 'Recomendado' },
  ],
};

export const MOCK_ONBOARDING = {
  candidate: 'Juan Pérez',
  role: 'Ejecutivo Comercial B2B',
  progress: 45,
  modules: [
    { id: 'o1', title: 'Inducción a la empresa', type: 'Video', done: true },
    { id: 'o2', title: 'Producto y propuesta de valor', type: 'Documento', done: true },
    { id: 'o3', title: 'Proceso comercial y CRM', type: 'Curso', done: false },
    { id: 'o4', title: 'Scripts de prospección', type: 'Playbook', done: false },
    { id: 'o5', title: 'Evaluación de conocimiento', type: 'Evaluación', done: false },
  ],
};

export const MOCK_ACADEMIA = [
  { id: 'ac1', title: 'Fundamentos de venta consultiva', lessons: 8, duration: '2h 30m', enrolled: 12 },
  { id: 'ac2', title: 'Manejo de objeciones', lessons: 5, duration: '1h 15m', enrolled: 9 },
  { id: 'ac3', title: 'Prospección en LinkedIn', lessons: 6, duration: '1h 45m', enrolled: 15 },
  { id: 'ac4', title: 'Cierre y negociación avanzada', lessons: 7, duration: '2h', enrolled: 7 },
];

export const MOCK_CRM = [
  { id: 'cr1', company: 'TechSales Colombia SAS', type: 'Llamada', note: 'Seguimiento a propuesta de servicio.', date: new Date(Date.now() - 1 * 86400000).toISOString(), next: 'Enviar contrato' },
  { id: 'cr2', company: 'Distribuidora Andina', type: 'Reunión', note: 'Discovery inicial agendado.', date: new Date(Date.now() - 3 * 86400000).toISOString(), next: 'Realizar Discovery' },
  { id: 'cr3', company: 'TechSales Colombia SAS', type: 'Correo', note: 'Envío de perfil de finalistas.', date: new Date(Date.now() - 5 * 86400000).toISOString(), next: 'Agendar presentación' },
];

export const MOCK_CALENDAR = [
  {
    id: 'cal1',
    title: 'Discovery comercial - Distribuidora Andina',
    type: 'Discovery',
    date: new Date(Date.now() + 1 * 86400000 + 10 * 3600000).toISOString(),
    endDate: new Date(Date.now() + 1 * 86400000 + 11 * 3600000).toISOString(),
    companyId: 'co2',
    companyName: 'Distribuidora Andina',
    vacancyTitle: 'Gerente Comercial Regional',
    contactName: 'Laura Méndez',
    contactRole: 'Directora Comercial',
    contactPhone: '+57 310 987 6543',
    contactEmail: 'comercial@andina.co',
    location: 'Google Meet',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    purpose: 'Levantar información del negocio, proceso comercial y perfil ideal del cargo.',
    notes: 'Confirmar asistencia del gerente general. Llevar propuesta de metodología Kova.',
  },
  {
    id: 'cal2',
    title: 'Presentación de finalistas - TechSales',
    type: 'Reunión cliente',
    date: new Date(Date.now() + 2 * 86400000 + 14 * 3600000).toISOString(),
    endDate: new Date(Date.now() + 2 * 86400000 + 15 * 3600000).toISOString(),
    companyId: 'co1',
    companyName: 'TechSales Colombia SAS',
    vacancyTitle: 'Ejecutivo Comercial B2B',
    contactName: 'Carlos Restrepo',
    contactRole: 'Gerente Comercial',
    contactPhone: '+57 300 123 4567',
    contactEmail: 'contacto@techsales.co',
    location: 'Oficina TechSales, Bogotá',
    purpose: 'Presentar 3 finalistas con informe comparativo. Definir entrevistas finales con el cliente.',
    notes: 'Enviar informe PDF 24h antes. Candidatos: Juan Pérez, Ana Gómez, Carlos Ruiz.',
  },
  {
    id: 'cal3',
    title: 'Seguimiento post-entrevista - TechSales',
    type: 'Llamada',
    date: new Date(Date.now() + 3 * 86400000 + 9 * 3600000).toISOString(),
    endDate: new Date(Date.now() + 3 * 86400000 + 9.5 * 3600000).toISOString(),
    companyId: 'co1',
    companyName: 'TechSales Colombia SAS',
    vacancyTitle: 'Ejecutivo Comercial B2B',
    contactName: 'Carlos Restrepo',
    contactRole: 'Gerente Comercial',
    contactPhone: '+57 300 123 4567',
    contactEmail: 'contacto@techsales.co',
    purpose: 'Recoger feedback de entrevistas y avanzar a fase de pruebas comerciales.',
    notes: 'Preguntar por disponibilidad para role play la próxima semana.',
  },
  {
    id: 'cal4',
    title: 'Entrevista cliente - Ana Gómez',
    type: 'Entrevista cliente',
    date: new Date(Date.now() + 4 * 86400000 + 11 * 3600000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86400000 + 12 * 3600000).toISOString(),
    companyId: 'co1',
    companyName: 'TechSales Colombia SAS',
    vacancyTitle: 'Ejecutivo Comercial B2B',
    contactName: 'Carlos Restrepo',
    contactRole: 'Gerente Comercial',
    contactPhone: '+57 300 123 4567',
    contactEmail: 'contacto@techsales.co',
    location: 'Presencial - TechSales',
    purpose: 'Entrevista final del candidato Ana Gómez con el cliente. Coordinar llegada 15 min antes.',
    notes: 'Candidata: Ana Gómez · Tel. +57 320 555 8899',
  },
  {
    id: 'cal5',
    title: 'Aprobación perfil de cargo - Distribuidora Andina',
    type: 'Reunión cliente',
    date: new Date(Date.now() + 5 * 86400000 + 16 * 3600000).toISOString(),
    endDate: new Date(Date.now() + 5 * 86400000 + 17 * 3600000).toISOString(),
    companyId: 'co2',
    companyName: 'Distribuidora Andina',
    vacancyTitle: 'Gerente Comercial Regional',
    contactName: 'Laura Méndez',
    contactRole: 'Directora Comercial',
    contactPhone: '+57 310 987 6543',
    contactEmail: 'comercial@andina.co',
    meetingUrl: 'https://meet.google.com/xyz-abcd-efg',
    purpose: 'Validar perfil del cargo y KPIs 30/60/90 antes de abrir búsqueda activa.',
  },
  {
    id: 'cal6',
    title: 'WhatsApp - confirmar agenda role play',
    type: 'Seguimiento',
    date: new Date(Date.now() + 6 * 3600000).toISOString(),
    endDate: new Date(Date.now() + 6.5 * 3600000).toISOString(),
    companyId: 'co1',
    companyName: 'TechSales Colombia SAS',
    vacancyTitle: 'Ejecutivo Comercial B2B',
    contactName: 'Carlos Restrepo',
    contactRole: 'Gerente Comercial',
    contactPhone: '+57 300 123 4567',
    contactEmail: 'contacto@techsales.co',
    purpose: 'Confirmar horario del role play con Juan Pérez y disponibilidad del equipo comercial.',
  },
];

export const MOCK_DOCUMENTS = [
  { id: 'd1', name: 'CV - Juan Pérez.pdf', type: 'Hoja de vida', company: 'TechSales Colombia SAS', size: '240 KB', date: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'd2', name: 'Informe finalistas.pdf', type: 'Informe', company: 'TechSales Colombia SAS', size: '1.2 MB', date: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'd3', name: 'Contrato de servicio.pdf', type: 'Contrato', company: 'Distribuidora Andina', size: '480 KB', date: new Date(Date.now() - 6 * 86400000).toISOString() },
];

export const MOCK_REPORTS = {
  avgTimeToHire: 28,
  avgTimeToHireDelta: -14,
  hires6m: 32,
  hires6mDelta: 18,
  activeConsultants: 8,
  activeConsultantsDelta: 2,
  totalSources: 6,
  avgTimePerStage: [
    { stage: 'Discovery', days: 8 },
    { stage: 'Perfil ideal', days: 12 },
    { stage: 'Reclutamiento', days: 15 },
    { stage: 'Evaluación', days: 10 },
    { stage: 'Entrevistas', days: 7 },
    { stage: 'Oferta', days: 5 },
    { stage: 'Contratación', days: 4 },
  ],
  byConsultant: [
    { name: 'María Consultora', vacancies: 12, candidates: 48, hires: 9, successRate: 75 },
    { name: 'Juan Asesor', vacancies: 9, candidates: 36, hires: 6, successRate: 67 },
    { name: 'Laura Selección', vacancies: 7, candidates: 28, hires: 4, successRate: 57 },
    { name: 'Carlos Recruiter', vacancies: 5, candidates: 16, hires: 2, successRate: 40 },
  ],
  sources: [
    { source: 'LinkedIn', count: 60 },
    { source: 'Referidos', count: 36 },
    { source: 'Indeed', count: 26 },
    { source: 'Web corporativa', count: 14 },
    { source: 'Otros', count: 8 },
  ],
  hiresByMonth: [
    { month: 'Dic 2023', hires: 12 },
    { month: 'Ene 2024', hires: 18 },
    { month: 'Feb 2024', hires: 20 },
    { month: 'Mar 2024', hires: 25 },
    { month: 'Abr 2024', hires: 28 },
    { month: 'May 2024', hires: 32 },
  ],
};

export const MOCK_TASKS = [
  { id: 't1', title: 'Agendar entrevista con Juan Pérez', status: 'PENDING', company: { name: 'TechSales Colombia SAS' }, vacancy: { title: 'Ejecutivo Comercial B2B' } },
  { id: 't2', title: 'Completar Discovery con Distribuidora Andina', status: 'IN_PROGRESS', company: { name: 'Distribuidora Andina' }, vacancy: { title: 'Gerente Comercial Regional' } },
  { id: 't3', title: 'Enviar informe de finalistas', status: 'PENDING', company: { name: 'TechSales Colombia SAS' }, vacancy: { title: 'Ejecutivo Comercial B2B' } },
];

export function getMockVacancy(id: string) {
  const base = MOCK_VACANCIES.find((v) => v.id === id);
  if (!base) return null;
  const candidates = MOCK_CANDIDATES.filter((c) => c.vacancies.some((cv) => cv.vacancy.id === id));
  const stages = [
    { stage: 'APPLIED', label: 'Prospectados' },
    { stage: 'SCREENING', label: 'Contactados' },
    { stage: 'CALL', label: 'Respondieron' },
    { stage: 'INTERVIEW', label: 'Entrevistados' },
    { stage: 'ASSESSMENT', label: 'Pruebas' },
    { stage: 'CLIENT_REVIEW', label: 'Cliente' },
    { stage: 'OFFER', label: 'Oferta' },
    { stage: 'HIRED', label: 'Contratados' },
  ];
  const openedAt = new Date(Date.now() - 14 * 86400000);
  const requiredDate = new Date(Date.now() + 21 * 86400000);
  const daysElapsed = 14;
  const daysRemaining = 21;
  const jobProfiles: Record<string, { skills: string[]; conditions: string[]; objective: string }> = {
    'Ejecutivo Comercial B2B': {
      objective: 'Incrementar ventas B2B mediante prospección activa y cierre consultivo.',
      skills: ['Prospección', 'Negociación', 'Cierre de ventas', 'Venta consultiva', 'Gestión de pipeline', 'Manejo de objeciones'],
      conditions: ['Mínimo 3 años en ventas B2B', 'Experiencia en software o tecnología', 'Disponibilidad inmediata', 'Residencia en Bogotá o modalidad híbrida'],
    },
    'Gerente Comercial Regional': {
      objective: 'Liderar el equipo comercial regional y cumplir metas de facturación.',
      skills: ['Liderazgo comercial', 'Cuentas clave', 'Negociación', 'Pricing', 'Análisis de mercado', 'Fidelización'],
      conditions: ['Mínimo 5 años en ventas', 'Experiencia liderando equipos (+5 personas)', 'Industria consumo masivo o distribución', 'Disponibilidad en 30 días'],
    },
  };
  const profile = jobProfiles[base.title] ?? {
    objective: 'Cumplir metas comerciales del cargo.',
    skills: ['Prospección', 'Negociación', 'Cierre de ventas'],
    conditions: ['Experiencia comercial comprobada', 'Disponibilidad para ingresar'],
  };
  return {
    ...base,
    salaryMin: 3500000,
    salaryMax: 5000000,
    variablePay: 'Comisiones por cumplimiento de meta',
    quantity: 1,
    urgency: 'Alta',
    requiredDate: requiredDate.toISOString(),
    description: 'Responsable de la prospección, negociación y cierre de nuevos clientes B2B, cumpliendo metas mensuales de ventas.',
    jobProfile: profile,
    openedAt: openedAt.toISOString(),
    progress: 72,
    daysElapsed,
    daysRemaining,
    stats: {
      candidates: candidates.length,
      interviewed: 2,
      finalists: 1,
      hired: 0,
    },
    nextActivity: { title: 'Presentación finalistas', date: new Date(Date.now() + 2 * 86400000).toISOString() },
    pipelineStages: stages.map((s, i) => ({ ...s, order: i })),
    candidates: candidates.map((c) => {
      const cvId = `cv-${c.id}`;
      const defaultStage = c.currentStage ?? 'SCREENING';
      return {
        id: cvId,
        stage: getMockCandidateStage(cvId, defaultStage),
        ranking: c.ranking ?? 1,
        compatibility: c.compatibility ?? 85,
        candidate: {
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          phone: c.phone,
          city: c.city,
        },
      };
    }),
    interviews: [
      { id: 'iv1', candidateName: 'Juan Pérez', scheduledAt: new Date(Date.now() + 86400000).toISOString(), status: 'SCHEDULED', type: 'Virtual', score: null },
      { id: 'iv2', candidateName: 'Ana Gómez', scheduledAt: new Date(Date.now() - 86400000).toISOString(), status: 'COMPLETED', type: 'Presencial', score: 8.5 },
    ],
    assessments: MOCK_ASSESSMENTS.filter((a) => a.vacancyTitle === base.title),
    activities: [
      { id: 'act1', description: 'Proceso creado', createdAt: openedAt.toISOString() },
      { id: 'act2', description: 'CV de Juan Pérez cargado', createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
      { id: 'act3', description: 'Entrevista realizada con Ana Gómez', createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'act4', description: 'Prueba comercial enviada a Juan Pérez', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    ],
    notes: [
      { id: 'n1', content: 'Cliente prioriza experiencia en software B2B.', author: 'María Consultora', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    ],
    documents: [
      { id: 'd1', name: 'Perfil del cargo.pdf', type: 'Perfil', date: new Date(Date.now() - 12 * 86400000).toISOString() },
      { id: 'd2', name: 'Informe finalistas.pdf', type: 'Informe', date: new Date(Date.now() - 1 * 86400000).toISOString() },
    ],
    checklist: [
      { id: 'ck1', label: 'Buscar candidatos', done: true },
      { id: 'ck2', label: 'Contactar candidatos', done: true },
      { id: 'ck3', label: 'Enviar pruebas', done: true },
      { id: 'ck4', label: 'Agendar entrevistas', done: false },
      { id: 'ck5', label: 'Presentar finalistas', done: false },
      { id: 'ck6', label: 'Enviar oferta', done: false },
      { id: 'ck7', label: 'Cerrar proceso', done: false },
    ],
    tasks: [
      { id: 'vt1', title: 'Revisar hojas de vida nuevas', status: 'PENDING', priority: 'HIGH', dueDate: new Date(Date.now() + 86400000).toISOString() },
      { id: 'vt2', title: 'Agendar entrevista cliente', status: 'PENDING', priority: 'MEDIUM', dueDate: new Date(Date.now() + 2 * 86400000).toISOString() },
      { id: 'vt3', title: 'Enviar informe de finalistas', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: new Date(Date.now() + 86400000).toISOString() },
    ],
  };
}

export function getMockCompany(id: string) {
  const base = MOCK_COMPANIES.find((c) => c.id === id);
  if (!base) return null;
  return {
    ...base,
    address: base.city === 'Bogotá' ? 'Calle 100 # 15-20' : 'Carrera 43A # 1-50',
    website: `https://${base.email?.split('@')[1] ?? 'empresa.co'}`,
    primaryContact: base.city === 'Bogotá' ? 'Laura Martínez' : 'Pedro Salazar',
    commercialDir: base.city === 'Bogotá' ? 'Andrés Rincón' : 'Diana Torres',
    contacts: [
      { id: 'ct1', name: base.city === 'Bogotá' ? 'Laura Martínez' : 'Pedro Salazar', role: 'Gerente Comercial', email: base.email, phone: base.phone },
    ],
    vacancies: MOCK_VACANCIES.filter((v) => v.company.id === id),
    followUps: [],
    crmInteractions: [],
    documents: [],
    contracts: [],
    invoices: [],
    activities: [
      { id: 'a1', type: 'CREATE', description: `Empresa "${base.name}" creada`, createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    ],
  };
}

export function getMockClients() {
  const hireHistory: Record<string, { date: string; role: string; candidate: string }[]> = {
    'seed-company-001': [
      { date: new Date(Date.now() - 45 * 86400000).toISOString(), role: 'Asesor Comercial Senior', candidate: 'Laura Méndez' },
      { date: new Date(Date.now() - 210 * 86400000).toISOString(), role: 'Ejecutivo B2B', candidate: 'Pedro Salazar' },
    ],
    'seed-company-002': [
      { date: new Date(Date.now() - 120 * 86400000).toISOString(), role: 'Jefe de Zona', candidate: 'Diego Ramírez' },
    ],
    'seed-company-003': [],
    'seed-company-004': [
      { date: new Date(Date.now() - 240 * 86400000).toISOString(), role: 'Coordinador de Rutas', candidate: 'Sandra Ortiz' },
    ],
  };

  const followUps: Record<string, { lastActivity: string; lastNote: string; nextTitle: string; nextDate: string }> = {
    'seed-company-001': {
      lastActivity: new Date(Date.now() - 1 * 86400000).toISOString(),
      lastNote: 'Seguimiento a propuesta de servicio.',
      nextTitle: 'Presentación de finalistas',
      nextDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    },
    'seed-company-002': {
      lastActivity: new Date(Date.now() - 3 * 86400000).toISOString(),
      lastNote: 'Discovery inicial completado.',
      nextTitle: 'Entrevista final con cliente',
      nextDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    },
    'seed-company-003': {
      lastActivity: new Date(Date.now() - 7 * 86400000).toISOString(),
      lastNote: 'Enviada propuesta comercial.',
      nextTitle: 'Revisar candidatos nuevos',
      nextDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    },
    'seed-company-004': {
      lastActivity: new Date(Date.now() - 30 * 86400000).toISOString(),
      lastNote: 'Proceso pausado por reestructuración interna.',
      nextTitle: 'Retomar proceso',
      nextDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    },
  };

  const relationshipSince: Record<string, string> = {
    'seed-company-001': new Date(Date.now() - 540 * 86400000).toISOString(),
    'seed-company-002': new Date(Date.now() - 360 * 86400000).toISOString(),
    'seed-company-003': new Date(Date.now() - 90 * 86400000).toISOString(),
    'seed-company-004': new Date(Date.now() - 400 * 86400000).toISOString(),
  };

  return MOCK_COMPANIES.map((co) => {
    const processes = MOCK_VACANCIES.filter((v) => v.company.id === co.id).map((v) => ({
      id: v.id,
      title: v.title,
      status: v.status,
      candidates: v._count?.candidates ?? 0,
      progress: v.progress,
      city: v.city,
      createdAt: v.createdAt,
      nextActionTitle: v.nextActionTitle,
      nextActionDetail: v.nextActionDetail,
    }));
    const active = processes.filter((p) => !['CLOSED', 'HIRED', 'PAUSED'].includes(p.status));
    const hires = hireHistory[co.id] ?? [];
    const lastHire = hires[0] ?? null;
    const fu = followUps[co.id];
    const consultant = co.consultants?.[0]?.consultant;

    return {
      id: co.id,
      name: co.name,
      sector: co.sector,
      industry: co.industry,
      city: co.city,
      status: co.status,
      email: co.email,
      phone: co.phone,
      primaryContact: co.id === 'seed-company-001' ? 'Carlos Restrepo' : co.id === 'seed-company-002' ? 'Laura Méndez' : undefined,
      consultantName: consultant ? `${consultant.firstName} ${consultant.lastName}` : 'María Consultora',
      processes,
      activeProcesses: active,
      activeProcessCount: active.length,
      totalProcesses: processes.length,
      totalHires: hires.length,
      lastHireDate: lastHire?.date ?? null,
      lastHireRole: lastHire?.role ?? null,
      lastHireCandidate: lastHire?.candidate ?? null,
      hireHistory: hires,
      lastActivityDate: fu?.lastActivity,
      lastActivityNote: fu?.lastNote,
      nextFollowUpDate: fu?.nextDate,
      nextFollowUpTitle: fu?.nextTitle,
      relationshipSince: relationshipSince[co.id],
    };
  });
}

const mockCandidateStageOverrides: Record<string, string> = {};

export function getMockCandidateStage(candidateVacancyId: string, fallback: string) {
  return mockCandidateStageOverrides[candidateVacancyId] ?? fallback;
}

export function setMockCandidateStage(candidateVacancyId: string, stage: string) {
  mockCandidateStageOverrides[candidateVacancyId] = stage;
}

export function isMockMode() {
  if (process.env.USE_MOCK === 'true') return true;
  const url = process.env.DATABASE_URL?.trim();
  return !url;
}
