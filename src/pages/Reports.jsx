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

  if (employees.length === 0) {
    return (
      <div className="reports-page">
        <Link to="/" className="reports-page__back">
          ← {t("backToList")}
        </Link>
        <h1 className="reports-page__title">{t("reports")}</h1>
        <div className="reports-section__empty-box">{t("reportNoEmployees")}</div>
      </div>
    );
  }

  const data = buildReportData(employees);
  const employedTotal = data.total - (data.counts.ended || 0);

  return (
    <div className="reports-page">
      <Link to="/" className="reports-page__back no-print">
        ← {t("backToList")}
      </Link>
      <div className="reports-page__title-row">
        <h1 className="reports-page__title">{t("reports")}</h1>
        <button className="btn btn--ghost no-print" onClick={() => window.print()}>
          {t("print")}
        </button>
      </div>

      {/* Headcount */}
      <div className="reports-page__summary">
        <SummaryStat label={t("totalEmployees")} value={data.total} />
        <SummaryStat label={t("statusActive")} value={data.counts.active || 0} />
        <SummaryStat label={t("statusProbation")} value={data.counts.probation || 0} />
        <SummaryStat label={t("statusActionRequired")} value={data.counts.action_required || 0} urgent />
        <SummaryStat label={t("statusEnded")} value={data.counts.ended || 0} />
      </div>

      {/* Insights */}
      <div className="reports-section__title">{t("reportInsights")}</div>
      <div className="reports-page__insights">
        <InsightCard
          label={t("reportAvgTenure")}
          value={
            data.avgTenure
              ? `${data.avgTenure.years}${t("yearsShort")} ${data.avgTenure.months}${t("monthsShort")}`
              : "—"
          }
          hint={t("reportAvgTenureHint", { count: employedTotal })}
        />
        <InsightCard
          label={t("reportProbationPassRate")}
          value={data.probationPassRate !== null ? `${data.probationPassRate}%` : "—"}
          hint={t("reportProbationPassRateHint", { count: data.probationDecided })}
        />
        <InsightCard
          label={t("reportChecklistRate")}
          value={data.checklistCompletionRate !== null ? `${data.checklistCompletionRate}%` : "—"}
          hint={t("reportChecklistRateHint", { count: data.checklistTrackedCount })}
        />
      </div>

      {/* Department breakdown */}
      {data.departmentBreakdown.length > 0 && (
        <>
          <div className="reports-section__title">{t("reportByDepartment")}</div>
          <div className="dept-bars">
            {data.departmentBreakdown.map((d) => (
              <div className="dept-bar" key={d.department}>
                <span className="dept-bar__label">{d.department}</span>
                <div className="dept-bar__track">
                  <div
                    className="dept-bar__fill"
                    style={{ width: `${(d.count / employedTotal) * 100}%` }}
                  />
                </div>
                <span className="dept-bar__count">{d.count}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Needs attention */}
      <div className="reports-section__title">{t("reportNeedsAttention")}</div>

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

function InsightCard({ label, value, hint }) {
  return (
    <div className="insight-card">
      <div className="insight-card__value">{value}</div>
      <div className="insight-card__label">{label}</div>
      <div className="insight-card__hint">{hint}</div>
    </div>
  );
}

function ReportSection({ title, empty, children }) {
  const hasContent = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <div className="reports-section">
      <div className="reports-section__subtitle">{title}</div>
      {hasContent ? (
        <div className="reports-section__list">{children}</div>
      ) : (
        <div className="reports-section__empty">{empty}</div>
      )}
    </div>
  );
}
