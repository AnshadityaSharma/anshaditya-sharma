import { X, ArrowUpRight, ArrowRight } from "lucide-react";
import ProjectPoster from "./ProjectPoster.jsx";
const stories = {
  exchange: {
    question: "What makes a market fair when everything happens at once?",
    approach:
      "Make the matching path explicit. Orders are ranked by price and time; money stays in integers; database writes happen outside the critical path.",
    pipeline: [
      "Order entry",
      "Price-time matching",
      "Execution stream",
      "Persistence",
    ],
    lesson:
      "Measure the engine separately from the API. Throughput means little without knowing exactly what was measured.",
  },
  ground: {
    question:
      "What should an autonomous system do when its original plan stops being safe?",
    approach:
      "Monitor the constraints throughout the mission, not just before take-off. Replan coverage or reroute around new restrictions, then verify that the flight controller has accepted the update.",
    pipeline: [
      "Mission constraints",
      "Coverage planner",
      "A* rerouting",
      "PX4 confirmation",
    ],
    lesson:
      "Issuing a new command is not the same as completing a safe handover. Confirmation belongs in the control loop.",
  },
  anomaly: {
    question:
      "Can an alert explain why an ordinary-looking session is unusual?",
    approach:
      "Compare multiple model families, build rolling behavioral baselines, and expose feature contributions. Evaluate on a time-based split to keep future information out of training.",
    pipeline: [
      "Session features",
      "Rolling baselines",
      "Ensemble scoring",
      "SHAP explanation",
    ],
    lesson:
      "A strong aggregate score can hide weak spots. Alert budgets, cold starts, and ranking behavior need their own inspection.",
  },
  evo: {
    question: "Can useful movement emerge without programming the footsteps?",
    approach:
      "Evolve controllers inside a rigid-body simulation. Reward forward progress and efficiency, discourage exploitative launches, and preserve recorded trajectories for inspection.",
    pipeline: [
      "Population",
      "Physics simulation",
      "Fitness selection",
      "Mutation + replay",
    ],
    lesson:
      "The reward function shapes the behavior. A simulation is most interesting when it reveals what the objective accidentally encouraged.",
  },
};
export default function ProjectStory({ project, onClose, onNext, paused }) {
  const s = stories[project.id];
  return (
    <div className="story-content">
      <header className="story-header">
        <span>{project.number} / SELECTED WORK</span>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close project"
        >
          <X />
        </button>
      </header>
      <section className="story-opening">
        <div className="story-intro">
          <p className="project-category">{project.category}</p>
          <h2 id="detail-title">{project.fullTitle}</h2>
          <p>{project.description}</p>
          <div className="story-actions">
            <a href={project.repo} target="_blank" rel="noreferrer">
              Repository
              <ArrowUpRight size={16} />
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer">
                {project.liveLabel || "Live project"}
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
        <div className="story-visual" style={{ background: project.color }}>
          <ProjectPoster project={project} />
          <span>PROJECT OVERVIEW</span>
        </div>
      </section>
      <section className="story-question">
        <span>01 / THE QUESTION</span>
        <h3>{s.question}</h3>
      </section>
      <section className="story-method">
        <div>
          <span>02 / THE BUILD</span>
          <h3>Inside the system.</h3>
          <p>{project.detail}</p>
          <p>{s.approach}</p>
        </div>
        <ol>
          {s.pipeline.map((step, i) => (
            <li key={step}>
              <small>0{i + 1}</small>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>
      <section className="story-result">
        <div>
          <span>03 / THE EVIDENCE</span>
          <strong>{project.stat}</strong>
          <p>{project.unit}</p>
        </div>
        <div>
          <p>{project.note}</p>
          <a
            href={project.source}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Read the evidence
            <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
      <section className="story-learning">
        <span>04 / WHAT STAYED WITH ME</span>
        <h3>{s.lesson}</h3>
        <div className="detail-stack">
          {project.stack.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </section>
      <button className="story-next" onClick={onNext}>
        <span>KEEP EXPLORING</span>
        <strong>Next project</strong>
        <ArrowRight size={44} />
      </button>
    </div>
  );
}
