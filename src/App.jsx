import { useEffect, useRef, useState } from 'react';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0';
const HOME = 'https://www.xbox.com/play';
const L = window.launcher;

export default function App() {
  const view = useRef(null);
  const [loading, setLoading] = useState(true);
  const [fs, setFs] = useState(false);
  const [pads, setPads] = useState(0);
  const [canBack, setCanBack] = useState(false);

  useEffect(() => {
    const wv = view.current;
    const sync = () => { setLoading(false); setCanBack(wv.canGoBack()); };
    wv.addEventListener('did-start-loading', () => setLoading(true));
    wv.addEventListener('did-stop-loading', sync);
    L?.onFullscreen(setFs);

    const key = (e) => {
      if (e.key === 'F11') L?.win('fullscreen');
      if (e.key === 'F5') wv.reload();
    };
    window.addEventListener('keydown', key);

    const poll = setInterval(() => {
      setPads([...navigator.getGamepads()].filter(Boolean).length);
    }, 1500);
    return () => { window.removeEventListener('keydown', key); clearInterval(poll); };
  }, []);

  const go = (fn) => view.current && fn(view.current);

  return (
    <div className={`shell ${fs ? 'is-fs' : ''} ${L?.platform === 'darwin' ? 'mac' : ''}`}>
      <header className="bar">
        <div className="brand"><span className="orb" />xcloud<span className="dim">/launcher</span></div>
        <nav className="nav">
          <button disabled={!canBack} onClick={() => go((w) => w.goBack())} title="Back">←</button>
          <button onClick={() => go((w) => w.loadURL(HOME))} title="Home">⌂</button>
          <button onClick={() => go((w) => w.reload())} title="Reload (F5)">↻</button>
        </nav>
        <div className={`pad ${pads ? 'on' : ''}`}>{pads ? `${pads} controller${pads > 1 ? 's' : ''}` : 'no controller'}</div>
        <div className="drag" />
        <button className="fsbtn" onClick={() => L?.win('fullscreen')}>FULLSCREEN · F11</button>
        {L?.platform !== 'darwin' && (
          <div className="winctl">
            <button onClick={() => L.win('min')}>—</button>
            <button onClick={() => L.win('max')}>▢</button>
            <button className="x" onClick={() => L.win('close')}>✕</button>
          </div>
        )}
      </header>
      <div className={`progress ${loading ? 'run' : ''}`} />
      <webview
        ref={view}
        className="view"
        src={HOME}
        partition="persist:xcloud"
        useragent={UA}
        allowpopups="true"
      />
    </div>
  );
}
