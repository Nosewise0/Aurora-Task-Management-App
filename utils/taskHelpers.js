function formatDate(d) {
    if (!d) return '';
    const date = new Date(d);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getDate();
}

function getCategoryColor(cat) {
    if (!cat) return 'secondary';
    const c = cat.toLowerCase();
    if (c === 'design') return 'primary';
    if (c === 'dev') return 'warning';
    if (c === 'content') return 'secondary';
    if (c === 'marketing') return 'danger';
    return 'info';
}

function getPriorityColor(p) {
    if (!p) return 'secondary';
    const pr = p.toLowerCase();
    if (pr === 'high' || pr === 'urgent') return 'danger';
    if (pr === 'medium') return 'warning';
    return 'success';
}

module.exports = { formatDate, getCategoryColor, getPriorityColor };
