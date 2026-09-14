import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  X,
  Pause,
  Play,
  Sun,
  Moon,
  Download,
  Copy,
  Check,
  Asterisk,
  Menu,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Monogram from "./Monogram.jsx";
import ProjectPoster from "./ProjectPoster.jsx";
import ProjectStory from "./ProjectStory.jsx";
import ProjectArchive from "./ProjectArchive.jsx";
import Loading from "./Loading.jsx";
import { projects, github } from "./data.js";

import { collection } from "./collection.js";

gsap.registerPlugin(ScrollTrigger);
const email = "anshadityasharma23@gmail.com";
const resume = `${import.meta.env.BASE_URL}Anshaditya-Sharma-Resume.pdf`;

function External({ href, children, className = "" }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}

export default function App() {
  const [paused, setPaused] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [night, setNight] = useState(() => {
    try { return (localStorage.getItem("portfolio-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day")) === "night"; }
    catch { return false; }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = night ? "night" : "day";
    try { localStorage.setItem("portfolio-theme", night ? "night" : "day"); } catch {}
  }, [night]);
  const toggleTheme = () => {
    const update = () => setNight(v => !v);
    if (!paused && document.startViewTransition) document.startViewTransition(update);
    else update();
  };
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [more, setMore] = useState(false);
  const archiveOrigin = useRef(false);
  const closeProject = () => {
    setSelected(null);
    if (archiveOrigin.current) {
      archiveOrigin.current = false;
      setMore(true);
    }
  };
  const [sceneReady, setSceneReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const ready = useCallback(() => setSceneReady(true), []);
  const finishLoading = useCallback(() => setLoading(false), []);
  const [clock, setClock] = useState("");
  const menu = useRef(null),
    detail = useRef(null),
    app = useRef(null),
    copyTimer = useRef(null);

  useEffect(() => {
    const update = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    update();
    const interval = setInterval(update, 30000);
    return () => {
      clearInterval(interval);
      clearTimeout(copyTimer.current);
    };
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPaused(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("motion-paused", paused);
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.to(".page-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: app.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      if (paused) return;
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.from(".hero-meta", {
        y: 16,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
      });
      intro.from(
        ".name-line span",
        { yPercent: 110, rotate: 3, duration: 1.2, stagger: 0.1 },
        0.1,
      );
      intro.from(".hero-bottom", { opacity: 0, y: 15, duration: 0.8 }, 0.6);
      const sequence = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-wrap",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      sequence.to(".hero-name", { y: -65, opacity: 0, duration: 0.42 }, 0);
      sequence.to(".hero-meta, .hero-bottom", { opacity: 0, duration: 0.3 }, 0);
      gsap.utils.toArray("[data-reveal]").forEach((element) =>
        gsap.from(element, {
          y: 45,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        }),
      );
      gsap.fromTo(
        ".about-heading .word",
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-heading",
            start: "top 85%",
            end: "bottom 48%",
            scrub: 0.7,
          },
        },
      );
      gsap.to(".kinetic-track", {
        xPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".kinetic",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to(".turning-star", {
        rotation: 180,
        ease: "none",
        scrollTrigger: {
          trigger: ".about",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.utils.toArray(".project-image").forEach((element) =>
        gsap.fromTo(
          element,
          { clipPath: "inset(10% 5% 10% 5%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              end: "top 35%",
              scrub: 0.7,
            },
          },
        ),
      );
    }, app);
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    return () => ctx.revert();
  }, [paused, loading]);
  useEffect(() => {
    const dialog = menu.current;
    if (menuOpen && !dialog.open) dialog.showModal();
    else if (!menuOpen && dialog.open) dialog.close();
  }, [menuOpen]);
  useEffect(() => {
    const dialog = detail.current;
    if (selected && !dialog.open) dialog.showModal();
    else if (!selected && dialog.open) dialog.close();
  }, [selected]);
  useEffect(() => {
    document.body.classList.toggle(
      "dialog-open",
      menuOpen || !!selected || more || loading,
    );
    return () => document.body.classList.remove("dialog-open");
  }, [menuOpen, selected, more, loading]);
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [more]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyError(false);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  }
  const closeMenu = () => setMenuOpen(false);

  return (
    <div ref={app} className="portfolio">
      {loading && (
        <Loading
          ready={sceneReady}
          onComplete={finishLoading}
          paused={paused}
        />
      )}
      <ProjectArchive
        open={more}
        onClose={() => setMore(false)}
        paused={paused}
        onFeatured={(project) => {
          archiveOrigin.current = true;
          setMore(false);
          setSelected(project);
        }}
      />
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <div className="page-progress" aria-hidden="true" />
      <header className="header">
        <a href="#home" className="brand" aria-label="Anshaditya Sharma home">
          a<span>s</span>
          <i />
        </a>
        <span className="header-note">ENGINEER & BUILDER</span>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#work">
            Work <sup>04</sup>
          </a>
          <button onClick={() => setMore(true)} aria-haspopup="dialog">
            All projects <sup>{collection.length}</sup>
          </button>
          <a href="#contact">
            Let's talk <ArrowUpRight size={14} />
          </a>
        </nav>
        <button className="theme-toggle icon-button" onClick={toggleTheme}
          aria-label={night ? "Switch to day mode" : "Switch to night mode"}
          title={night ? "Switch to day mode" : "Switch to night mode"}>
          {night ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          className="menu-toggle icon-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          <Menu size={23} />
        </button>
      </header>

      <div className="journey-scene">
        <Monogram loading={loading} paused={paused} suspended={more || !!selected || menuOpen} onReady={ready} night={night} />
      </div>
      <main>
        <section className="hero-wrap" id="home" aria-label="Introduction">
          <div className="hero-stage">
            <div className="hero-meta">
              <p>
                INDEPENDENT MIND.
                <br />
                ENGINEERING INSTINCT.
              </p>
            </div>
            <h1 className="hero-name">
              <span className="name-line">
                <span>ANSHADITYA</span>
              </span>
              <span className="name-line second">
                <span>
                  SHARMA<span className="name-dot">.</span>
                </span>
              </span>
            </h1>
            <div className="hero-bottom">
              <a href="#about" className="scroll-link">
                <span className="circle-arrow">
                  <ArrowDown size={18} />
                </span>
                <span>A LITTLE ABOUT ME</span>
              </a>
              <p>
                Software engineer.
                <br />
                Curious by default.
                <br />
                <span>VIT Chennai / Class of 2027</span>
              </p>
            </div>
            <div className="hero-edge">
              <span>ANSHADITYA SHARMA / PERSONAL PORTFOLIO</span>
              <span>
                SCROLL TO UNFOLD <ArrowDown size={12} />
              </span>
            </div>
          </div>
        </section>

        <section className="about pad" id="about">
          <div className="section-label">
            <span>01 / THE PERSON</span>
            <Asterisk className="turning-star" size={72} strokeWidth={1.4} />
          </div>
          <h2 className="about-heading">
            {"I ask questions. Then I build things."
              .split(" ")
              .map((word, i) => (
                <span className="word" key={i}>
                  {word}{" "}
                </span>
              ))}
          </h2>
          <div className="about-bottom">
            <p className="margin-note" data-reveal>
              A LITTLE LOGIC.
              <br />A LOT OF CURIOSITY.
            </p>
            <div data-reveal>
              <p className="intro-copy">
                I'm Anshaditya, a computer science student at VIT Chennai. I
                like understanding how things work, right down to the parts most
                people never see.
              </p>
              <p className="body-copy">
                Sometimes that means building a trading engine. Sometimes it
                means teaching a simulated body to move, or helping a drone find
                another way home. The common thread is the same: an interesting
                question, followed all the way through.
              </p>
              <a
                href={resume}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                The one-page version <Download size={18} />
              </a>
            </div>
          </div>
        </section>

        <section className="kinetic" aria-label="Code meets curiosity">
          <div className="kinetic-track" aria-hidden="true">
            <span>CODE.</span>
            <em>CURIOSITY.</em>
            <Asterisk />
            <span>CRAFT.</span>
            <em>CURIOSITY.</em>
          </div>
        </section>

        <section className="work pad" id="work">
          <div className="section-label">
            <span>02 / SELECTED WORK</span>
            <span>2025 — 2026</span>
          </div>
          <div className="work-heading" data-reveal>
            <h2>
              Ideas, made
              <br />
              <em>tangible.</em>
            </h2>
            <p>
              A few things I've spent
              <br />a lot of time thinking about.
              <br />
              And even more time building.
            </p>
          </div>
          <div className="work-grid">
            {projects.map((project) => (
              <article
                className={`project project-${project.id}`}
                key={project.id}
              >
                <button
                  className="project-image"
                  onClick={() => setSelected(project)}
                  aria-label={`Explore ${project.fullTitle}`}
                  style={{ "--project-color": project.color }}
                >
                  <ProjectPoster project={project} />
                </button>
                <div className="project-info">
                  <div>
                    <span className="feature-number">/{project.number}</span>
                    <p className="project-category">{project.category}</p>
                    <h3>
                      <button onClick={() => setSelected(project)}>
                        {project.title}
                      </button>
                    </h3>
                  </div>
                  <span className="project-year">/{project.year}</span>
                </div>
                <p className="project-description">{project.description}</p>
                <button
                  className="project-story-link text-link"
                  onClick={() => setSelected(project)}
                >
                  Explore the story
                  <ArrowUpRight size={18} />
                </button>
              </article>
            ))}
          </div>
          <div className="archive-head collection-entrance">
            <div>
              <span className="project-category">
                THE COMPLETE COLLECTION / {collection.length} PROJECTS
              </span>
              <h3>
                Beyond the
                <br />
                <em>selected few.</em>
              </h3>
            </div>
            <button
              className="text-link"
              onClick={() => setMore((v) => !v)}
              aria-expanded={more}
              aria-haspopup="dialog"
            >
              Explore all projects
              <ArrowUpRight size={26} />
            </button>
          </div>
        </section>

        <section className="range pad" id="approach">
          <div className="section-label">
            <span>03 / HOW I THINK</span>
            <span>ALWAYS A WORK IN PROGRESS</span>
          </div>
          <div className="range-title" data-reveal>
            <h2>
              Deep in the details.
              <br />
              <em>Eyes on the whole.</em>
            </h2>
          </div>
          <div className="approach-grid">
            <article data-reveal>
              <span className="small-index">/01</span>
              <h3>Understand it.</h3>
              <p>
                I enjoy the unglamorous questions. What happens when the network
                drops? Where does the time go? Which assumption breaks first?
              </p>
              <div className="tool-list">
                SYSTEM DESIGN / DSA / NETWORKS / DATABASES
              </div>
            </article>
            <article data-reveal>
              <span className="small-index">/02</span>
              <h3>Make it work.</h3>
              <p>
                From a small API to a simulation loop, I like turning a rough
                idea into something I can run, measure, and improve.
              </p>
              <div className="tool-list">
                TYPESCRIPT / PYTHON / JAVA / C++ / GO
              </div>
            </article>
            <article data-reveal>
              <span className="small-index">/03</span>
              <h3>Keep going.</h3>
              <p>
                A working prototype usually raises better questions. That's
                where the experiments, benchmarks, and careful refinements
                begin.
              </p>
              <div className="tool-list">
                PYTORCH / POSTGRESQL / DOCKER / GIT
              </div>
            </article>
          </div>
        </section>

        <section className="background pad" id="background">
          <div className="section-label">
            <span>04 / BEYOND THE EDITOR</span>
            <span>LEARN. BUILD. SHARE.</span>
          </div>
          <div className="background-layout">
            <div className="background-heading" data-reveal>
              <h2>
                More than
                <br />
                <em>the code.</em>
              </h2>
              <p>
                Still learning. Already building.
                <br />
                Better with good people around.
              </p>
              <div className="education-stamp">
                <span>VIT</span>
                <div>
                  CHENNAI
                  <br />
                  B.TECH COMPUTER SCIENCE
                  <br />
                  2023 — 2027
                </div>
              </div>
            </div>
            <div className="experience-list">
              <article data-reveal>
                <span>01 / EDUCATION</span>
                <h3>Foundations first.</h3>
                <p>
                  Computer Science & Engineering at VIT Chennai. An 8.15/10
                  CGPA, with coursework spanning operating systems, machine
                  learning, networks, and applied cryptography.
                </p>
              </article>
              <article data-reveal>
                <span>02 / INVENTION</span>
                <h3>From software to the physical world.</h3>
                <p>
                  Co-inventor on a published Indian patent application for a
                  Multi-Module Flying Insect Control Device, developed with VIT
                  research faculty and a hardware engineering team.
                </p>
                <small>APPLICATION 202641075636 / PUBLISHED JUN 2026</small>
              </article>
              <article data-reveal>
                <span>03 / COMMUNITY</span>
                <h3>Good work is a team sport.</h3>
                <p>
                  As Cultural Lead for the UP Cultural Club, I helped bring
                  events to 250+ attendees. I also run peer learning sessions on
                  DSA, Git, system design, and APIs.
                </p>
              </article>
              <article data-reveal>
                <span>04 / PRACTICE</span>
                <h3>One problem at a time.</h3>
                <p>
                  175+ algorithm problems across Java and C++, a 2-star CodeChef
                  rating, and plenty of reasons to keep practicing.
                </p>
                <External
                  href="https://leetcode.com/u/Cp9ZFyMgbE/"
                  className="text-link"
                >
                  LeetCode
                </External>
              </article>
            </div>
          </div>
        </section>

        <footer className="contact pad" id="contact">
          <div className="section-label">
            <span>05 / WHAT'S NEXT?</span>
            <span>{clock} IST / OPEN TO CONVERSATION</span>
          </div>
          <div className="contact-heading" data-reveal>
            <p>
              Have an interesting problem?
              <br />
              I'd like to hear about it.
            </p>
            <a className="contact-title" href={`mailto:${email}`}>
              <span>
                Let's make
                <br />
                <em>something.</em>
              </span>
              <ArrowUpRight strokeWidth={0.9} aria-hidden="true" />
            </a>
          </div>
          <div className="contact-links">
            <div className="email-wrap">
              <a href={`mailto:${email}`}>{email}</a>
              <button
                className="icon-button"
                onClick={copyEmail}
                aria-label="Copy email address"
                title="Copy email address"
              >
                {copied ? <Check size={19} /> : <Copy size={17} />}
              </button>
              <span role="status" className="copy-status">
                {copied
                  ? "Copied"
                  : copyError
                    ? "Please use the email link"
                    : ""}
              </span>
            </div>
            <External href={github}>GitHub</External>
            <External href="https://www.linkedin.com/in/anshaditya-sharma-016624380/">
              LinkedIn
            </External>
            <a href={resume} target="_blank" rel="noreferrer">
              Resume <Download size={17} />
            </a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} ANSHADITYA SHARMA</span>
            <span>BUILT WITH INTENT.</span>
            <a href="#home">
              BACK TO TOP <ArrowUp size={14} />
            </a>
          </div>
        </footer>
      </main>

      <button
        className="motion-toggle icon-button"
        onClick={() => setPaused((v) => !v)}
        aria-label={paused ? "Enable animations" : "Pause animations"}
        aria-pressed={paused}
        title={paused ? "Enable animations" : "Pause animations"}
      >
        {paused ? <Play size={15} /> : <Pause size={15} />}
      </button>

      <dialog
        ref={menu}
        id="site-menu"
        className="menu-dialog"
        aria-label="Navigation"
        onClose={closeMenu}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        <div className="menu-content">
          <div className="menu-top">
            <span>ANSHADITYA SHARMA</span>
            <button
              className="icon-button"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <X size={28} />
            </button>
          </div>
          <nav aria-label="Full navigation">
            <button
              className="menu-collection"
              onClick={() => {
                closeMenu();
                setMore(true);
              }}
            >
              <span>00</span>All projects
              <ArrowUpRight />
            </button>
            {[
              ["01", "The person", "about"],
              ["02", "The work", "work"],
              ["03", "The approach", "approach"],
              ["04", "Background", "background"],
              ["05", "Say hello", "contact"],
            ].map(([n, label, id]) => (
              <a href={`#${id}`} onClick={closeMenu} key={id}>
                <span>{n}</span>
                {label}
                <ArrowUpRight />
              </a>
            ))}
          </nav>
          <div className="menu-bottom">
            <a href={`mailto:${email}`}>{email}</a>
            <External href={github}>GitHub</External>
          </div>
        </div>
      </dialog>
      <dialog
        ref={detail}
        className="detail-dialog story-dialog"
        onClose={closeProject}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeProject();
        }}
        aria-labelledby="detail-title"
      >
        {selected && (
          <ProjectStory
            key={selected.id}
            project={selected}
            paused={paused}
            onClose={closeProject}
            onNext={() => {
              setSelected(
                projects[
                  (projects.findIndex((p) => p.id === selected.id) + 1) %
                    projects.length
                ],
              );
              detail.current.scrollTo({
                top: 0,
                behavior: paused ? "instant" : "smooth",
              });
            }}
          />
        )}
      </dialog>
    </div>
  );
}
