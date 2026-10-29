const SESSIONS_KEY = 'socrates_sessions_v1';
const ACTIVE_SESSION_ID_KEY = 'socrates_active_session_id';
const SETTINGS_KEY = 'socrates_settings_v1';

export const defaultSettings = {
  provider: 'gemini', // 'gemini' | 'openai' | 'openrouter' | 'offline'
  geminiKey: '',
  geminiModel: 'gemini-3.5-flash-lite',
  openaiKey: '',
  openaiModel: 'gpt-4o-mini',
  openrouterKey: '',
  openrouterModel: 'anthropic/claude-3.5-sonnet',
  customEndpoint: '',
  theme: 'dark',
  soundEnabled: true,
  autoScroll: true
};

// Fetch network addresses of this host machine
export async function fetchNetworkInfo() {
  try {
    const res = await fetch('/api/info');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Network info unavailable:', e);
  }
  return {
    hostname: window.location.hostname,
    bonjourHost: `${window.location.hostname}.local`,
    bonjourUrl: `http://${window.location.hostname}:3000`,
    urls: [window.location.origin]
  };
}

// Initial Sync with server
export async function syncWithServer() {
  try {
    const [sessRes, setRes] = await Promise.all([
      fetch('/api/sessions').catch(() => null),
      fetch('/api/settings').catch(() => null)
    ]);

    if (sessRes && sessRes.ok) {
      const serverSessions = await sessRes.json();
      if (Array.isArray(serverSessions) && serverSessions.length > 0) {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(serverSessions));
      } else {
        // If server is empty, push local storage up
        const local = getSessions();
        if (local.length > 0) {
          syncSessionsToServer(local);
        }
      }
    }

    if (setRes && setRes.ok) {
      const serverSettings = await setRes.json();
      if (serverSettings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(serverSettings));
      }
    }
  } catch (err) {
    console.warn('Server sync failed, running in local-only mode:', err);
  }
}

async function syncSessionsToServer(sessions) {
  try {
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessions)
    });
  } catch (e) {
    // silently fallback to localStorage
  }
}

async function syncSettingsToServer(settings) {
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
  } catch (e) {
    // silently fallback
  }
}

export const getSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    const parsed = data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    // Auto-migrate retired models
    if (parsed.geminiModel === 'gemini-1.5-flash' || parsed.geminiModel === 'gemini-2.0-flash' || parsed.geminiModel === 'gemini-2.5-flash-lite') {
      parsed.geminiModel = 'gemini-3.5-flash-lite';
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load settings:', e);
    return defaultSettings;
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    syncSettingsToServer(settings);
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

export const getSessions = () => {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load sessions:', e);
    return [];
  }
};

export const saveSessions = (sessions) => {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    syncSessionsToServer(sessions);
  } catch (e) {
    console.error('Failed to save sessions:', e);
  }
};

export const getActiveSessionId = () => {
  try {
    return localStorage.getItem(ACTIVE_SESSION_ID_KEY) || null;
  } catch (e) {
    return null;
  }
};

export const setActiveSessionId = (id) => {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_SESSION_ID_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_ID_KEY);
    }
  } catch (e) {
    console.error('Failed to save active session id:', e);
  }
};

export const createNewSession = ({ initialThought, personaId = 'classic', category = 'Размышление' }) => {
  const newSession = {
    id: 'socr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    title: initialThought.slice(0, 60) + (initialThought.length > 60 ? '...' : ''),
    initialThought,
    personaId,
    category,
    depthLevel: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg_seed',
        role: 'user',
        content: initialThought,
        timestamp: new Date().toISOString(),
        depthLevel: 1,
        isSeed: true
      }
    ],
    thoughtTree: [
      {
        id: 'node_0',
        label: initialThought.slice(0, 35) + '...',
        fullText: initialThought,
        depth: 1,
        type: 'seed',
        parentId: null
      }
    ],
    synthesis: null
  };

  const sessions = getSessions();
  const next = [newSession, ...sessions];
  saveSessions(next);
  setActiveSessionId(newSession.id);
  return newSession;
};

export const updateSession = (updatedSession) => {
  const sessions = getSessions();
  const next = sessions.map(s => s.id === updatedSession.id ? { ...updatedSession, updatedAt: new Date().toISOString() } : s);
  saveSessions(next);
};

export const deleteSession = (id) => {
  const sessions = getSessions().filter(s => s.id !== id);
  saveSessions(sessions);
  const activeId = getActiveSessionId();
  if (activeId === id) {
    setActiveSessionId(sessions.length > 0 ? sessions[0].id : null);
  }
};
