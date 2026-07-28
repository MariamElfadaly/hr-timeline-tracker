import { calendarDiff } from "../lib/dateUtils";
import { useLanguage } from "../contexts/LanguageContext";
import "./EmployeeCounter.css";

/**
 * The signature visual of the app: a live chronometer-style readout of
 * years / months / days at the company. Always computed fresh from the
 * joining date — nothing here is a stored value.
 */
export default function EmployeeCounter({ joiningDate, size = "md" }) {
  const { t } = useLanguage();
  const { years, months, days } = calendarDiff(joiningDate);

  const units = [
    { value: years, label: years === 1 ? t("year") : t("years"), show: years > 0 },
    { value: months, label: months === 1 ? t("month") : t("months"), show: months > 0 || years > 0 },
    { value: days, label: days === 1 ? t("day") : t("days"), show: true },
  ].filter((u) => u.show);

  return (
    <div className={`counter counter--${size}`}>
      {units.map((u, i) => (
        <div className="counter__block" key={i}>
          <span className="counter__digits">{String(u.value).padStart(2, "0")}</span>
          <span className="counter__label">{u.label}</span>
        </div>
      ))}
      <div className="counter__pulse" aria-hidden="true" />
    </div>
  );
}
