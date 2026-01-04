export default function CourseSelect({ courses, selected, onSelect, countByCourse }) {
  const hasCourses = Array.isArray(courses) && courses.length > 0;

  return (
    <div
      style={{
        border: "1px solid rgba(15,23,42,0.10)",
        background: "rgba(255,255,255,0.72)",
        borderRadius: 18,
        padding: 14,
      }}
    >
      <div className="kicker" style={{ marginBottom: 10 }}>
        Select a course
      </div>

      {!hasCourses ? (
        <div style={{ color: "rgba(15,23,42,0.70)", fontWeight: 700 }}>
          No courses returned yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {courses.map((c) => {
            const isActive = String(selected || "") === String(c || "");
            const count = typeof countByCourse === "function" ? countByCourse(c) : null;

            return (
              <button
                key={c}
                type="button"
                onClick={() => onSelect(c)}
                className="miniBtn"
                style={{
                  background: isActive ? "rgba(37,99,235,0.92)" : "rgba(255,255,255,0.85)",
                  color: isActive ? "white" : "rgba(15,23,42,0.86)",
                  borderColor: isActive ? "rgba(37,99,235,0.30)" : "rgba(15,23,42,0.12)",
                }}
              >
                {c}
                {Number.isFinite(count) ? ` (${count})` : ""}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}