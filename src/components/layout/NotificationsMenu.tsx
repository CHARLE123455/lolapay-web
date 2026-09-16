import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationMutations, useNotifications } from '../../hooks/queries';
import { useClickOutside } from '../../hooks/useClickOutside';
import { formatWhen } from '../../lib/format';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const { data } = useNotifications();
  const { markRead, markAllRead } = useNotificationMutations();
  const unread = data?.unread ?? 0;
  const items = data?.data ?? [];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="icon-btn" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
        <Bell size={18} />
        {unread > 0 && <span className="badge-dot">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div className="dropdown" style={{ width: 340 }}>
          <div className="row between" style={{ padding: '6px 12px 10px' }}>
            <b>Notifications</b>
            {unread > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => markAllRead.mutate()}>
                Mark all read
              </button>
            )}
          </div>
          {items.length === 0 && <div className="empty">You're all caught up</div>}
          <div style={{ maxHeight: 380, overflow: 'auto' }}>
            {items.map((n) => (
              <button key={n.id} className={`item ${n.isRead ? '' : 'unread'}`} style={{ width: '100%', textAlign: 'left' }} onClick={() => !n.isRead && markRead.mutate(n.id)}>
                <div>
                  <b style={{ fontSize: 13 }}>{n.title}</b>
                  <p className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    {n.body}
                  </p>
                  <p className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                    {formatWhen(n.createdAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
