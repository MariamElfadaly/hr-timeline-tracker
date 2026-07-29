import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { buildTimelineEvents } from "../lib/timeline";
import "./EmployeeTimeline.css";

const CATEGORY_CLASS = {
  joining: "brass",
  probation: "teal",
  confirmed: "teal",
  ended: "red",
  checklist: "muted",
  anniversary: "teal",
  custom: "brass",
};

const COLLAPSED_LIMIT = 7;
const COLLAPSED_PAST_COUNT = 2;

function getDefaultVisible(events) {
  if (events.length <= COLLAPSED_LIMIT) return events;
  const past = events.filter((e) => e.status === "past");
  const rest = events.filter((e) => e.status !== "past");
  const pastSlice = past.slice(-COLLAPSED_PAST_COUNT);
  const restSlice = rest.slice(0, COLLAPSED_LIMIT - pastSlice.length);
  return [...pastSlice, ...restSlice];
}

export default function EmployeeTimeline({ employee }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const events = buildTimelineEvents(employee, t);

  if (events.length === 0) return null;

  const isLong = events.length > COLLAPSED_LIMIT;
  const visibleEvents = expanded ? events : getDefaultVisible(events);
  const hiddenCount = events.length - visibleEvents.length;

  return (
    <div className="etl">
      <div className="etl__header">
        <span className="etl__title">{t("employeeTimeline")}</span>
        {isLong && (
          <button className="etl__toggle" onClick={() => setExpanded((v) => !v)}>
            {expanded ? t("timelineShowLess") : t("timelineShowMore", { count: hiddenCount })}
          </button>
        )}
      </div>
      <div className="etl__track">
        {visibleEvents.map((ev, i) => (
          <div key={i} className={`etl__event etl__event--${ev.status}`}>
            <div className="etl__line-col">
              <span className={`etl__dot etl__dot--${CATEGORY_CLASS[ev.category] || "muted"}`} />
              {i < visibleEvents.length - 1 && <span className="etl__connector" />}
            </div>
            <div className="etl__content">
              <div className="etl__date">{ev.dateISO}</div>
              <div className="etl__label">{ev.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
