import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { createEmployee } from "../lib/employees";
import "./AddEmployee.css";

const emptyForm = {
  name: "",
  employeeId: "",
  jobTitle: "",
  joiningDate: "",
  phoneNumber: "",
  probationType: "3_months",
  probationCustomEndDate: "",
  department: "",
  email: "",
  manager: "",
};

export default function AddEmployee() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = t("requiredField");
    if (!form.employeeId.trim()) next.employeeId = t("requiredField");
    if (!form.jobTitle.trim()) next.jobTitle = t("requiredField");
    if (!form.joiningDate) next.joiningDate = t("requiredField");
    if (!form.phoneNumber.trim()) next.phoneNumber = t("requiredField");
    if (form.probationType === "custom" && !form.probationCustomEndDate) {
      next.probationCustomEndDate = t("requiredField");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSubmitError("");
    try {
      const id = await createEmployee(user.uid, form);
      navigate(`/employees/${id}`);
    } catch {
      setSubmitError(t("genericError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="add-page">
      <Link to="/" className="add-page__back">
        ← {t("backToList")}
      </Link>
      <h1 className="add-page__title">{t("newEmployee")}</h1>

      <form className="add-page__form" onSubmit={handleSubmit}>
        <div className="add-page__grid">
          <FieldInput label={t("fullName")} value={form.name} onChange={(v) => update("name", v)} error={errors.name} />
          <FieldInput label={t("employeeId")} value={form.employeeId} onChange={(v) => update("employeeId", v)} error={errors.employeeId} />
          <FieldInput label={t("jobTitle")} value={form.jobTitle} onChange={(v) => update("jobTitle", v)} error={errors.jobTitle} />
          <FieldInput
            label={t("joiningDate")}
            type="date"
            value={form.joiningDate}
            onChange={(v) => update("joiningDate", v)}
            error={errors.joiningDate}
          />
          <FieldInput label={t("phoneNumber")} value={form.phoneNumber} onChange={(v) => update("phoneNumber", v)} error={errors.phoneNumber} />

          <label className={`field ${errors.probationCustomEndDate ? "field--error" : ""}`}>
            <span className="field__label">{t("probationPeriod")}</span>
            <select value={form.probationType} onChange={(e) => update("probationType", e.target.value)}>
              <option value="1_month">{t("oneMonth")}</option>
              <option value="3_months">{t("threeMonths")}</option>
              <option value="6_months">{t("sixMonths")}</option>
              <option value="custom">{t("custom")}</option>
            </select>
          </label>

          {form.probationType === "custom" && (
            <FieldInput
              label={t("customEndDate")}
              type="date"
              value={form.probationCustomEndDate}
              onChange={(v) => update("probationCustomEndDate", v)}
              error={errors.probationCustomEndDate}
            />
          )}

          <div className="add-page__divider">
            <span>{t("department")} · {t("emailOptional")} · {t("manager")}</span>
          </div>

          <FieldInput label={t("department")} value={form.department} onChange={(v) => update("department", v)} />
          <FieldInput label={t("emailOptional")} type="email" value={form.email} onChange={(v) => update("email", v)} />
          <FieldInput label={t("manager")} value={form.manager} onChange={(v) => update("manager", v)} />
        </div>

        {submitError && <div className="add-page__error">{submitError}</div>}

        <div className="add-page__actions">
          <Link to="/" className="btn btn--ghost">
            {t("cancel")}
          </Link>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldInput({ label, value, onChange, error, type = "text" }) {
  return (
    <label className={`field ${error ? "field--error" : ""}`}>
      <span className="field__label">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}
