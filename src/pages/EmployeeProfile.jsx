import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getEmployee } from "../lib/employees";
import { deriveStatus, getProbationInfo } from "../lib/employeeStatus";
import EmployeeCounter from "../components/EmployeeCounter";
import StatusBadge from "../components/StatusBadge";
import "./EmployeeProfile.css";

export default function EmployeeProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
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
      <Link to="/" className="profile-page__back">
        ← {t("backToList")}
      </Link>

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
        </div>
      )}

      <div className="profile-page__details">
        <DetailRow label={t("employeeId")} value={employee.employeeId} />
        <DetailRow label={t("joiningDate")} value={employee.joiningDate} />
        <DetailRow label={t("phoneNumber")} value={employee.phoneNumber} />
        {employee.department && <DetailRow label={t("department")} value={employee.department} />}
        {employee.email && <DetailRow label={t("emailOptional")} value={employee.email} />}
        {employee.manager && <DetailRow label={t("manager")} value={employee.manager} />}
      </div>
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
