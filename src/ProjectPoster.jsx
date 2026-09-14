import { ArrowUpRight, ScanLine, Route, Activity } from "lucide-react";
export default function ProjectPoster({ project }) {
  const type = project.id;
  return (
    <div className={`project-poster poster-${type}`} aria-hidden="true">
      <div className="poster-top">
        <span>AS / {project.category}</span>
        <span>
          0{["exchange", "ground", "anomaly", "evo"].indexOf(type) + 1}
        </span>
      </div>
      {type === "exchange" ? (
        <>
          <div className="poster-word">
            MARKET
            <br />
            <em>mechanics.</em>
          </div>
          <div className="order-study">
            <div className="order-head">
              <span>BID / BUY</span>
              <span>ASK / SELL</span>
            </div>
            {Array.from({ length: 9 }, (_, i) => (
              <div className="order-row" key={i}>
                <span style={{ "--size": `${35 + ((i * 17) % 65)}%` }}>
                  {(64210 - i * 0.5).toFixed(2)}
                </span>
                <span style={{ "--size": `${25 + ((i * 23) % 75)}%` }}>
                  {(64210.5 + i * 0.5).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="poster-caption">PRICE. TIME. PRIORITY.</div>
        </>
      ) : type === "ground" ? (
        <>
          <div className="poster-word">
            A different
            <br />
            <em>way home.</em>
          </div>
          <div className="route-study">
            <svg viewBox="0 0 600 360">
              <defs>
                <pattern
                  id="topo"
                  width="55"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 35 Q27 -15 55 35"
                    fill="none"
                    stroke="currentColor"
                    opacity=".17"
                  />
                </pattern>
              </defs>
              <rect width="600" height="360" fill="url(#topo)" />
              <path
                d="M50 310L160 230L235 265L340 100L490 65"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 7"
              />
              <path
                d="M50 310L160 230L190 120L290 60L390 150L490 65"
                fill="none"
                stroke="#465cff"
                strokeWidth="5"
              />
              <circle
                cx="290"
                cy="205"
                r="64"
                fill="none"
                stroke="currentColor"
                strokeDasharray="3 5"
              />
              <circle cx="50" cy="310" r="7" fill="currentColor" />
              <circle cx="490" cy="65" r="9" fill="#465cff" />
            </svg>
            <Route size={36} />
          </div>
          <div className="poster-caption">MISSION / ADAPT / RETURN</div>
        </>
      ) : type === "anomaly" ? (
        <>
          <div className="poster-word">
            Normal is
            <br />
            <em>not a constant.</em>
          </div>
          <div className="signal-study">
            <div className="signal-scan" />
            {Array.from({ length: 96 }, (_, i) => (
              <i
                key={i}
                className={i % 23 === 0 ? "outlier" : ""}
                style={{
                  left: `${8 + ((i * 17) % 84)}%`,
                  top: `${15 + ((i * 31) % 68)}%`,
                }}
              />
            ))}
            <ScanLine size={55} />
          </div>
          <div className="poster-caption">
            22 FEATURES / A DIFFERENT PERSPECTIVE
          </div>
        </>
      ) : (
        <>
          <div className="poster-word">
            Progress isn't
            <br />
            <em>a straight line.</em>
          </div>
          <div className="evolution-study">
            {[0, 1, 2, 3, 4].map((n) => (
              <svg key={n} viewBox="0 0 100 100" style={{ "--generation": n }}>
                <path
                  d={`M12 ${70 - n * 5} L35 ${40 + n * 2} L62 45 L88 ${70 - n * 4} M35 ${40 + n * 2}L30 85 M62 45L70 83`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                {[
                  [12, 70 - n * 5],
                  [35, 40 + n * 2],
                  [62, 45],
                  [88, 70 - n * 4],
                  [30, 85],
                  [70, 83],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="5" fill="currentColor" />
                ))}
              </svg>
            ))}
          </div>
          <div className="poster-caption">SELECTION / MUTATION / MOVEMENT</div>
        </>
      )}
      <span className="poster-study-label">
        {type === "evo"
          ? "LOCOMOTION STUDY / ILLUSTRATIVE"
          : "SYSTEM STUDY / ILLUSTRATIVE"}
      </span>
      <ArrowUpRight className="poster-arrow" size={30} />
    </div>
  );
}
