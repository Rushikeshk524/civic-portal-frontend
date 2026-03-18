import './StatusBadge.css';

export default function StatusBadge({ status }) {
    const labels = {
        pending:     'Pending',
        in_progress: 'In Progress',
        resolved:    'Resolved',
    };

    const label = labels[status] || status;

    return (
        <span className={`badge badge-${status}`}>{label}</span>
    );
}