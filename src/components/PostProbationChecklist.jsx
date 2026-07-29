import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { todayISO } from "../lib/dateUtils";
import { updateChecklist } from "../lib/employees";
import { isChecklistComplete } from "../lib/employeeStatus";
import "./PostProbationChecklist.css";

export default function PostProbationChecklist({ employee, onChanged }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [local, setLocal] = useState(employee.checklist);
  const [savingKey, setSavingKey] = useState(null);

  const complete = isChecklistComplete(local);

  async function patch(fields) {
    const next = { ...local, ...fields };
    setLocal(next);
    setSavingKey(Object.keys(fields)[0]);
    try {
      await updateChecklist(user.uid, employee.id, fields);
      onChanged?.();
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="checklist">
      <div className="checklist__header">
        <span className="checklist__title">{t("postProbationChecklist")}</span>
        <span className={`checklist__status ${complete ? "checklist__status--done" : ""}`}>
          {complete ? t("checklistComplete") : t("checklistIncomplete")}
        </span>
      </div>

      {/* Employee ID */}
      <ChecklistItem
        label={t("employeeIdItem")}
        checked={local.idIssued}
        onToggle={(v) => patch({ idIssued: v, idIssueDate: v ? todayISO() : null })}
      >
        {local.idIssued && (
          <input
            className="checklist__inline-input"
            placeholder={t("idNumber")}
            value={local.idNumber}
            onChange={(e) => patch({ idNumber: e.target.value })}
          />
        )}
      </ChecklistItem>

      {/* Uniform */}
      <ChecklistItem
        label={t("uniform")}
        checked={local.uniformRequired ? local.uniformProvided : true}
        toggleLabel={local.uniformRequired ? undefined : t("uniformNotRequired")}
        disabled={!local.uniformRequired}
        onToggle={(v) => patch({ uniformProvided: v, uniformDate: v ? todayISO() : null })}
        headerExtra={
          <label className="checklist__required-toggle">
            <input
              type="checkbox"
              checked={local.uniformRequired}
              onChange={(e) => patch({ uniformRequired: e.target.checked })}
            />
            {t("required")}
          </label>
        }
      >
        {local.uniformRequired && (
          <div className="checklist__inline-row">
            <input
              className="checklist__inline-input"
              placeholder={t("uniformType")}
              value={local.uniformType}
              onChange={(e) => patch({ uniformType: e.target.value })}
            />
            <input
              className="checklist__inline-input checklist__inline-input--sm"
              placeholder={t("quantity")}
              value={local.uniformQuantity}
              onChange={(e) => patch({ uniformQuantity: e.target.value })}
            />
            <input
              className="checklist__inline-input checklist__inline-input--sm"
              placeholder={t("size")}
              value={local.uniformSize}
              onChange={(e) => patch({ uniformSize: e.target.value })}
            />
          </div>
        )}
      </ChecklistItem>

      {/* Locker */}
      <ChecklistItem
        label={t("locker")}
        checked={local.lockerRequired ? local.lockerAssigned : true}
        disabled={!local.lockerRequired}
        onToggle={(v) => patch({ lockerAssigned: v, lockerDate: v ? todayISO() : null })}
        headerExtra={
          <label className="checklist__required-toggle">
            <input
              type="checkbox"
              checked={local.lockerRequired}
              onChange={(e) => patch({ lockerRequired: e.target.checked })}
            />
            {t("required")}
          </label>
        }
      >
        {local.lockerRequired && (
          <input
            className="checklist__inline-input"
            placeholder={t("lockerNumber")}
            value={local.lockerNumber}
            onChange={(e) => patch({ lockerNumber: e.target.value })}
          />
        )}
      </ChecklistItem>

      {/* Payroll card */}
      <ChecklistItem
        label={t("payrollCard")}
        checked={local.payrollCardIssued}
        onToggle={(v) => patch({ payrollCardIssued: v })}
      />

      {/* EMP FILE */}
      <ChecklistItem
        label={t("empFile")}
        checked={local.empFileCompleted}
        onToggle={(v) => patch({ empFileCompleted: v })}
      />

      {savingKey && <div className="checklist__saving">{t("saving")}</div>}
    </div>
  );
}

function ChecklistItem({ label, checked, onToggle, disabled, headerExtra, toggleLabel, children }) {
  return (
    <div className={`checklist-item ${checked ? "checklist-item--done" : ""}`}>
      <div className="checklist-item__row">
        <label className="checklist-item__toggle">
          <input
            type="checkbox"
            checked={!!checked}
            disabled={disabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <span>{label}</span>
        </label>
        {headerExtra}
      </div>
      {toggleLabel && <span className="checklist-item__note">{toggleLabel}</span>}
      {children && <div className="checklist-item__extra">{children}</div>}
    </div>
  );
}
