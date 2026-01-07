import { useMemo, useState } from "react";

function formatCourseLabel(raw) {
  // turns: "ros2_launch_file" / "ict-bpr" / "beginner_python_coding_literacy"
  // into: "Ros2 Launch File" / "Ict Bpr" / "Beginner Python Coding Literacy"
  return String(raw || "")
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CourseSelect({ courses, selected, onSelect, countByCourse }) {
  const [q, setQ] = useState("");

  const options = useMemo(() => {
    const arr = Array.isArray(courses) ? courses : [];
    return arr.map((value) => {
      const label = formatCourseLabel(value);
      const count = typeof countByCourse === "function" ? countByCourse(value) : null;
      return { value, label, count };
    });
  }, [courses, countByCourse]);

  const filtered = useMemo(() => {
    const needle = String(q || "").trim().toLowerCase();
    if (!needle) return options;
    return options.filter((o) => o.label.toLowerCase().includes(needle));
  }, [options, q]);

  const selectedValue = String(selected || "");

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

      {/* Search */}
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search courses…"
        className="aiTextarea"
        style={{
          minHeight: 44,
          resize: "none",
          marginTop: 0,
        }}
      />

      {/* Dropdown (mobile-first) */}
      <div style={{ marginTop: 10 }}>
        <select
          value={selectedValue}
          onChange={(e) => onSelect(e.target.value)}
          className="aiTextarea"
          style={{
            minHeight: 48,
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            cursor: "pointer",
          }}
        >
          <option value="">Choose a course…</option>

          {filtered.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
              {Number.isFinite(o.count) ? ` (${o.count})` : ""}
            </option>
          ))}
        </select>

        {/* Optional small helper row */}
        <div style={{ marginTop: 8, color: "rgba(15,23,42,0.62)", fontWeight: 700, fontSize: 12 }}>
          Showing {filtered.length} of {options.length}
        </div>
      </div>
    </div>
  );
}