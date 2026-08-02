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

const COLLAPSE_THRESHOLD = 7;

export default function EmployeeTimeline({ employee }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const events = buildTimelineEvents(employee, t);

  if (events.length === 0) return null;

  const isLong = events.length > COLLAPSE_THRESHOLD;
  const showList = !isLong || expanded;

  return (
    <div className="etl">
      <div className="etl__header">
        <span className="etl__title">{t("employeeTimeline")}</span>
        {isLong && (
          <button className="etl__toggle" onClick={() => setExpanded((v) => !v)}>
            {expanded ? t("timelineShowLess") : t("timelineShowAll", { count: events.length })}
          </button>
        )}
      </div>

      {showList ? (
        <div className="etl__track">
          {events.map((ev, i) => (
            <div key={i} className={`etl__event etl__event--${ev.status}`}>
              <div className="etl__line-col">
                <span className={`etl__dot etl__dot--${CATEGORY_CLASS[ev.category] || "muted"}`} />
                {i < events.length - 1 && <span className="etl__connector" />}
              </div>
              <div className="etl__content">
                <div className="etl__date">{ev.dateISO}</div>
                <div className="etl__label">{ev.label}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <button className="etl__collapsed-summary" onClick={() => setExpanded(true)}>
          {t("timelineShowAll", { count: events.length })}
        </button>
      )}
    </div>
  );
}
