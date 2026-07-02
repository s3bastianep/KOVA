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
    activeVacancies: 3,
    closedVacancies: 1,
    activeClients: 5,
    newClients: 2,
    activeConsultants: 4,
    candidatesCount: 18,
    interviewsScheduled: 6,
    pendingTasks: 9,
    hiresThisMonth: 2,
  },
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
      description: 'Nueva vacante: Ejecutivo Comercial B2B',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user: { firstName: 'Admin', lastName: 'Kova' },
    },
  ],
  alerts: [
    { id: '1', title: 'Seguimiento con TechSales', status: 'PENDING', dueDate: new Date(Date.now() + 86400000).toISOString() },
    { id: '2', title: 'Entrevista con candidato finalista', status: 'PENDING', dueDate: new Date(Date.now() + 172800000).toISOString() },
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
    _count: { candidates: 8 },
  },
  {
    id: 'seed-vacancy-002',
    title: 'Gerente Comercial Regional',
    status: 'DISCOVERY',
    city: 'Medellín',
    modality: 'Presencial',
    priority: 'MEDIUM',
    company: { id: 'seed-company-002', name: 'Distribuidora Andina' },
    _count: { candidates: 3 },
  },
];

export const MOCK_CANDIDATES = [
  {
    id: 'c1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@email.com',
    status: 'ACTIVE',
    vacancies: [{ vacancy: { id: 'seed-vacancy-001', title: 'Ejecutivo Comercial B2B' } }],
  },
  {
    id: 'c2',
    firstName: 'Ana',
    lastName: 'Gómez',
    email: 'ana.gomez@email.com',
    status: 'ACTIVE',
    vacancies: [{ vacancy: { id: 'seed-vacancy-001', title: 'Ejecutivo Comercial B2B' } }],
  },
  {
    id: 'c3',
    firstName: 'Carlos',
    lastName: 'Ruiz',
    email: 'carlos.ruiz@email.com',
    status: 'ACTIVE',
    vacancies: [{ vacancy: { id: 'seed-vacancy-002', title: 'Gerente Comercial Regional' } }],
  },
];

export const MOCK_TASKS = [
  { id: 't1', title: 'Agendar entrevista con Juan Pérez', status: 'PENDING', company: { name: 'TechSales Colombia SAS' }, vacancy: { title: 'Ejecutivo Comercial B2B' } },
  { id: 't2', title: 'Completar Discovery con Distribuidora Andina', status: 'IN_PROGRESS', company: { name: 'Distribuidora Andina' }, vacancy: { title: 'Gerente Comercial Regional' } },
  { id: 't3', title: 'Enviar informe de finalistas', status: 'PENDING', company: { name: 'TechSales Colombia SAS' }, vacancy: { title: 'Ejecutivo Comercial B2B' } },
];

export function isMockMode() {
  return process.env.USE_MOCK === 'true';
}
