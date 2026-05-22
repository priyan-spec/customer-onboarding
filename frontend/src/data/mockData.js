export const roleCards = [
  {
    title: 'Customer',
    role: 'CUSTOMER',
    description: 'Create project requests and track progress',
    icon: 'bi-person-badge',
    to: '/customer',
  },
  {
    title: 'Project Manager',
    role: 'PROJECT_MANAGER',
    description: 'Manage projects and assign tasks to teams',
    icon: 'bi-kanban',
    to: '/manager',
  },
  {
    title: 'Team Member',
    role: 'TEAM_MEMBER',
    description: 'View assigned tasks and update work status',
    icon: 'bi-people',
    to: '/team-member',
  },
]

export const customerNav = [
  { label: 'Dashboard', icon: 'bi-grid-1x2', to: '/customer', end: true },
  { label: 'Create Project', icon: 'bi-plus-square', to: '/customer/create' },
  { label: 'My Projects', icon: 'bi-folder2-open', to: '/customer/projects' },
]

export const managerNav = [
  { label: 'Dashboard', icon: 'bi-grid-1x2', to: '/manager', end: true },
  { label: 'Assigned Projects', icon: 'bi-kanban', to: '/manager/projects' },
]

export const teamNav = [
  { label: 'Dashboard', icon: 'bi-grid-1x2', to: '/team-member', end: true },
  { label: 'My Tasks', icon: 'bi-check2-square', to: '/team-member/tasks' },
  { label: 'Active Projects', icon: 'bi-folder-check', to: '/team-member/projects' },
]

export const projects = [
  {
    id: 'acme-crm',
    title: 'Acme CRM project',
    customer: 'Acme Retail',
    contact: 'Nina Patel',
    email: 'nina@acmeretail.com',
    phase: 'Implementation',
    status: 'Active',
    priority: 'HIGH',
    progress: 72,
    dueDate: 'Jun 12, 2026',
    owner: 'Maya Singh',
    description: 'CRM setup, customer workspace mapping, and team handoff.',
    requirements:
      'Need CRM setup, dashboard integration and document verification workflow.',
    documents: [
      { name: 'id-proof.pdf', type: 'ID Proof', size: '1.8 MB' },
      { name: 'business-certificate.pdf', type: 'Business Certificate', size: '2.4 MB' },
      { name: 'address-proof.png', type: 'Address Proof', size: '860 KB' },
    ],
  },
  {
    id: 'northstar-dashboard',
    title: 'Northstar Dashboard Rollout',
    customer: 'Northstar Labs',
    contact: 'Ishan Rao',
    email: 'ishan@northstarlabs.com',
    phase: 'Discovery',
    status: 'Active',
    priority: 'MEDIUM',
    progress: 48,
    dueDate: 'Jun 24, 2026',
    owner: 'Omar Lewis',
    description: 'Analytics dashboard project with integrations and QA.',
    requirements: 'Connect analytics source, validate executive reports, and train admins.',
    documents: [
      { name: 'company-profile.pdf', type: 'Business Certificate', size: '1.2 MB' },
      { name: 'data-map.xlsx', type: 'Other', size: '420 KB' },
    ],
  },
  {
    id: 'zenith-verification',
    title: 'Zenith Verification Workflow',
    customer: 'Zenith Finance',
    contact: 'Priya Menon',
    email: 'priya@zenithfinance.com',
    phase: 'Review',
    status: 'Completed',
    priority: 'LOW',
    progress: 100,
    dueDate: 'May 29, 2026',
    owner: 'Maya Singh',
    description: 'Document verification automation with approval routing.',
    requirements: 'Automate KYC verification, role approvals, and compliance exports.',
    documents: [
      { name: 'kyc-policy.pdf', type: 'Other', size: '3.1 MB' },
      { name: 'address-proof.pdf', type: 'Address Proof', size: '980 KB' },
    ],
  },
]

export const tasks = [
  {
    id: 1,
    title: 'Configure CRM workspace',
    project: 'Acme CRM project',
    description: 'Create workspace, custom fields, and CRM pipeline stages.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    dueDate: 'May 23, 2026',
    assignee: 'Aarav Mehta',
  },
  {
    id: 2,
    title: 'Verify uploaded documents',
    project: 'Acme CRM project',
    description: 'Review ID proof, business certificate, and address proof.',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: 'May 25, 2026',
    assignee: 'Sara Kim',
  },
  {
    id: 3,
    title: 'Prepare dashboard demo',
    project: 'Northstar Dashboard Rollout',
    description: 'Build a demo workspace for customer admin training.',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: 'May 28, 2026',
    assignee: 'Leo Martin',
  },
  {
    id: 4,
    title: 'Publish handoff checklist',
    project: 'Zenith Verification Workflow',
    description: 'Finalize the customer handoff checklist and support notes.',
    priority: 'LOW',
    status: 'DONE',
    dueDate: 'May 18, 2026',
    assignee: 'Aarav Mehta',
  },
]

export const teamMembers = [
  {
    id: 1,
    name: 'Aarav Mehta',
    role: 'Implementation Specialist',
    workload: 82,
    assignedDate: 'May 19, 2026',
    avatar: 'AM',
  },
  {
    id: 2,
    name: 'Sara Kim',
    role: 'Document Analyst',
    workload: 64,
    assignedDate: 'May 20, 2026',
    avatar: 'SK',
  },
  {
    id: 3,
    name: 'Leo Martin',
    role: 'Solutions Engineer',
    workload: 58,
    assignedDate: 'May 21, 2026',
    avatar: 'LM',
  },
  {
    id: 4,
    name: 'Anika Shah',
    role: 'Customer Success Associate',
    workload: 44,
    assignedDate: 'May 22, 2026',
    avatar: 'AS',
  },
]

export const activities = [
  {
    title: 'Project Progress Updated',
    description: 'Acme CRM project moved to 72% completion.',
    time: '4 min ago',
  },
  {
    title: 'Task Assigned',
    description: 'Verify uploaded documents assigned to Sara Kim.',
    time: '18 min ago',
  },
  {
    title: 'Project Created',
    description: 'Northstar Dashboard Rollout was added to project.',
    time: '1 hr ago',
  },
  {
    title: 'Task Updated',
    description: 'Configure CRM workspace changed to in progress.',
    time: '2 hrs ago',
  },
]
