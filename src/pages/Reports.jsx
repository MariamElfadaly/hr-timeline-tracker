import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { subscribeToEmployees } from "../lib/employees";
import { buildReportData } from "../lib/reports";
import "./Reports.css";

export default function Reports() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [employees, setEmployees] = useState(null);

  useEffect(() => {
    if (!user) return;
    return subscribeToEmployees(user.uid, setEmployees, () => setEmployees([]));
  }, [user]);

  if (employees === null) {
    return <div className="reports-page reports-page--loading">…</div>;
  }

  const data = buildReportData(employees);

  return (
    <div className="reports-page">
      <Link to="/" className="reports-page__back">
        ← {t("backToList")}
      </Link>
      <div className="reports-page__title-row">
        <h1 className="reports-page__title">{t("reports")}</h1>
        <button className="btn btn--ghost no-print" onClick={() => window.print()}>
          {t("print")}
        </button>
      </div>

      <div className="reports-page__summary">
        <SummaryStat label={t("totalEmployees")} value={data.total} />
        <SummaryStat label={t("statusActive")} value={data.counts.active || 0} />
        <SummaryStat label={t("statusProbation")} value={data.counts.probation || 0} />
        <SummaryStat label={t("statusActionRequired")} value={data.counts.action_required || 0} urgent />
        <SummaryStat label={t("statusEnded")} value={data.counts.ended || 0} />
      </div>

      <ReportSection title={t("reportProbationEndingSoon")} empty={t("reportNoneFound")}>
        {data.endingSoon.map((e) => (
          <Link key={e.id} to={`/employees/${e.id}`} className="reports-row">
            <span>{e.name}</span>
            <span className="reports-row__meta">
              {e.daysRemaining === 0 ? t("reminderProbationDecideToday") : t("daysRemainingCount", { days: e.daysRemaining })}
            </span>
          </Link>
        ))}
      </ReportSection>

      <ReportSection title={t("reportIncompleteChecklists")} empty={t("reportNoneFound")}>
        {data.incompleteChecklists.map((e) => (
          <Link key={e.id} to={`/employees/${e.id}`} className="reports-row">
            <span>{e.name}</span>
          </Link>
        ))}
      </ReportSection>

      <ReportSection title={t("reportUpcomingMilestones")} empty={t("reportNoneFound")}>
        {data.upcomingMilestones.map((m, i) => (
          <Link key={i} to={`/employees/${m.id}`} className="reports-row">
            <span>
              {m.name} — {m.milestoneType === "other" ? m.customLabel : t(`milestoneType_${m.milestoneType}`)}
            </span>
            <span className="reports-row__meta">{m.date}</span>
          </Link>
        ))}
      </ReportSection>
    </div>
  );
}

function SummaryStat({ label, value, urgent }) {
  return (
    <div className={`summary-stat ${urgent && value > 0 ? "summary-stat--urgent" : ""}`}>
      <div className="summary-stat__value">{value}</div>
      <div className="summary-stat__label">{label}</div>
    </div>
  );
}

function ReportSection({ title, empty, children }) {
  const hasContent = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <div className="reports-section">
      <div className="reports-section__title">{title}</div>
      {hasContent ? (
        <div className="reports-section__list">{children}</div>
      ) : (
        <div className="reports-section__empty">{empty}</div>
      )}
    </div>
  );
}
