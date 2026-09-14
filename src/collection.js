import { archive, projects } from "./data.js";
export const groups = [
  "All",
  "Systems",
  "Intelligence",
  "Interfaces",
];
const systems = [
  "Trading-Exchange-Simulator",
  "GroundLink",
  "backend_dev_application",
  "python_dev_application",
  "zero_knowledge_proof",
];
const intelligence = [
  "Behavioral-Anomaly-Detection",
  "evocreatures",
  "lecture_find",
  "airport-rl",
  "quizmd",
  "Robo-Advisor",
];
const interfaces = [
  "Gridspace",
  "cafe-finder",
  "odd_eve",
  "Algo-Visualizer",
  "sushistore",
  "weather-app",
];
const descriptions = {
  lecture_find:
    "Find the part of a lecture you actually need. NLP-based retrieval with a browser extension and timestamped results.",
  "airport-rl":
    "An airport security queue simulation for comparing reinforcement-learning policies with conventional baselines.",
  Gridspace:
    "A collaborative whiteboard with Firebase-backed real-time updates.",
  odd_eve:
    "Gesture-controlled hand cricket using computer vision, adaptive opponents, and multiplayer WebSockets.",
  "cafe-finder":
    "A map-first cafe discovery experiment using OpenStreetMap, Leaflet, and open geocoding services.",
  "Robo-Advisor":
    "A Streamlit-based exploration of portfolio optimization for Indian equities.",
  zero_knowledge_proof:
    "An educational challenge-response demonstration using SHA-256 and HMAC. A learning exercise, not a production zero-knowledge protocol.",
  python_dev_application:
    "A Python command-line client for Binance Futures Testnet, with order validation and market, limit, and stop order workflows.",
  backend_dev_application:
    "A full-stack task manager with JWT authentication, role-based access control, and MongoDB persistence.",
  quizmd:
    "An offline Markdown quiz generator exploring TF-IDF and natural-language processing.",
  "Algo-Visualizer":
    "An interactive exploration of sorting, linked lists, depth-first search, and shortest-path algorithms.",
  cr: "A React-based Clash Royale personality quiz.",
  sushistore:
    "A sushi-ordering web application with Firebase and an administration interface.",
  "weather-app": "A Vue-based weather application.",
  portfolio_t:
    "An ongoing experiment in personal storytelling, interactive graphics, and frontend engineering.",
};
const approved = ["Trading-Exchange-Simulator", "GroundLink", "Behavioral-Anomaly-Detection", "evocreatures", "lecture_find", "Gridspace", "odd_eve", "Robo-Advisor", "Algo-Visualizer"];
export const collection = approved.map(repo => archive.find(p => p[2] === repo)).filter(Boolean).map(([name, category, repo], i) => ({
  name,
  category,
  repo,
  i,
  group: systems.includes(repo)
    ? "Systems"
    : intelligence.includes(repo)
      ? "Intelligence"
      : interfaces.includes(repo)
        ? "Interfaces"
        : "Experiments",
  featured: projects.find((p) => p.repo.endsWith("/" + repo)),
  description:
    projects.find((p) => p.repo.endsWith("/" + repo))?.description ||
    descriptions[repo],
}));
