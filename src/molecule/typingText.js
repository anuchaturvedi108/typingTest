import { useState, useEffect, useRef, useCallback } from "react";
import { PASSAGES, DURATION, LEVELS } from "./data";
import { pickPassage, computeStats } from "./utils";
import Tabs from "../atoms/tabs.js";

export default function TypingTest() {
  const [level, setLevel] = useState("easy");
  const [passage, setPassage] = useState(pickPassage("easy"));
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [startTime, setStartTime] = useState(null);
  const [liveWpm, setLiveWpm] = useState(null);
  const [liveAcc, setLiveAcc] = useState(null);
  const [result, setResult] = useState(null);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const { correct, wrong } = computeStats(passage, typed);

  const endTest = useCallback(
    (overrideCorrect, overrideWrong, elapsed) => {
      clearInterval(timerRef.current);
      const mins = elapsed / 1000 / 60;
      const c = overrideCorrect ?? correct;
      const w = overrideWrong ?? wrong;
      const wpm = mins > 0 ? Math.round(c / 5 / mins) : 0;
      const total = c + w;
      const acc = total > 0 ? Math.round((c / total) * 100) : 100;
      setResult({ wpm, acc, chars: c + w });
      setFinished(true);
    },
    [correct, wrong]
  );

  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        const elapsed = Date.now() - startTime;
        const mins = elapsed / 1000 / 60;
        const total = correct + wrong;
        setLiveWpm(mins > 0 ? Math.round(correct / 5 / mins) : 0);
        setLiveAcc(total > 0 ? Math.round((correct / total) * 100) : 100);
        if (next <= 0) {
          endTest(correct, wrong, elapsed);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, finished, startTime, correct, wrong, endTest]);

  const initTest = useCallback(
    (newLevel) => {
      clearInterval(timerRef.current);
      const lvl = newLevel ?? level;
      setPassage(pickPassage(lvl));
      setTyped("");
      setStarted(false);
      setFinished(false);
      setTimeLeft(DURATION);
      setStartTime(null);
      setLiveWpm(null);
      setLiveAcc(null);
      setResult(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [level]
  );

  const handleLevelChange = (lvl) => {
    setLevel(lvl);
    initTest(lvl);
  };

  const handleInput = (e) => {
    if (finished) return;
    const val = e.target.value.slice(0, passage.length);

    if (!started && val.length > 0) {
      setStarted(true);
      setStartTime(Date.now());
    }

    setTyped(val);

    if (val.length === passage.length) {
      const c = val.split("").filter((ch, i) => ch === passage[i]).length;
      const w = val.length - c;
      const elapsed = Date.now() - (startTime || Date.now());
      endTest(c, w, elapsed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") e.preventDefault();
  };

  const timerPct = (timeLeft / DURATION) * 100;

  return (
    <div className="wrapper">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: #c8f135; color: #111; }
        textarea:focus { outline: none; }
        .diff-btn { transition: all 0.15s; }
        .diff-btn:hover { background: #e8f5a0 !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-blink { animation: pulse 1s step-start infinite; }
      `}</style>

      <div className="card">
        {/* Header */}
        <div className="header">
          <div className="logo">
            <span className="logoIcon">⌨</span>
            <span className="logoText">typist</span>
          </div>
          <div className="timerPill">
            <span
              className="timerNum"
              style={{
                color: timeLeft <= 10 && started ? "#e74c3c" : "#111",
              }}
            >
              {timeLeft}
            </span>
            <span className="timerUnit">s</span>
          </div>
        </div>

        {/* Timer bar */}
        <div className="barTrack">
          <div
            className="barFill"
            style={{
              width: `${timerPct}%`,
              background: timeLeft <= 10 && started ? "#e74c3c" : "#c8f135",
            }}
          />
        </div>

        {/* Difficulty tabs */}
        <Tabs handleLevelChange={handleLevelChange} level={level} />

        {/* Stats row */}
        <div className="statsRow">
          {[
            { label: "WPM", value: liveWpm !== null ? liveWpm : "—", unit: "" },
            {
              label: "Accuracy",
              value: liveAcc !== null ? liveAcc : "—",
              unit: liveAcc !== null ? "%" : "",
            },
            { label: "Correct", value: started ? correct : "—", unit: "" },
            { label: "Errors", value: started ? wrong : "—", unit: "" },
          ].map(({ label, value, unit }) => (
            <div key={label} className="statCard">
              <div className="statLabel">{label}</div>
              <div className="statValue">
                {value}
                {unit && <span className="statUnit">{unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Passage display */}
        <div className="passageWrap">
          {passage.split("").map((ch, i) => {
            let color = "#bbb";
            let bg = "transparent";
            let isCursor = i === typed.length && !finished;

            if (i < typed.length) {
              if (typed[i] === ch) {
                color = "#27ae60";
              } else {
                color = "#e74c3c";
                bg = "#fde8e8";
              }
            }

            return (
              <span key={i} style={{ position: "relative", display: "inline" }}>
                {isCursor && (
                  <span className="cursor-blink" className="cursor" />
                )}
                <span
                  style={{
                    color,
                    background: bg,
                    borderRadius: bg !== "transparent" ? 3 : 0,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 15,
                    lineHeight: 1.9,
                    letterSpacing: "0.02em",
                  }}
                >
                  {ch}
                </span>
              </span>
            );
          })}
        </div>

        {/* Input */}
        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={finished}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={finished ? "" : "Start typing to begin…"}
          rows={3}
          className="textarea"
          style={{
            opacity: finished ? 0.4 : 1,
            cursor: finished ? "not-allowed" : "text",
          }}
        />

        {/* Controls */}
        <div className="controls">
          <button className="btnPrimary" onClick={() => initTest()}>
            Restart
          </button>
          <button className="btnSecondary" onClick={() => initTest()}>
            New passage
          </button>
        </div>

        {/* Result overlay */}
        {finished && result && (
          <div className="resultBox">
            <div className="resultTitle">
              {result.acc === 100 ? "Perfect run! 🎯" : "Test complete"}
            </div>
            <div className="resultGrid">
              {[
                { label: "Words / min", value: result.wpm },
                { label: "Accuracy", value: `${result.acc}%` },
                { label: "Chars typed", value: result.chars },
              ].map(({ label, value }) => (
                <div key={label} className="resultStat">
                  <div className="resultBig">{value}</div>
                  <div className="resultLbl">{label}</div>
                </div>
              ))}
            </div>
            <button className="btnPrimary" onClick={() => initTest()}>
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
