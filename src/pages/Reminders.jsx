import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { subscribeToEmployees, dismissReminder } from "../lib/employees";
import { buildReminders } from "../lib/reminders";
import "./Reminders.css";

export default function Reminders() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [employees, setEmployees] = useState(null);

  useEffect(() => {
    if (!user) return;
    return subscribeToEmployees(user.uid, setEmployees, () => setEmployees([]));
  }, [user]);

  const reminders = employees ? buildReminders(employees, t) : [];

  async function handleDismiss(e, reminder) {
    e.preventDefault();
    e.stopPropagation();
    await dismissReminder(user.uid, reminder.employeeId, reminder.id);
  }

  return (
    <div className="reminders-page">
      <Link to="/" className="reminders-page__back">
        ← {t("backToList")}
      </Link>
      <h1 className="reminders-page__title">{t("reminders")}</h1>

      {employees === null && <div className="reminders-page__loading">…</div>}

      {employees !== null && reminders.length === 0 && (
        <div className="reminders-page__empty">{t("noReminders")}</div>
      )}

      <div className="reminders-page__list">
        {reminders.map((r) => (
          <Link key={r.id} to={`/employees/${r.employeeId}`} className={`reminder reminder--${r.severity}`}>
            <span className="reminder__dot" />
            <div className="reminder__body">
              <div className="reminder__name">{r.employeeName}</div>
              <div className="reminder__text">{r.text}</div>
            </div>
            <button
              className="reminder__dismiss"
              onClick={(e) => handleDismiss(e, r)}
              aria-label={t("dismiss")}
              title={t("dismiss")}
            >
              ✓
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
