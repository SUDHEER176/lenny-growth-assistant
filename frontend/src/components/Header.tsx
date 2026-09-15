import React from 'react';
import { Plus, Server } from 'lucide-react';
import { ModelInfo, HealthStatus } from '../types';

interface HeaderProps {
  models: ModelInfo[];
  activeProvider: string;
  onProviderChange: (provider: string) => void;
  health: HealthStatus | null;
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  models,
  activeProvider,
  onProviderChange,
  health,
  onNewChat,
}) => {
  const isHealthy = health?.status === 'healthy';
  const isDegraded = health?.status === 'degraded';

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">🚀</div>
        <div>
          <span className="brand-title">The Lenny Growth Assistant</span>
        </div>
        <span className="brand-badge">Lenny RAG v1</span>
      </div>

      <div className="header-actions">
        {/* Model/Provider Selector */}
        <div className="model-selector" title="Switch active model provider">
          <Server size={14} color="#9CA3AF" />
          <select
            value={activeProvider}
            onChange={(e) => onProviderChange(e.target.value)}
          >
            {models && models.length > 0 ? (
              Array.from(new Set(models.map((m) => m.provider))).map((prov) => (
                <option key={prov} value={prov}>
                  {prov === 'ollama' ? 'Ollama (Local)' : 'Claude (Cloud)'}
                </option>
              ))
            ) : (
              <>
                <option value="ollama">Ollama • llama3.1:8b</option>
                <option value="anthropic">Claude • 3.5 Sonnet</option>
              </>
            )}
          </select>

        </div>

        {/* Health Status Indicator */}
        <div
          className="status-pill"
          style={{
            color: isHealthy ? '#10B981' : isDegraded ? '#F59E0B' : '#EF4444',
            backgroundColor: isHealthy
              ? 'rgba(16, 185, 129, 0.1)'
              : isDegraded
              ? 'rgba(245, 158, 11, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            borderColor: isHealthy
              ? 'rgba(16, 185, 129, 0.2)'
              : isDegraded
              ? 'rgba(245, 158, 11, 0.2)'
              : 'rgba(239, 68, 68, 0.2)',
          }}
          title={
            health
              ? `DB: ${health.database.status} | Chunks: ${health.vector_store.indexed_chunks} | Provider: ${health.llm_providers.active_provider}`
              : 'Checking health...'
          }
        >
          <span className="status-dot" />
          <span>{isHealthy ? 'Connected' : isDegraded ? 'Local Only' : 'Offline'}</span>
        </div>

        {/* New Chat Button */}
        <button className="btn-primary" onClick={onNewChat} id="btn-new-chat">
          <Plus size={15} />
          <span>New Chat</span>
        </button>
      </div>
    </header>
  );
};
