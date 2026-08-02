import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { subscribeToEmployees, deleteReminder, toggleReminderChecked } from "../lib/employees";
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

  async function handleToggleCheck(e, reminder) {
    e.preventDefault();
    e.stopPropagation();
    await toggleReminderChecked(user.uid, reminder.employeeId, reminder.id, !reminder.checked);
  }

  async function handleDelete(e, reminder) {
    e.preventDefault();
    e.stopPropagation();
    await deleteReminder(user.uid, reminder.employeeId, reminder.id);
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
          <Link
            key={r.id}
            to={`/employees/${r.employeeId}`}
            className={`reminder reminder--${r.severity} ${r.checked ? "reminder--checked" : ""}`}
          >
            <button
              className={`reminder__check ${r.checked ? "reminder__check--on" : ""}`}
              onClick={(e) => handleToggleCheck(e, r)}
              aria-label={t("markDone")}
              title={t("markDone")}
            >
              {r.checked ? "✓" : ""}
            </button>
            <div className="reminder__body">
              <div className="reminder__name">{r.employeeName}</div>
              <div className="reminder__text">{r.text}</div>
            </div>
            <button
              className="reminder__delete"
              onClick={(e) => handleDelete(e, r)}
              aria-label={t("deleteReminder")}
              title={t("deleteReminder")}
            >
              ×
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
