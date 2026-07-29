import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { addMonths, toISODate, todayISO } from "../lib/dateUtils";
import { confirmEmployee, extendProbation, endEmployment, scheduleReview } from "../lib/employees";
import "./ProbationActionRequired.css";

export default function ProbationActionRequired({ employee, onDecided }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeAction, setActiveAction] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const reviewNote = employee.probation?.decision?.reviewDate
    ? t("reminderReviewScheduled", { date: employee.probation.decision.reviewDate })
    : null;

  async function run(fn) {
    setBusy(true);
    setError("");
    try {
      await fn();
      setActiveAction(null);
      onDecided?.();
    } catch {
      setError(t("genericError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="action-required">
      <div className="action-required__header">
        <span className="action-required__label">{t("actionRequired")}</span>
        <p className="action-required__desc">{t("actionRequiredDesc")}</p>
        {reviewNote && <p className="action-required__review-note">{reviewNote}</p>}
      </div>

      {!activeAction && (
        <div className="action-required__buttons">
          <button className="btn btn--primary" onClick={() => setActiveAction("confirm")}>
            {t("confirmEmployee")}
          </button>
          <button className="btn btn--ghost" onClick={() => setActiveAction("extend")}>
            {t("extendProbation")}
          </button>
          <button className="btn btn--ghost" onClick={() => setActiveAction("review")}>
            {t("scheduleReview")}
          </button>
          <button className="btn btn--danger" onClick={() => setActiveAction("end")}>
            {t("endEmployment")}
          </button>
        </div>
      )}

      {activeAction === "confirm" && (
        <ConfirmForm
          busy={busy}
          error={error}
          onCancel={() => setActiveAction(null)}
          onSubmit={() => run(() => confirmEmployee(user.uid, employee.id, todayISO()))}
        />
      )}

      {activeAction === "extend" && (
        <ExtendForm
          employee={employee}
          busy={busy}
          error={error}
          onCancel={() => setActiveAction(null)}
          onSubmit={(newEndDate, note) =>
            run(() => extendProbation(user.uid, employee.id, newEndDate, note, todayISO()))
          }
        />
      )}

      {activeAction === "review" && (
        <ReviewForm
          busy={busy}
          error={error}
          onCancel={() => setActiveAction(null)}
          onSubmit={(reviewDate, note) =>
            run(() => scheduleReview(user.uid, employee.id, reviewDate, note, todayISO()))
          }
        />
      )}

      {activeAction === "end" && (
        <EndForm
          busy={busy}
          error={error}
          onCancel={() => setActiveAction(null)}
          onSubmit={(endDate, reason) => run(() => endEmployment(user.uid, employee.id, endDate, reason))}
        />
      )}
    </div>
  );
}

function ConfirmForm({ onSubmit, onCancel, busy, error }) {
  const { t } = useLanguage();
  return (
    <div className="action-form">
      <p className="action-form__prompt">{t("confirmEmployeePrompt")}</p>
      {error && <div className="action-form__error">{error}</div>}
      <div className="action-form__actions">
        <button className="btn btn--ghost" onClick={onCancel} disabled={busy}>
          {t("cancel")}
        </button>
        <button className="btn btn--primary" onClick={onSubmit} disabled={busy}>
          {busy ? t("saving") : t("confirmEmployee")}
        </button>
      </div>
    </div>
  );
}

function ExtendForm({ employee, onSubmit, onCancel, busy, error }) {
  const { t } = useLanguage();
  const currentEnd = employee.probation.endDate;
  const [mode, setMode] = useState("1_month");
  const [customDate, setCustomDate] = useState("");
  const [note, setNote] = useState("");

  function computeNewEnd() {
    if (mode === "custom") return customDate;
    const months = { "2_weeks": 0.5, "1_month": 1, "3_months": 3 }[mode];
    if (months === 0.5) {
      const d = new Date(currentEnd);
      d.setDate(d.getDate() + 14);
      return toISODate(d);
    }
    return toISODate(addMonths(currentEnd, months));
  }

  const newEnd = computeNewEnd();

  return (
    <div className="action-form">
      <p className="action-form__prompt">{t("extendProbationPrompt", { date: currentEnd })}</p>

      <div className="action-form__radios">
        {[
          ["2_weeks", t("twoWeeks")],
          ["1_month", t("oneMonth")],
          ["3_months", t("threeMonths")],
          ["custom", t("custom")],
        ].map(([value, label]) => (
          <label key={value} className="radio-pill">
            <input type="radio" name="extend-mode" checked={mode === value} onChange={() => setMode(value)} />
            {label}
          </label>
        ))}
      </div>

      {mode === "custom" && (
        <label className="field">
          <span className="field__label">{t("customEndDate")}</span>
          <input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} />
        </label>
      )}

      {newEnd && <p className="action-form__preview">{t("newProbationEnd", { date: newEnd })}</p>}

      <label className="field">
        <span className="field__label">{t("noteOptional")}</span>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>

      {error && <div className="action-form__error">{error}</div>}

      <div className="action-form__actions">
        <button className="btn btn--ghost" onClick={onCancel} disabled={busy}>
          {t("cancel")}
        </button>
        <button
          className="btn btn--primary"
          onClick={() => onSubmit(newEnd, note)}
          disabled={busy || !newEnd}
        >
          {busy ? t("saving") : t("extendProbation")}
        </button>
      </div>
    </div>
  );
}

function ReviewForm({ onSubmit, onCancel, busy, error }) {
  const { t } = useLanguage();
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="action-form">
      <p className="action-form__prompt">{t("scheduleReviewPrompt")}</p>

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
