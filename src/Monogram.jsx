import { useEffect, useRef, useState } from "react";

export default function Monogram({
  paused,
  onReady,
  night,
  suspended,
  loading,
}) {
  const host = useRef(null);
  const settings = useRef({ paused, night, suspended });
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    settings.current = { paused, onReady, night, suspended, loading };
  }, [paused, onReady, night, suspended, loading]);
  useEffect(() => {
    let cancelled = false,
      dispose;
    import("./sculpture.js")
      .then(({ createSculpture }) => {
        if (cancelled) return;
        try {
          dispose = createSculpture(host.current, settings);
        } catch {
          setFailed(true);
          settings.current.onReady?.();
        }
      })
      .catch(() => {
        setFailed(true);
        settings.current.onReady?.();
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);
  return (
    <div className="sculpture" ref={host} aria-hidden="true">
      {failed && <div className="sculpture-fallback">as.</div>}
    </div>
  );
}
