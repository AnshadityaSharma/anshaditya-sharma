import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  X,
  Search,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  List,
} from "lucide-react";
import { collection, groups } from "./collection.js";
import { github } from "./data.js";
import CollectionArtwork from "./CollectionArtwork.jsx";

export default function ProjectArchive({ open, onClose, paused, onFeatured }) {
  const dialog = useRef(null),
    [query, setQuery] = useState(""),
    [group, setGroup] = useState("All"),
    [view, setView] = useState("grid"),
    [selected, setSelected] = useState(null);
  const scrollPosition = useRef(0);
  const transition = (update) => {
    if (!paused && document.startViewTransition) document.startViewTransition(() => flushSync(update));
    else update();
  };
  useLayoutEffect(() => {
    if (open && !selected) dialog.current.scrollTop = scrollPosition.current;
  }, [selected, open]);
  useEffect(() => {
    if (open && !dialog.current.open) dialog.current.showModal();
    else if (!open && dialog.current.open) dialog.current.close();
  }, [open]);
  const filtered = collection.filter(
    (p) =>
      (group === "All" || p.group === group) &&
      `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  const choose = (p) => {
    scrollPosition.current = dialog.current.scrollTop;
    if (p.featured) onFeatured(p.featured);
    else {
      transition(() => setSelected(p));
      dialog.current.scrollTo({
        top: 0,
        behavior: paused ? "instant" : "smooth",
      });
    }
  };
  return (
    <dialog
      ref={dialog}
      className={`project-library ${paused ? "library-still" : ""}`}
      aria-label="All projects"
      onClose={onClose}
    >
      <header className="library-header">
        <span>ANSHADITYA SHARMA / WORK INDEX</span>
        <button
          className="icon-button"
          aria-label="Close all projects"
          onClick={onClose}
        >
          <X />
        </button>
      </header>
      {selected ? (
        <section className="library-detail" key={selected.repo}>
          <button className="text-link" onClick={() => transition(() => setSelected(null))}>
            <ArrowLeft size={18} />
            All projects
          </button>
          <p className="library-kicker">
            {selected.group} / {selected.category}
          </p>
          <h2>
            {selected.name}
            <span>.</span>
          </h2>
          <p className="library-description">{selected.description}</p>
          <div className="library-detail-art" style={{viewTransitionName:`art-${selected.repo}`}}><CollectionArtwork project={selected} /></div>
          <div className="library-project-links">
            <a
              href={`${github}/${selected.repo}`}
              target="_blank"
              rel="noreferrer"
            >
              View repository
              <ArrowUpRight />
            </a>
            <a
              href={`${github}/${selected.repo}#readme`}
              target="_blank"
              rel="noreferrer"
            >
              Read the documentation
              <ArrowUpRight />
            </a>
          </div>
          <div className="library-detail-footer">
            <span>MORE TO EXPLORE</span>
            {collection
              .filter((p) => p.group === selected.group && p.i !== selected.i)
              .slice(0, 3)
              .map((p) => (
                <button key={p.repo} onClick={() => choose(p)}>
                  {p.name}
                  <ArrowUpRight size={19} />
                </button>
              ))}
          </div>
        </section>
      ) : (
        <>
          <section className="library-title">
            <div>
              <span>THE COMPLETE COLLECTION</span>
              <h2>
                Built out of
                <br />
                <em>curiosity.</em>
                <sup>{collection.length}</sup>
              </h2>
            </div>
            <p>
              Systems, simulations,
              <br />
              and questions worth following.
            </p>
          </section>
          <div className="library-toolbar">
            <div className="library-filters" aria-label="Project categories">
              {groups.map((g) => (
                <button
                  key={g}
                  aria-pressed={group === g}
                  onClick={() => transition(() => setGroup(g))}
                >
                  {g}
                  <sup>
                    {g === "All"
                      ? collection.length
                      : collection.filter((p) => p.group === g).length}
                  </sup>
                </button>
              ))}
            </div>
            <label className="library-search">
              <Search size={17} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a project"
                aria-label="Find a project"
              />
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery("")}>
                  <X size={16} />
                </button>
              )}
            </label>
            <div className="library-view">
              <button
                className="icon-button"
                aria-label="Gallery view"
                title="Gallery view"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
              >
                <LayoutGrid size={19} />
              </button>
              <button
                className="icon-button"
                aria-label="Index view"
                title="Index view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                <List size={19} />
              </button>
            </div>
          </div>
          <section
            className={`library-projects library-${view}`}
            aria-label="Projects"
            key={`${group}-${query}-${view}`}
          >
            {filtered.map((p, i) => (
              <button
                key={p.repo}
                className={`library-project ${p.featured ? "is-featured" : ""}`}
                onClick={() => choose(p)}
                style={{ "--entry": Math.min(i, 8) }}
              >
                <div className="library-cover" style={{viewTransitionName:`art-${p.repo}`}}>
                  <CollectionArtwork project={p} />
                  <span className="library-cover-arrow">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="library-entry">
                  <span>{String(p.i + 1).padStart(2, "0")}</span>
                  <h3>{p.name}</h3>
                  <small>{p.group}</small>
                  <ArrowUpRight size={20} />
                </div>
              </button>
            ))}
          </section>
          {!filtered.length && (
            <div className="library-empty">
              <h3>No matches yet.</h3>
              <button
                className="text-link"
                onClick={() => {
                  setQuery("");
                  setGroup("All");
                }}
              >
                Reset filters
                <ArrowRight size={17} />
              </button>
            </div>
          )}
          <footer className="library-footer">
            <span>{filtered.length} PROJECTS / ALWAYS CURIOUS</span>
            <a href={github} target="_blank" rel="noreferrer">
              On GitHub
              <ArrowUpRight size={17} />
            </a>
          </footer>
        </>
      )}
    </dialog>
  );
}
