export function formatDate(date) {
  if (!date) return 'Non définie'
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}

export function formatShortDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(new Date(date))
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value || 0)
}

export function isOverdue(date, status) {
  return Boolean(date && new Date(date) < new Date() && status !== 'done')
}

export function statusLabel(status) {
  const labels = { todo: 'À faire', progress: 'En cours', blocked: 'Bloqué', done: 'Terminé' }
  return labels[status] || status
}

export function priorityClass(priority) {
  return {
    critical: priority === 'Critique',
    high: priority === 'Haute',
    medium: priority === 'Moyenne',
    low: priority === 'Basse'
  }
}

export function initials(name = '') {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'BF'
}
