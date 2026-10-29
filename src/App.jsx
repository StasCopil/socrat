import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NewThoughtForm from './components/NewThoughtForm';
import DialogueView from './components/DialogueView';
import ThoughtTreeModal from './components/ThoughtTreeModal';
import SynthesisModal from './components/SynthesisModal';
import SettingsModal from './components/SettingsModal';
import NetworkShareModal from './components/NetworkShareModal';
import CommandPalette from './components/CommandPalette';
import FaqModal from './components/FaqModal';

import { 
  getSessions, 
  getActiveSessionId, 
  setActiveSessionId, 
  createNewSession, 
  updateSession, 
  deleteSession, 
  getSettings,
  saveSettings,
  syncWithServer,
  fetchNetworkInfo
} from './services/storage';
import { querySocraticAI, queryTacticalSuperpower } from './services/socraticEngine';
import { playMechanicalClick, playEpiphanyChime, playToggleTone } from './services/soundEffects';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionIdState, setActiveSessionIdState] = useState(null);
  const [settings, setSettings] = useState(getSettings());
  const [isLoading, setIsLoading] = useState(false);
  const [isExecutingTactic, setIsExecutingTactic] = useState(false);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [currentRigor, setCurrentRigor] = useState('strategic');

  // Modals & Panels state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThoughtTreeOpen, setIsThoughtTreeOpen] = useState(false);
  const [isSynthesisOpen, setIsSynthesisOpen] = useState(false);
  const [isNetworkShareOpen, setIsNetworkShareOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blueprintOpen, setBlueprintOpen] = useState(false);

  // Pre-fill state for new thought form when clicking presets
  const [prefilledThought, setPrefilledThought] = useState('');
  const [prefilledPersona, setPrefilledPersona] = useState('classic');

  // Load initial data and sync with server
  useEffect(() => {
    const init = async () => {
      await syncWithServer();
      const loadedSessions = getSessions();
      setSessions(loadedSessions);
      setSettings(getSettings());

      const activeId = getActiveSessionId();
      if (activeId && loadedSessions.some(s => s.id === activeId)) {
        setActiveSessionIdState(activeId);
      }

      const net = await fetchNetworkInfo();
      setNetworkInfo(net);
    };

    init();
  }, []);

  // Global keyboard shortcuts (⌘K / Ctrl+K for Command Palette)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionIdState) || null;

  const handleToggleSound = () => {
    const newSound = !settings.soundEnabled;
    const updated = { ...settings, soundEnabled: newSound };
    setSettings(updated);
    saveSettings(updated);
    if (newSound) {
      playToggleTone(true);
    }
  };

  const handleChangeRigor = (rigorId) => {
    playMechanicalClick(settings?.soundEnabled);
    setCurrentRigor(rigorId);
    if (activeSession) {
      const updated = { ...activeSession, rigorMode: rigorId };
      updateSession(updated);
      setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
    }
  };

  // Start new thought session
  const handleStartNewThought = async ({ initialThought, personaId }) => {
    playMechanicalClick(settings?.soundEnabled);
    const newSession = createNewSession({
      initialThought,
      personaId,
      category: 'Анализ'
    });
    newSession.rigorMode = currentRigor;

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionIdState(newSession.id);
    setIsLoading(true);

    try {
      const aiResponse = await querySocraticAI(newSession, settings);

      const assistantMsg = {
        id: 'msg_socr_1',
        role: 'assistant',
        content: aiResponse.coreQuestion,
        coreQuestion: aiResponse.coreQuestion,
        reflection: aiResponse.reflection,
        hiddenAssumption: aiResponse.hiddenAssumption,
        alternativeAngle: aiResponse.alternativeAngle,
        suggestedPills: aiResponse.suggestedPills,
        depthLevel: aiResponse.depthLevel || 1,
        timestamp: new Date().toISOString()
      };

      const updatedSession = {
        ...newSession,
        depthLevel: aiResponse.depthLevel || 1,
        messages: [...newSession.messages, assistantMsg],
        thoughtTree: [
          ...newSession.thoughtTree,
          {
            id: 'node_1',
            label: aiResponse.coreQuestion.slice(0, 35) + '...',
            fullText: aiResponse.coreQuestion,
            depth: aiResponse.depthLevel || 1,
            type: 'question',
            parentId: 'node_0'
          }
        ]
      };

      updateSession(updatedSession);
      setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
      playEpiphanyChime(settings?.soundEnabled);
    } catch (err) {
      console.error('Failed to generate initial question:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // User replies to dialogue
  const handleSendMessage = async (userContent) => {
    if (!activeSession || isLoading) return;
    playMechanicalClick(settings?.soundEnabled);

    const userDepth = Math.min(5, (activeSession.depthLevel || 1) + 1);

    const userMsg = {
      id: 'msg_user_' + Date.now(),
      role: 'user',
      content: userContent,
      depthLevel: userDepth,
      timestamp: new Date().toISOString()
    };

    const sessionWithUser = {
      ...activeSession,
      depthLevel: userDepth,
      messages: [...activeSession.messages, userMsg],
      thoughtTree: [
        ...activeSession.thoughtTree,
        {
          id: 'node_u_' + Date.now(),
          label: userContent.slice(0, 30) + '...',
          fullText: userContent,
          depth: userDepth,
          type: 'answer',
          parentId: activeSession.thoughtTree[activeSession.thoughtTree.length - 1]?.id || 'node_0'
        }
      ]
    };

    updateSession(sessionWithUser);
    setSessions(prev => prev.map(s => s.id === sessionWithUser.id ? sessionWithUser : s));
    setIsLoading(true);

    try {
      const aiResponse = await querySocraticAI(sessionWithUser, settings);
      const nextDepth = aiResponse.depthLevel || Math.min(5, userDepth);

      const assistantMsg = {
        id: 'msg_socr_' + Date.now(),
        role: 'assistant',
        content: aiResponse.coreQuestion,
        coreQuestion: aiResponse.coreQuestion,
        reflection: aiResponse.reflection,
        hiddenAssumption: aiResponse.hiddenAssumption,
        alternativeAngle: aiResponse.alternativeAngle,
        suggestedPills: aiResponse.suggestedPills,
        depthLevel: nextDepth,
        timestamp: new Date().toISOString()
      };

      const finalSession = {
        ...sessionWithUser,
        depthLevel: nextDepth,
        messages: [...sessionWithUser.messages, assistantMsg],
        thoughtTree: [
          ...sessionWithUser.thoughtTree,
          {
            id: 'node_q_' + Date.now(),
            label: aiResponse.coreQuestion.slice(0, 30) + '...',
            fullText: aiResponse.coreQuestion,
            depth: nextDepth,
            type: 'question',
            parentId: sessionWithUser.thoughtTree[sessionWithUser.thoughtTree.length - 1]?.id
          }
        ]
      };

      updateSession(finalSession);
      setSessions(prev => prev.map(s => s.id === finalSession.id ? finalSession : s));
      playEpiphanyChime(settings?.soundEnabled);
    } catch (err) {
      console.error('Failed to query Socratic AI:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Tactical Superpower Action
  const handleTacticalAction = async (tacticalType) => {
    if (!activeSession || isLoading || isExecutingTactic) return;
    playMechanicalClick(settings?.soundEnabled);

    setIsExecutingTactic(true);
    try {
      const aiResponse = await queryTacticalSuperpower(activeSession, tacticalType, settings);
      const nextDepth = aiResponse.depthLevel || activeSession.depthLevel || 3;

      const assistantMsg = {
        id: 'msg_tactical_' + Date.now(),
        role: 'assistant',
        content: aiResponse.coreQuestion,
        coreQuestion: aiResponse.coreQuestion,
        reflection: aiResponse.reflection,
        hiddenAssumption: aiResponse.hiddenAssumption,
        alternativeAngle: aiResponse.alternativeAngle,
        suggestedPills: aiResponse.suggestedPills,
        depthLevel: nextDepth,
        timestamp: new Date().toISOString()
      };

      const finalSession = {
        ...activeSession,
        depthLevel: nextDepth,
        messages: [...activeSession.messages, assistantMsg],
        thoughtTree: [
          ...activeSession.thoughtTree,
          {
            id: 'node_tact_' + Date.now(),
            label: `[${tacticalType}] ` + aiResponse.coreQuestion.slice(0, 25) + '...',
            fullText: aiResponse.coreQuestion,
            depth: nextDepth,
            type: 'question',
            parentId: activeSession.thoughtTree[activeSession.thoughtTree.length - 1]?.id || 'node_0'
          }
        ]
      };

      updateSession(finalSession);
      setSessions(prev => prev.map(s => s.id === finalSession.id ? finalSession : s));
      playEpiphanyChime(settings?.soundEnabled);
    } catch (err) {
      console.error('Failed to execute tactical move:', err);
    } finally {
      setIsExecutingTactic(false);
    }
  };

  const handleSelectSession = (id) => {
    setActiveSessionIdState(id);
    setActiveSessionId(id);
  };

  const handleDeleteSession = (id) => {
    deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionIdState === id) {
      setActiveSessionIdState(null);
    }
  };

  const handleNewThoughtClick = () => {
    setActiveSessionIdState(null);
    setActiveSessionId(null);
    setPrefilledThought('');
    setPrefilledPersona('classic');
  };

  const handleSelectPreset = (preset) => {
    setPrefilledThought(preset.text);
    setPrefilledPersona(preset.persona || 'classic');
    setActiveSessionIdState(null);
    setActiveSessionId(null);
  };

  const handleSessionUpdated = (updated) => {
    setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07080b] text-zinc-100 font-sans selection:bg-zinc-700 selection:text-white">
      {/* Sidebar with history and presets */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionIdState}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onNewThought={handleNewThoughtClick}
        onSelectPreset={handleSelectPreset}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Navigation Header */}
        <Header
          activeSession={activeSession}
          onNewThought={handleNewThoughtClick}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenFaq={() => setIsFaqOpen(true)}
          onOpenThoughtTree={() => setIsThoughtTreeOpen(true)}
          onOpenSynthesis={() => setIsSynthesisOpen(true)}
          onOpenNetworkShare={() => setIsNetworkShareOpen(true)}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          sidebarOpen={sidebarOpen}
          blueprintOpen={blueprintOpen}
          onToggleBlueprint={() => setBlueprintOpen(prev => !prev)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onChangeRigor={handleChangeRigor}
          currentRigor={activeSession?.rigorMode || currentRigor}
          soundEnabled={settings.soundEnabled}
          onToggleSound={handleToggleSound}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {!activeSession ? (
            <NewThoughtForm
              onSubmit={handleStartNewThought}
              initialText={prefilledThought}
              initialPersona={prefilledPersona}
            />
          ) : (
            <DialogueView
              session={activeSession}
              settings={settings}
              onSendMessage={handleSendMessage}
              onOpenSynthesis={() => setIsSynthesisOpen(true)}
              onTacticalAction={handleTacticalAction}
              onSessionUpdated={handleSessionUpdated}
              onChangeRigor={handleChangeRigor}
              currentRigor={activeSession?.rigorMode || currentRigor}
              isLoading={isLoading}
              isExecutingTactic={isExecutingTactic}
              blueprintOpen={blueprintOpen}
              onToggleBlueprint={() => setBlueprintOpen(prev => !prev)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <ThoughtTreeModal
        session={activeSession}
        isOpen={isThoughtTreeOpen}
        onClose={() => setIsThoughtTreeOpen(false)}
        onOpenSynthesis={() => {
          setIsThoughtTreeOpen(false);
          setIsSynthesisOpen(true);
        }}
      />

      <SynthesisModal
        session={activeSession}
        settings={settings}
        isOpen={isSynthesisOpen}
        onClose={() => setIsSynthesisOpen(false)}
        onSessionUpdated={handleSessionUpdated}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsSaved={(newSettings) => setSettings(newSettings)}
      />

      <NetworkShareModal
        isOpen={isNetworkShareOpen}
        onClose={() => setIsNetworkShareOpen(false)}
        networkInfo={networkInfo}
      />

      {/* ⌘K Executive Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNewThought={() => {
          setIsCommandPaletteOpen(false);
          handleNewThoughtClick();
        }}
        onTacticalAction={(type) => {
          setIsCommandPaletteOpen(false);
          handleTacticalAction(type);
        }}
        onOpenSynthesis={() => {
          setIsCommandPaletteOpen(false);
          setIsSynthesisOpen(true);
        }}
        onOpenThoughtTree={() => {
          setIsCommandPaletteOpen(false);
          setIsThoughtTreeOpen(true);
        }}
        onOpenSettings={() => {
          setIsCommandPaletteOpen(false);
          setIsSettingsOpen(true);
        }}
        onOpenNetworkShare={() => {
          setIsCommandPaletteOpen(false);
          setIsNetworkShareOpen(true);
        }}
        onOpenFaq={() => {
          setIsCommandPaletteOpen(false);
          setIsFaqOpen(true);
        }}
        onSelectPersona={(personaId) => {
          setIsCommandPaletteOpen(false);
          if (activeSession) {
            const updated = { ...activeSession, personaId };
            updateSession(updated);
            setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
          } else {
            setPrefilledPersona(personaId);
          }
        }}
        onChangeRigor={(rigorId) => {
          setIsCommandPaletteOpen(false);
          handleChangeRigor(rigorId);
        }}
        currentRigor={activeSession?.rigorMode || currentRigor}
        currentPersonaId={activeSession?.personaId || prefilledPersona}
      />

      {/* Guide & FAQ Modal */}
      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />
    </div>
  );
}
