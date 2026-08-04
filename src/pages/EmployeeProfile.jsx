import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getEmployee } from "../lib/employees";
import { deriveStatus, getProbationInfo } from "../lib/employeeStatus";
import EmployeeCounter from "../components/EmployeeCounter";
import StatusBadge from "../components/StatusBadge";
import ProbationActionRequired from "../components/ProbationActionRequired";
import PostProbationChecklist from "../components/PostProbationChecklist";
import EmployeeTimeline from "../components/EmployeeTimeline";
import CustomMilestones from "../components/CustomMilestones";
import EarlyConfirm from "../components/EarlyConfirm";
import ActiveEmployeeActions from "../components/ActiveEmployeeActions";
import NotesEditor from "../components/NotesEditor";
import DangerZone from "../components/DangerZone";
import EmployeePrintReport from "../components/EmployeePrintReport";
import "./EmployeeProfile.css";

export default function EmployeeProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const emp = await getEmployee(user.uid, id);
    setEmployee(emp);
  }, [user, id]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getEmployee(user.uid, id).then((emp) => {
      if (active) {
        setEmployee(emp);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [user, id]);

  if (loading) return <div className="profile-page profile-page--loading">…</div>;
  if (!employee) return <div className="profile-page profile-page--loading">Not found</div>;

  const status = deriveStatus(employee);
  const probation = getProbationInfo(employee);

  return (
    <div className="profile-page">
      <div className="profile-page__toolbar no-print">
        <Link to="/" className="profile-page__back">
          ← {t("backToList")}
        </Link>
        <div className="profile-page__toolbar-actions">
          <Link to={`/employees/${id}/edit`} className="btn btn--ghost profile-page__toolbar-btn">
            {t("editEmployee")}
          </Link>
          <button className="btn btn--ghost profile-page__toolbar-btn" onClick={() => window.print()}>
            {t("print")}
          </button>
        </div>
      </div>

      {/* Screen view — hidden entirely when printing */}
      <div className="no-print">
        <div className="profile-page__header">
          <div>
            <h1 className="profile-page__name">{employee.name}</h1>
            <p className="profile-page__title">{employee.jobTitle}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="profile-page__counter-card">
          <EmployeeCounter joiningDate={employee.joiningDate} size="lg" />
          <div className="profile-page__at">{t("atCompany")}</div>
        </div>

        {probation && status === "probation" && (
          <div className="profile-page__probation-card">
            <div className="profile-page__probation-row">
              <span>{t("dayOf", { completed: probation.daysCompleted, total: probation.totalDays })}</span>
              <span>{probation.daysRemaining} {t("daysRemaining")}</span>
            </div>
            <div className="profile-page__progress">
              <div className="profile-page__progress-fill" style={{ width: `${probation.percent}%` }} />
            </div>
            {probation.daysRemaining <= 7 && (
              <div className="profile-page__decide-soon">
                {probation.daysRemaining === 0
                  ? t("reminderProbationDecideToday")
                  : t("reminderProbationDecideSoon", { days: probation.daysRemaining })}
              </div>
            )}
            <EarlyConfirm employee={employee} onDecided={refetch} />
          </div>
        )}

        {status === "action_required" && (
          <ProbationActionRequired employee={employee} onDecided={refetch} />
        )}

        {status === "active" && <ActiveEmployeeActions employee={employee} onChanged={refetch} />}

        {employee.probation?.history?.length > 0 && (
          <div className="profile-page__history">
            <span className="profile-page__history-title">{t("probationHistory")}</span>
            {employee.probation.history.map((h, i) => (
              <div key={i} className="profile-page__history-row">
                {t("extendedOn", { date: h.date, newDate: h.newEndDate })}
                {h.note ? ` — ${h.note}` : ""}
              </div>
            ))}
          </div>
        )}

        {status === "active" && employee.checklist && (
          <PostProbationChecklist employee={employee} onChanged={refetch} />
        )}

        <EmployeeTimeline employee={employee} />

        <CustomMilestones employee={employee} onChanged={refetch} />

        <NotesEditor employee={employee} onChanged={refetch} />

        <div className="profile-page__details">
          <DetailRow label={t("employeeId")} value={employee.employeeId} />
          <DetailRow label={t("joiningDate")} value={employee.joiningDate} />
          <DetailRow label={t("phoneNumber")} value={employee.phoneNumber} />
          {employee.department && <DetailRow label={t("department")} value={employee.department} />}
          {employee.email && <DetailRow label={t("emailOptional")} value={employee.email} />}
          {employee.manager && <DetailRow label={t("manager")} value={employee.manager} />}
        </div>

        <DangerZone employee={employee} />
      </div>

      {/* Print view — hidden on screen, shown only when printing */}
      <EmployeePrintReport employee={employee} />
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-row__label">{label}</span>
      <span className="detail-row__value">{value}</span>
    </div>
  );
}
