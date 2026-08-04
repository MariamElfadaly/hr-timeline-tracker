import { useLanguage } from "../contexts/LanguageContext";
import { deriveStatus } from "../lib/employeeStatus";
import { todayISO } from "../lib/dateUtils";

const STATUS_LABEL_KEY = {
  active: "statusActive",
  probation: "statusProbation",
  action_required: "statusActionRequired",
  ended: "statusEnded",
};

export default function PrintDirectory({ employees, filterLabel }) {
  const { t } = useLanguage();

  return (
    <div className="print-directory">
      <div className="print-header">
        <div className="print-header__eyebrow">{t("printDirectoryEyebrow")}</div>
        <div className="print-header__name">{t("employees")}</div>
        <div className="print-header__meta">
          {t("printDirectoryCount", { count: employees.length })}
          {filterLabel ? ` · ${filterLabel}` : ""}
        </div>
        <div className="print-header__generated">{t("printGeneratedOn", { date: todayISO() })}</div>
      </div>

      <table className="print-directory__table">
        <thead>
          <tr>
            <th>{t("fullName")}</th>
            <th>{t("employeeId")}</th>
            <th>{t("jobTitle")}</th>
            <th>{t("department")}</th>
            <th>{t("joiningDate")}</th>
            <th>{t("statusActive")}</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.employeeId}</td>
              <td>{emp.jobTitle}</td>
              <td>{emp.department || "—"}</td>
              <td>{emp.joiningDate}</td>
              <td>{t(STATUS_LABEL_KEY[deriveStatus(emp)])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
