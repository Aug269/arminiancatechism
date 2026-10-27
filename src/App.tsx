import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarView } from './components/CalendarView';
import { DayHeader } from './components/DayHeader';
import { FamilyView } from './components/FamilyView';
import { LibraryView } from './components/LibraryView';
import { LiturgicalAside } from './components/LiturgicalAside';
import { Masthead, usePwaStatus } from './components/Masthead';
import { OfficeViewer } from './components/OfficeViewer';
import { QuickHourBar } from './components/QuickHourBar';
import { WeeklyView } from './components/WeeklyView';
import { DAILY_OFFICES } from './data/offices/daily';
import { SENTENCES } from './data/offices/sentences';
import { useCurrentOffice, type HourOfficeId } from './hooks/useHourOffice';
import { usePreferences } from './hooks/usePreferences';
import { addDays, todayIso, type IsoDate } from './services/dateUtils';
import { getDailyOfficeReadings } from './services/lectionary';
import { getLiturgicalDay } from './services/liturgicalCalendar';

type ViewMode = 'oficio' | 'familia' | 'semana' | 'calendario';

const MODES: Array<{ id: ViewMode; label: string }> = [
  { id: 'oficio', label: 'Ofício Diário' },
  { id: 'familia', label: 'Famílias' },
  { id: 'semana', label: 'Semana' },
  { id: 'calendario', label: 'Calendário' },
];

export default function App() {
  const today = todayIso();
  const [date, setDate] = useState<IsoDate>(today);
  const [mode, setMode] = useState<ViewMode>('oficio');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [track, setTrack] = useState(1);

  const currentOffice = useCurrentOffice();
  const [officeId, setOfficeId] = useState<HourOfficeId>(currentOffice);

  // Ao abrir, o app escolhe o ofício da hora atual — e acompanha a mudança de hora.
  useEffect(() => {
    setOfficeId(currentOffice);
  }, [currentOffice]);

  const { preferences, increaseFont, decreaseFont, toggleTheme, fontLabel } = usePreferences();
  const decrease = decreaseFont;
  const pwa = usePwaStatus();

  const day = useMemo(() => getLiturgicalDay(date), [date]);
  const readings = useMemo(() => getDailyOfficeReadings(day), [day]);
  const office = DAILY_OFFICES.find((item) => item.id === officeId) ?? DAILY_OFFICES[0];

  const sentence = useMemo(() => {
    if (day.movableFeastTitle) {
      const pool = SENTENCES[day.season];
      if (pool?.length) return pool[0];
    }
    const key = day.feasts[0]?.collectId;
    if (key) {
      const pool = SENTENCES[day.season];
      if (pool?.length) return pool[day.day % pool.length];
    }
    const pool = SENTENCES[day.season] ?? SENTENCES.afterPentecost;
    return pool[(day.year * 372 + day.month * 31 + day.day) % pool.length] ?? '';
  }, [day]);

  const shiftDate = useCallback((delta: number) => {
    setDate((current) => addDays(current, delta));
  }, []);

  const handlePickDate = useCallback((value: string) => {
    setDate(value);
  }, []);

  const goToday = useCallback(() => {
    setDate(todayIso());
    setOfficeId(currentOffice);
  }, [currentOffice]);

  const openCalendar = useCallback(() => setLibraryOpen(false), []);

  return (
    <div className="app">
      <Masthead
        preferences={preferences}
        fontLabel={fontLabel}
        onIncreaseFont={increaseFont}
        onDecreaseFont={decrease}
        onToggleTheme={toggleTheme}
        onInstall={() => void pwa.install()}
        canInstall={pwa.canInstall}
        offline={pwa.offline}
        onOpenLibrary={() => setLibraryOpen((value) => !value)}
      />

      <div className="shell" style={{ flex: '1 0 auto' }}>
        <DayHeader
          day={day}
          today={today}
          onShift={shiftDate}
          onPickDate={handlePickDate}
          onToday={goToday}
        />

        <QuickHourBar current={officeId} now={currentOffice} onChange={setOfficeId} />

        <div className="mode-switch" role="tablist" aria-label="Modos do aplicativo">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              onClick={() => {
                setMode(item.id);
                setLibraryOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {libraryOpen ? (
          <LibraryView onClose={() => setLibraryOpen(false)} />
        ) : (
          <>
            {mode === 'oficio' && (
              <div className="layout">
                <OfficeViewer
                  office={office}
                  day={day}
                  readings={readings}
                  sentence={sentence}
                  track={track}
                  onTrackChange={setTrack}
                  onToggleTheme={toggleTheme}
                  theme={preferences.theme}
                />
                <LiturgicalAside day={day} onOpenCalendar={openCalendar} />
              </div>
            )}

            {mode === 'familia' && (
              <FamilyView
                day={day}
                readings={readings}
                sentence={sentence}
                onToggleTheme={toggleTheme}
                theme={preferences.theme}
              />
            )}

            {mode === 'semana' && <WeeklyView day={day} />}

            {mode === 'calendario' && (
              <CalendarView
                selected={date}
                today={today}
                onSelect={(value) => {
                  setDate(value);
                  setMode('oficio');
                }}
                onGoToOffice={() => setMode('oficio')}
              />
            )}
          </>
        )}
      </div>

      <footer className="site-footer">
        <div className="shell">
          <p>
            <strong>Ofício Diário &amp; Lecionário</strong> · Rede Episcopal Brasileira —
            oração da manhã, meio-dia, tarde e completas, coletas do ano cristão e lecionário
            bíblico.
          </p>
          <p>
            Texto bíblico: versão Almeida em português. Lecionário Comum Revisado e Ofício
            Diário segundo o Livro de Oração Comum. Conteúdo disponível offline depois da
            primeira visita.
          </p>
          <p className="offline-badge" data-offline={pwa.offline}>
            <span className="dot" /> {pwa.offline ? 'A usar conteúdo guardado' : 'Ligado · conteúdo sincronizado'}
          </p>
        </div>
      </footer>
    </div>
  );
}
