# Anshaditya Sharma Portfolio

A personal portfolio built with React, Vite, Three.js, GSAP, and Lucide.

## Run locally

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy the `dist` directory. On Vercel or Netlify, select Vite, use `npm run build` as the build command, and `dist` as the output directory. This is a static frontend; no API keys or backend are required. GitHub Pages must publish the built output rather than the repository's source index.html. Relative asset paths support project subdirectories.

## Content and visuals

- Personal copy and sections: `src/App.jsx`
- Project descriptions and links: `src/data.js`
- Layout and responsive styles: `src/style.css`
- Scroll-driven laptop assembly and adaptive rendering: `src/sculpture.js`
- Searchable project collection and repository index: `src/ProjectArchive.jsx`, `src/collection.js`
- Featured project artwork and expanded case studies: `src/ProjectPoster.jsx`, `src/ProjectStory.jsx`
- Current visual direction and day/night themes: `src/refinement.css`, `src/revision.css`, `src/journey.css`, `src/assembly.css`
- Scene-aware loading transition: `src/Loading.jsx`
- Resume: `public/Anshaditya-Sharma-Resume.pdf`

The project posters are illustrative editorial artwork, not live telemetry. `public/groundlink-replay.html` is the project's self-contained recorded-flight dashboard, retrieved from its public master branch on 12 September 2026. Project case studies include source links and metric qualifications.

The site honors reduced-motion preferences and provides an animation pause control. WebGL content loads separately and only renders when visible. External Google Fonts have system-font fallbacks.

The persistent 3D stage assembles a detailed laptop from six layers as you scroll. Components rise and settle into place; the screen changes with featured projects and becomes a contact invitation at the end. The completed build turns slowly. A separate reading column keeps content clear on desktop, while mobile uses a compact bottom stage. Layer geometry is batched, resolution adapts to device capacity, and rendering sleeps when settled or suspended. Reduced motion snaps arrivals into place and disables auto-rotation.

The nine-project collection is explicitly curated in `src/collection.js`; it is not an automatic repository feed. All nine have artwork, with original repository screenshots for Robo-Advisor and Algo Visualizer. Search, category filters, gallery/index views, and image-to-detail transitions have non-animated fallbacks. The day/night preference is stored locally. No heavy model files, video backgrounds, or tracking scripts are required.

Only active website files are versioned. The rejected terrain and particle renderers, research cache, component reference notes, and unused replay data are excluded from Git. Previous renderers remain locally for experimentation.
