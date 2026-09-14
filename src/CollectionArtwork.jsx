import { Hand, MousePointer2, Play, Search } from "lucide-react";
import ProjectPoster from "./ProjectPoster.jsx";
export default function CollectionArtwork({ project: p }) {
  if (p.featured) return <ProjectPoster project={p.featured} />;
  const photo = p.repo === "Robo-Advisor" ? "robo-advisor.png" : p.repo === "Algo-Visualizer" ? "algo-visualizer.png" : null;
  return <div className={`collection-art art-${p.repo}`} aria-hidden="true">
    <div className="art-eyebrow">{p.category}<span>0{p.i+1}</span></div>
    <h3>{p.name === "Gesture Cricket" ? <>Your move.<br/><em>Literally.</em></> : p.repo === "lecture_find" ? <>Find the<br/><em>right moment.</em></> : p.repo === "Gridspace" ? <>Room for<br/><em>every idea.</em></> : p.name}</h3>
    {photo ? <img src={`${import.meta.env.BASE_URL}${photo}`} alt="" loading="lazy" decoding="async"/> : p.repo === "lecture_find" ? <div className="lecture-art"><Search size={22}/><div className="wave-bars">{Array.from({length:45},(_,i)=><i key={i} style={{height: `${15+(i*31)%70}%`}}/>)}</div><div className="lecture-time"><Play size={14}/><span>12:48</span><span>THE MOMENT IT CLICKS</span></div></div> : p.repo === "Gridspace" ? <div className="board-art"><span>IDEA</span><i/><span>BUILD</span><MousePointer2 className="board-pointer"/><small>TOGETHER</small></div> : <div className="gesture-art"><Hand size={140} strokeWidth={.75}/><div className="tracking-box"/><span>01 / YOUR MOVE</span></div>}
    <div className="art-foot">{photo ? "PROJECT SCREENSHOT" : "ILLUSTRATIVE PROJECT STUDY"}</div>
  </div>;
}
