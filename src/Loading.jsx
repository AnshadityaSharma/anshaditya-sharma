import { useEffect, useState } from "react";
export default function Loading({ ready, onComplete, paused }) {
  const [fonts, setFonts] = useState(false),
    [leaving, setLeaving] = useState(false);
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => alive && setFonts(true));
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (ready && fonts) {
      const timer = setTimeout(() => setLeaving(true), paused ? 0 : 650);
      return () => clearTimeout(timer);
    }
  }, [ready, fonts, paused]);
  useEffect(() => {
    if (leaving) {
      const timer = setTimeout(onComplete, paused ? 0 : 950);
      return () => clearTimeout(timer);
    }
  }, [leaving, onComplete, paused]);
  useEffect(() => {
    const timer = setTimeout(() => setLeaving(true), 6500);
    return () => clearTimeout(timer);
  }, []);
  const progress = ready && fonts ? 100 : ready ? 85 : fonts ? 25 : 0;
  return (
    <div
      className={`precision-loader ${leaving ? "is-leaving" : ""} ${paused ? "is-still" : ""}`}
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="loader-meta">
        <span>ANSHADITYA SHARMA</span>
        <span>ENGINEER & BUILDER</span>
      </div>
      <div className="loader-letter" aria-hidden="true">
        <span>A</span>
        <span className="loader-letter-light">A</span>
      </div>
      <div className="loader-rule">
        <i style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <div className="loader-footer">
        <span className="loader-percent">
          {String(progress).padStart(3, "0")}
        </span>
        <span>
          THINK DEEPER.
          <br />
          BUILD BETTER.
        </span>
      </div>
    </div>
  );
}
