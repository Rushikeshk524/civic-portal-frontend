export default function StatusBadge({ status }) {
    const config = {
        pending: {label: 'Pending', cls: 'bg=secondary'},
        in_progress: {labe: 'In Progress', cls: 'bg-warning text-dark'},
        resolved: {loabel: 'Resolved', cls: 'bg-success' },
    };

    const badge = config[status] || {label: status, cls: 'bg-secondary' };
    
    return (
        <span className={`badge ${badge.cls}`}>{badge.label}</span>
    );
}