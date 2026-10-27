import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import type { Preferences } from '../hooks/usePreferences';

export interface MastheadProps {
  preferences: Preferences;
  fontLabel: string;
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
  onToggleTheme: () => void;
  onInstall: () => void;
  canInstall: boolean;
  offline: boolean;
  onOpenLibrary: () => void;
}

/** Barra superior: identidade, controles de leitura e instalação. */
export function Masthead({
  preferences,
  fontLabel,
  onIncreaseFont,
  onDecreaseFont,
  onToggleTheme,
  onInstall,
  canInstall,
  offline,
  onOpenLibrary,
}: MastheadProps) {
  return (
    <header className="masthead">
      <div className="shell masthead-inner">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Icon name="cross" size={20} />
          </span>
          <div className="brand-text">
            <div className="brand-kicker">Rede Episcopal Brasileira</div>
            <div className="brand-title">Ofício Diário &amp; Lecionário</div>
          </div>
        </div>

        <div className="toolbar">
          <span className="offline-badge" data-offline={offline} title={offline ? 'Sem conexão — usando o conteúdo salvo' : 'Conteúdo disponível offline'}>
            <span className="dot" />
            {offline ? 'Offline' : 'Offline pronto'}
          </span>

          <div className="font-control" role="group" aria-label="Tamanho do texto">
            <button type="button" onClick={onDecreaseFont} aria-label="Diminuir o texto">
              A−
            </button>
            <span className="value" aria-live="polite">
              {fontLabel}
            </span>
            <button type="button" onClick={onIncreaseFont} aria-label="Aumentar o texto">
              A+
            </button>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onToggleTheme}
            aria-pressed={preferences.theme === 'night'}
            aria-label={preferences.theme === 'night' ? 'Modo diurno' : 'Modo noturno'}
            title={preferences.theme === 'night' ? 'Modo diurno' : 'Modo noturno'}
          >
            <Icon name={preferences.theme === 'night' ? 'sun' : 'moon'} />
          </button>

          <button
            type="button"
            className="icon-button"
            onClick={onOpenLibrary}
            aria-label="Biblioteca litúrgica"
            title="Biblioteca litúrgica"
          >
            <Icon name="library" />
          </button>

          {canInstall && (
            <button type="button" className="icon-button" onClick={onInstall} title="Instalar aplicativo">
              <Icon name="download" />
              <span className="label">Instalar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/** Registra a disponibilidade de instalação e o estado da conexão. */
export function usePwaStatus() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [offline, setOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setInstalled(true);
    setInstallEvent(null);
  };

  return { canInstall: Boolean(installEvent) && !installed, install, offline, installed };
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
