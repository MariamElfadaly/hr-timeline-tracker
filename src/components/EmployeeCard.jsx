import { Link } from "react-router-dom";
import EmployeeCounter from "./EmployeeCounter";
import StatusBadge from "./StatusBadge";
import { useLanguage } from "../contexts/LanguageContext";
import { deriveStatus, getNextAction } from "../lib/employeeStatus";
import "./EmployeeCard.css";

export default function EmployeeCard({ employee }) {
  const { t } = useLanguage();
  const status = deriveStatus(employee);
  const nextAction = getNextAction(employee, t);

  return (
    <Link to={`/employees/${employee.id}`} className="emp-card">
      <div className="emp-card__top">
        <div>
          <div className="emp-card__name">{employee.name}</div>
          <div className="emp-card__title">{employee.jobTitle}</div>
          <div className="emp-card__id">{employee.employeeId}</div>
        </div>
        <StatusBadge status={status} />
      </div>

      <EmployeeCounter joiningDate={employee.joiningDate} size="md" />
      <div className="emp-card__at">{t("atCompany")}</div>

      {nextAction && (
        <div className={`emp-card__action ${nextAction.urgent ? "emp-card__action--urgent" : ""}`}>
          {nextAction.text}
        </div>
      )}
    </Link>
  );
}
