import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { ArtDefs } from './art/kit';
import { SFX } from './audio/sfx';
import { Voice } from './audio/voice';
import { INTRO } from './content/lines';
import { Finale } from './screens/Finale';
import { Garden } from './screens/Garden';
import { Growth } from './screens/Growth';
import { Intro } from './screens/Intro';
import { Level } from './screens/Level';
import { Title } from './screens/Title';
import { Stage } from './stage/Stage';
import { useGame } from './state/store';
import { IconButton } from './ui/Button';
import { IconFull, IconSound } from './ui/icons';
import { FxLayer, WorldLayer } from './world/Layers';

function Controls() {
  const sound = useGame(s => s.sound);
  const setSound = useGame(s => s.setSound);
  return (
    <div className="controls">
      <IconButton label={sound ? 'Turn sound off' : 'Turn sound on'} onClick={() => {
        const on = !sound;
        setSound(on); Voice.enabled = on; SFX.enabled = on;
      }}><IconSound on={sound} /></IconButton>
      <IconButton label="Full screen" onClick={() => {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.().catch(() => {});
      }}><IconFull /></IconButton>
    </div>
  );
}

const SCREENS = { title: Title, intro: Intro, garden: Garden, level: Level, growth: Growth, finale: Finale };

export default function App() {
  const screen = useGame(s => s.screen);
  const levelIndex = useGame(s => s.levelIndex);
  const Screen = SCREENS[screen];

  useEffect(() => {
    // browsers only allow sound after the first touch
    const unlock = () => SFX.unlock();
    window.addEventListener('pointerdown', unlock, { capture: true });
    const noMenu = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', noMenu);
    Voice.preload(INTRO);
    return () => { window.removeEventListener('pointerdown', unlock, { capture: true }); document.removeEventListener('contextmenu', noMenu); };
  }, []);

  return (
    <>
      <ArtDefs />
      <WorldLayer />
      <Stage>
        <AnimatePresence mode="wait">
          <motion.div key={screen === 'level' ? `level-${levelIndex}` : screen} className="screen-holder"
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .97 }}
            transition={{ duration: .35, ease: 'easeOut' }}>
            <Screen />
          </motion.div>
        </AnimatePresence>
        <Controls />
      </Stage>
      <FxLayer />
    </>
  );
}
