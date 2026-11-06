
import { useState, type FormEvent } from "react";
import { isTauri } from "@tauri-apps/api/core";
import {
  getCurrentWindow,
  LogicalSize,
} from "@tauri-apps/api/window";
import "./App.css";

type OrbState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

function App() {
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [command, setCommand] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const [response, setResponse] = useState(
    "Good morning. JARVIS systems are online. How may I assist you?"
  );

  const stateLabels: Record<OrbState, string> = {
    idle: "SYSTEM IDLE",
    listening: "LISTENING",
    thinking: "PROCESSING",
    speaking: "SPEAKING",
    error: "SYSTEM ERROR",
  };

  // Switch between compact orb and expanded assistant.
  const toggleWindow = async () => {
    const nextMode = !isExpanded;

    setIsExpanded(nextMode);

    if (isTauri()) {
      try {
        const window = getCurrentWindow();

        await window.setSize(
          new LogicalSize(
            nextMode ? 420 : 220,
            nextMode ? 620 : 260
          )
        );
      } catch (error) {
        console.error("Could not resize JARVIS:", error);
      }
    }
  };

  const handleListen = () => {
    if (orbState === "listening") {
      setOrbState("idle");
    } else {
      setOrbState("listening");
      setResponse("I'm listening. Microphone integration is coming next.");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!command.trim()) return;

    const userCommand = command.trim();

    setCommand("");
    setResponse(`You: ${userCommand}`);
    setOrbState("thinking");

    window.setTimeout(() => {
      setResponse(
        `I received your command: "${userCommand}". My AI engine will be connected soon.`
      );

      setOrbState("speaking");

      window.setTimeout(() => {
        setOrbState("idle");
      }, 3500);
    }, 1800);
  };

  return (
    <main className={`app ${isExpanded ? "expanded" : "compact"}`}>

      {/* Draggable header */}
      <header className="topbar">
        <div className="brand drag-handle" data-tauri-drag-region>
          <span className="brand-icon" data-tauri-drag-region>
            J
          </span>

          <div data-tauri-drag-region>
            <h1 data-tauri-drag-region>J.A.R.V.I.S</h1>
            <p data-tauri-drag-region>PERSONAL AI ASSISTANT</p>
          </div>
        </div>

        {isExpanded && (
          <button
            className="collapse-button"
            onClick={toggleWindow}
            type="button"
            aria-label="Collapse JARVIS"
            title="Collapse"
          >
            −
          </button>
        )}
      </header>

      <section className="main-content">

        {/* Expanded greeting */}
        {isExpanded && (
          <div className="greeting">
            <p className="eyebrow">
              STARK INDUSTRIES • AI INTERFACE
            </p>

            <h2>At your service.</h2>

            <p className="subtitle">
              Your personal intelligent assistant.
            </p>
          </div>
        )}

        {/* Interactive Orb */}
        <button
          className={`orb-container ${orbState}`}
          onClick={toggleWindow}
          type="button"
          aria-label={
            isExpanded
              ? "Collapse JARVIS"
              : "Expand JARVIS"
          }
          title={isExpanded ? "Collapse JARVIS" : "Expand JARVIS"}
        >
          <span className="orb-ring ring-one" />
          <span className="orb-ring ring-two" />
          <span className="orb-ring ring-three" />

          <span className="orb">
            <span className="orb-core" />
            <span className="orb-glow" />
          </span>
        </button>

        <div className="state-display">
          <span className="state-dot" />
          {stateLabels[orbState]}
        </div>

        {/* Expanded chat controls */}
        {isExpanded && (
          <>
            <p className="response">{response}</p>

            <form className="command-form" onSubmit={handleSubmit}>
              <input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Ask JARVIS anything..."
                aria-label="Enter a command"
              />

              <button type="submit" disabled={!command.trim()}>
                ↑
              </button>
            </form>

            <button
              className={`listen-button ${
                orbState === "listening" ? "active" : ""
              }`}
              onClick={handleListen}
              type="button"
            >
              <span>
                {orbState === "listening" ? "■" : "🎙"}
              </span>

              {orbState === "listening"
                ? "STOP LISTENING"
                : "START LISTENING"}
            </button>
          </>
        )}

        {/* Compact mode hint */}
        {!isExpanded && (
          <p className="compact-hint">
            CLICK ORB TO OPEN
          </p>
        )}

      </section>

      {isExpanded && (
        <footer className="footer">
          <span>JARVIS CORE v0.1.0</span>
          <span>LOCAL AI INTERFACE</span>
        </footer>
      )}

    </main>
  );
}

export default App;
