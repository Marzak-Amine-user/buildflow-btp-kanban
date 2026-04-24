export const statuses = [
  { key: 'todo', label: 'À faire', color: '#64748b' },
  { key: 'progress', label: 'En cours', color: '#2563eb' },
  { key: 'blocked', label: 'Bloqué', color: '#f97316' },
  { key: 'done', label: 'Terminé', color: '#16a34a' }
]

export const team = [
  { id: 1, name: 'Sonia Mercier', role: 'Cheffe de projet', email: 'sonia.mercier@buildflow.local', phone: '06 12 34 56 01' },
  { id: 2, name: 'Karim Haddad', role: 'Conducteur de travaux', email: 'karim.haddad@buildflow.local', phone: '06 12 34 56 02' },
  { id: 3, name: 'Nina Lopez', role: 'Responsable sécurité', email: 'nina.lopez@buildflow.local', phone: '06 12 34 56 03' },
  { id: 4, name: 'Mathieu Roussel', role: 'Chef de chantier', email: 'mathieu.roussel@buildflow.local', phone: '06 12 34 56 04' }
]

export const projects = [
  {
    id: 1,
    name: 'Résidence Les Terrasses du Lac',
    client: 'Nexity Habitat',
    location: 'Annecy',
    type: 'Logements collectifs',
    budget: 2450000,
    startDate: '2026-03-04',
    endDate: '2026-11-28',
    managerId: 1,
    riskLevel: 'Moyen',
    description: 'Construction de 42 logements avec parking souterrain, espaces verts et toiture végétalisée.'
  },
  {
    id: 2,
    name: 'Extension École Jean Moulin',
    client: 'Mairie de Lyon',
    location: 'Lyon 7e',
    type: 'Équipement public',
    budget: 880000,
    startDate: '2026-02-12',
    endDate: '2026-08-30',
    managerId: 2,
    riskLevel: 'Élevé',
    description: 'Extension d’un groupe scolaire avec maintien partiel de l’activité pendant le chantier.'
  },
  {
    id: 3,
    name: 'Rénovation Hall Industriel Delta',
    client: 'Delta Logistics',
    location: 'Grenoble',
    type: 'Rénovation industrielle',
    budget: 1320000,
    startDate: '2026-01-20',
    endDate: '2026-06-18',
    managerId: 1,
    riskLevel: 'Faible',
    description: 'Réhabilitation d’un hall industriel, mise aux normes sécurité incendie et réfection de la dalle.'
  }
]

export const tasks = [
  {
    id: 101,
    projectId: 1,
    title: 'Finaliser le plan d’installation de chantier',
    description: 'Valider les zones de stockage, accès camions, base vie et signalétique sécurité.',
    ownerId: 2,
    dueDate: '2026-04-30',
    priority: 'Haute',
    status: 'progress',
    category: 'Préparation',
    estimatedHours: 10,
    checklist: [
      { id: 1, label: 'Plan base vie', done: true },
      { id: 2, label: 'Circuit livraison', done: false },
      { id: 3, label: 'Validation SPS', done: false }
    ],
    comments: [
      { id: 1, author: 'Sonia Mercier', message: 'Prévoir un accès séparé pour les livraisons béton.', createdAt: '2026-04-15' }
    ]
  },
  {
    id: 102,
    projectId: 1,
    title: 'Commander les garde-corps provisoires',
    description: 'Commande urgente avant démarrage du niveau R+2.',
    ownerId: 3,
    dueDate: '2026-04-26',
    priority: 'Critique',
    status: 'blocked',
    category: 'Sécurité',
    estimatedHours: 4,
    checklist: [
      { id: 1, label: 'Comparer deux fournisseurs', done: true },
      { id: 2, label: 'Valider le devis', done: false }
    ],
    comments: [
      { id: 1, author: 'Nina Lopez', message: 'Blocage : devis fournisseur non reçu.', createdAt: '2026-04-19' }
    ]
  },
  {
    id: 103,
    projectId: 1,
    title: 'Réceptionner les armatures fondations',
    description: 'Contrôler les bons de livraison et la conformité des aciers.',
    ownerId: 4,
    dueDate: '2026-05-03',
    priority: 'Moyenne',
    status: 'todo',
    category: 'Gros œuvre',
    estimatedHours: 6,
    checklist: [],
    comments: []
  },
  {
    id: 104,
    projectId: 2,
    title: 'Planifier les interventions hors temps scolaire',
    description: 'Coordonner les travaux bruyants avec la direction de l’école.',
    ownerId: 1,
    dueDate: '2026-04-29',
    priority: 'Haute',
    status: 'progress',
    category: 'Coordination',
    estimatedHours: 8,
    checklist: [
      { id: 1, label: 'Réunion avec direction', done: true },
      { id: 2, label: 'Planning validé mairie', done: false }
    ],
    comments: []
  },
  {
    id: 105,
    projectId: 2,
    title: 'Contrôle amiante avant démolition',
    description: 'Vérifier le rapport de diagnostic et les zones à isoler.',
    ownerId: 3,
    dueDate: '2026-04-22',
    priority: 'Critique',
    status: 'blocked',
    category: 'Sécurité',
    estimatedHours: 12,
    checklist: [
      { id: 1, label: 'Rapport diagnostic reçu', done: false }
    ],
    comments: [
      { id: 1, author: 'Karim Haddad', message: 'En attente du bureau de contrôle.', createdAt: '2026-04-16' }
    ]
  },
  {
    id: 106,
    projectId: 2,
    title: 'Installer la clôture périphérique',
    description: 'Sécuriser la zone travaux avant arrivée des engins.',
    ownerId: 4,
    dueDate: '2026-04-18',
    priority: 'Moyenne',
    status: 'done',
    category: 'Sécurité',
    estimatedHours: 7,
    checklist: [
      { id: 1, label: 'Pose clôture', done: true },
      { id: 2, label: 'Contrôle accès', done: true }
    ],
    comments: []
  },
  {
    id: 107,
    projectId: 3,
    title: 'Relevé laser de la dalle existante',
    description: 'Identifier les zones à reprendre avant coulage du ragréage industriel.',
    ownerId: 2,
    dueDate: '2026-04-25',
    priority: 'Haute',
    status: 'todo',
    category: 'Diagnostic',
    estimatedHours: 9,
    checklist: [],
    comments: []
  },
  {
    id: 108,
    projectId: 3,
    title: 'Valider le plan de prévention',
    description: 'Signer le plan de prévention avec le client et les sous-traitants.',
    ownerId: 1,
    dueDate: '2026-04-20',
    priority: 'Haute',
    status: 'done',
    category: 'Administratif',
    estimatedHours: 5,
    checklist: [
      { id: 1, label: 'Client', done: true },
      { id: 2, label: 'Sous-traitants', done: true }
    ],
    comments: []
  }
]
