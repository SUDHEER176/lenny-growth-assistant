import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { Session } from '../types';

interface SessionSidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
}) => {
  return (
    <aside className="sessions-sidebar">
      <div className="sidebar-header">
        <span>Conversations</span>
        <span>{sessions.length}</span>
      </div>

      <div className="sessions-list">
        {sessions.map((s) => {
          const isActive = s.id === activeSessionId;
          return (
            <button
              key={s.id}
              className={`session-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectSession(s.id)}
            >
              <MessageSquare size={15} style={{ marginRight: 8, flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
              <span className="session-title-text" title={s.title}>
                {s.title}
              </span>
              <span
                className="session-delete-btn"
                title="Delete session"
                onClick={(e) => onDeleteSession(s.id, e)}
              >
                <Trash2 size={13} />
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
