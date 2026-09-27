import { useKarachiMinutes } from '../../hooks/useKarachiMinutes';
import { getOpenStatus } from '../../lib/time';

const DOT_COLORS = {
  open: 'bg-emerald-500',
  closing: 'bg-amber-500',
  closed: 'bg-red-500/80',
};

// Live open/closed status based on Karachi time
const OpenBadge = ({ className = 'text-noir-muted' }) => {
  const status = getOpenStatus(useKarachiMinutes());

  return (
    <span
      className={`inline-flex items-center gap-2.5 text-xs uppercase tracking-widest font-medium ${className}`}
      title="Karachi time"
    >
      <span className="relative flex size-2">
        {status.state !== 'closed' && (
          <span className={`absolute inline-flex size-full rounded-full opacity-60 animate-ping ${DOT_COLORS[status.state]}`} />
        )}
        <span className={`relative inline-flex size-2 rounded-full ${DOT_COLORS[status.state]}`} />
      </span>
      {status.label}
    </span>
  );
};

export default OpenBadge;
