import { LEVELS } from "../molecule/data";

export default function Tabs({ handleLevelChange, level }) {
  return (
    <div className="tabs">
      {LEVELS.map((lvl) => (
        <button
          key={lvl}
          className="diff-btn tab"
          onClick={() => handleLevelChange(lvl)}
          style={{
            background: level === lvl ? "#c8f135" : "transparent",
            color: level === lvl ? "#111" : "#888",
            fontWeight: level === lvl ? 600 : 400,
            border:
              level === lvl ? "1.5px solid #c8f135" : "1.5px solid #e0e0e0",
          }}
        >
          {lvl}
        </button>
      ))}
    </div>
  );
}
