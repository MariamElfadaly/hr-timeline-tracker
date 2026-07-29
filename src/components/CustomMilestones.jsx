import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { addMilestone, deleteMilestone } from "../lib/employees";
import { MILESTONE_TYPES, REMINDER_OFFSETS } from "../lib/milestoneTypes";
import "./CustomMilestones.css";

export default function CustomMilestones({ employee, onChanged }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState("contract_expiry");
  const [customLabel, setCustomLabel] = useState("");
  const [date, setDate] = useState("");
  const [offsets, setOffsets] = useState([...REMINDER_OFFSETS]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const milestones = employee.milestones || [];

  function toggleOffset(o) {
    setOffsets((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o].sort((a, b) => b - a)));
  }

  async function handleAdd() {
    if (!date || (type === "other" && !customLabel.trim())) {
      setError(t("requiredField"));
      return;
    }
    setBusy(true);
    setError("");
    try {
      await addMilestone(user.uid, employee.id, { type, customLabel, date, reminderOffsets: offsets });
      setDate("");
      setCustomLabel("");
      setAdding(false);
      onChanged?.();
    } catch {
      setError(t("genericError"));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    await deleteMilestone(user.uid, employee.id, id);
    onChanged?.();
  }

  return (
    <div className="milestones">
      <div className="milestones__header">
        <span className="milestones__title">{t("customMilestones")}</span>
        {!adding && (
          <button className="btn btn--ghost milestones__add-btn" onClick={() => setAdding(true)}>
            + {t("addMilestone")}
          </button>
        )}
      </div>

      {milestones.length === 0 && !adding && (
        <p className="milestones__empty">{t("noMilestones")}</p>
      )}

      <div className="milestones__list">
        {milestones.map((m) => (
          <div key={m.id} className="milestones__item">
            <div>
              <div className="milestones__item-label">
                {m.type === "other" ? m.customLabel : t(`milestoneType_${m.type}`)}
              </div>
              <div className="milestones__item-date">{m.date}</div>
            </div>
            <button className="milestones__delete" onClick={() => handleDelete(m.id)} aria-label={t("cancel")}>
              ×
            </button>
          </div>
        ))}
      </div>

      {adding && (
        <div className="milestones__form">
          <label className="field">
            <span className="field__label">{t("milestoneType")}</span>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {MILESTONE_TYPES.map((mt) => (
                <option key={mt} value={mt}>
                  {t(`milestoneType_${mt}`)}
                </option>
              ))}
            </select>
          </label>

          {type === "other" && (
            <label className="field">
              <span className="field__label">{t("milestoneLabel")}</span>
              <input type="text" value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} />
            </label>
          )}

          <label className="field">
            <span className="field__label">{t("milestoneDate")}</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <div className="field">
            <span className="field__label">{t("remindMeBefore")}</span>
            <div className="milestones__offsets">
              {REMINDER_OFFSETS.map((o) => (
                <label key={o} className="radio-pill">
                  <input type="checkbox" checked={offsets.includes(o)} onChange={() => toggleOffset(o)} />
                  {o === 0 ? t("onTheDay") : t("daysBefore", { days: o })}
                </label>
              ))}
            </div>
          </div>

          {error && <div className="action-form__error">{error}</div>}

          <div className="action-form__actions">
            <button className="btn btn--ghost" onClick={() => setAdding(false)} disabled={busy}>
              {t("cancel")}
            </button>
            <button className="btn btn--primary" onClick={handleAdd} disabled={busy}>
              {busy ? t("saving") : t("save")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
