export function generateId() {
  return crypto.randomUUID();
}

export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function exportToCSV(data, filename) {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val ?? '';
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function getStatusColor(status) {
  const colors = {
    'Applied': 'bg-blue-500/20 text-blue-400',
    'No Response': 'bg-gray-500/20 text-gray-400',
    'Rejected': 'bg-red-500/20 text-red-400',
    'Online Assessment': 'bg-yellow-500/20 text-yellow-400',
    'Phone Screen': 'bg-green-500/20 text-green-400',
    'Technical Interview': 'bg-cyan-500/20 text-cyan-400',
    'Behavioral Interview': 'bg-purple-500/20 text-purple-400',
    'Final Round': 'bg-pink-500/20 text-pink-400',
    'Offer Received': 'bg-emerald-500/20 text-emerald-400',
    'Offer Accepted': 'bg-green-500/20 text-green-400',
    'Offer Declined': 'bg-orange-500/20 text-orange-400',
    'Withdrawn': 'bg-gray-500/20 text-gray-400',
  };
  return colors[status] || colors['Applied'];
}
