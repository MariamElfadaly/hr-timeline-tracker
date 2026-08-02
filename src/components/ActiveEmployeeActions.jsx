import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { todayISO } from "../lib/dateUtils";
import { scheduleActiveReview, clearActiveReview, endEmployment } from "../lib/employees";
import "./ActiveEmployeeActions.css";

export default function ActiveEmployeeActions({ employee, onChanged }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeAction, setActiveAction] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(fn) {
    setBusy(true);
    setError("");
    try {
      await fn();
      setActiveAction(null);
      onChanged?.();
    } catch {
      setError(t("genericError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="active-actions no-print">
      {employee.upcomingReview && (
        <div className="active-actions__scheduled">
          <span>{t("reviewScheduledFor", { date: employee.upcomingReview.date })}</span>
          <button
            className="active-actions__clear"
            onClick={() => run(() => clearActiveReview(user.uid, employee.id))}
            disabled={busy}
          >
            {t("clear")}
          </button>
        </div>
      )}

      {!activeAction && (
        <div className="active-actions__buttons">
          {!employee.upcomingReview && (
            <button className="btn btn--ghost" onClick={() => setActiveAction("review")}>
              {t("scheduleReview")}
            </button>
          )}
          <button className="btn btn--danger" onClick={() => setActiveAction("end")}>
            {t("endEmployment")}
          </button>
        </div>
      )}

      {activeAction === "review" && (
        <ReviewForm
          busy={busy}
          error={error}
          onCancel={() => setActiveAction(null)}
          onSubmit={(date, note) => run(() => scheduleActiveReview(user.uid, employee.id, date, note))}
        />
      )}

      {activeAction === "end" && (
        <EndForm
          busy={busy}
          error={error}
          onCancel={() => setActiveAction(null)}
          onSubmit={(date, reason) => run(() => endEmployment(user.uid, employee.id, date, reason))}
        />
      )}
    </div>
  );
}

function ReviewForm({ onSubmit, onCancel, busy, error }) {
  const { t } = useLanguage();
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="action-form">
      <label className="field">
        <span className="field__label">{t("reviewDate")}</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label className="field">
        <span className="field__label">{t("noteOptional")}</span>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      {error && <div className="action-form__error">{error}</div>}
      <div className="action-form__actions">
        <button className="btn btn--ghost" onClick={onCancel} disabled={busy}>
          {t("cancel")}
        </button>
        <button className="btn btn--primary" onClick={() => onSubmit(date, note)} disabled={busy || !date}>
          {busy ? t("saving") : t("scheduleReview")}
        </button>
      </div>
    </div>
  );
}

function EndForm({ onSubmit, onCancel, busy, error }) {
  const { t } = useLanguage();
  const [date, setDate] = useState(todayISO());
  const [reason, setReason] = useState("");

  return (
    <div className="action-form">
      <p className="action-form__prompt action-form__prompt--danger">{t("endEmploymentPrompt")}</p>
      <label className="field">
        <span className="field__label">{t("endDate")}</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label className="field">
        <span className="field__label">{t("reasonOptional")}</span>
        <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      {error && <div className="action-form__error">{error}</div>}
      <div className="action-form__actions">
        <button className="btn btn--ghost" onClick={onCancel} disabled={busy}>
          {t("cancel")}
        </button>
        <button className="btn btn--danger" onClick={() => onSubmit(date, reason)} disabled={busy}>
          {busy ? t("saving") : t("endEmployment")}
        </button>
      </div>
    </div>
  );
}
