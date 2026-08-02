import { useLanguage } from "../contexts/LanguageContext";
import { deriveStatus } from "../lib/employeeStatus";
import { todayISO } from "../lib/dateUtils";

const STATUS_LABEL_KEY = {
  active: "statusActive",
  probation: "statusProbation",
  action_required: "statusActionRequired",
  ended: "statusEnded",
};

export default function PrintHeader({ employee }) {
  const { t } = useLanguage();
  const status = deriveStatus(employee);

  return (
    <div className="print-header">
      <div className="print-header__eyebrow">{t("printReportEyebrow")}</div>
      <div className="print-header__name">{employee.name}</div>
      <div className="print-header__meta">
        {employee.jobTitle} · {employee.employeeId} · {t(STATUS_LABEL_KEY[status])}
      </div>
      <div className="print-header__generated">{t("printGeneratedOn", { date: todayISO() })}</div>
    </div>
  );
}
