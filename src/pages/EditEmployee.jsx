import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getEmployee, updateEmployeeInfo } from "../lib/employees";
import "./AddEmployee.css";

export default function EditEmployee() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let active = true;
    getEmployee(user.uid, id).then((emp) => {
      if (active && emp) {
        setForm({
          name: emp.name || "",
          employeeId: emp.employeeId || "",
          jobTitle: emp.jobTitle || "",
          phoneNumber: emp.phoneNumber || "",
          department: emp.department || "",
          email: emp.email || "",
          manager: emp.manager || "",
        });
      }
    });
    return () => {
      active = false;
    };
  }, [user, id]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = t("requiredField");
    if (!form.employeeId.trim()) next.employeeId = t("requiredField");
    if (!form.jobTitle.trim()) next.jobTitle = t("requiredField");
    if (!form.phoneNumber.trim()) next.phoneNumber = t("requiredField");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSubmitError("");
    try {
      await updateEmployeeInfo(user.uid, id, form);
      navigate(`/employees/${id}`);
    } catch {
      setSubmitError(t("genericError"));
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <div className="add-page">…</div>;

  return (
    <div className="add-page">
      <Link to={`/employees/${id}`} className="add-page__back">
        ← {t("backToProfile")}
      </Link>
      <h1 className="add-page__title">{t("editEmployee")}</h1>
      <p className="add-page__edit-hint">{t("editEmployeeHint")}</p>

      <form className="add-page__form" onSubmit={handleSubmit}>
        <div className="add-page__grid">
          <FieldInput label={t("fullName")} value={form.name} onChange={(v) => update("name", v)} error={errors.name} />
          <FieldInput label={t("employeeId")} value={form.employeeId} onChange={(v) => update("employeeId", v)} error={errors.employeeId} />
          <FieldInput label={t("jobTitle")} value={form.jobTitle} onChange={(v) => update("jobTitle", v)} error={errors.jobTitle} />
          <FieldInput label={t("phoneNumber")} value={form.phoneNumber} onChange={(v) => update("phoneNumber", v)} error={errors.phoneNumber} />
          <FieldInput label={t("department")} value={form.department} onChange={(v) => update("department", v)} />
          <FieldInput label={t("emailOptional")} type="email" value={form.email} onChange={(v) => update("email", v)} />
          <FieldInput label={t("manager")} value={form.manager} onChange={(v) => update("manager", v)} />
        </div>

        {submitError && <div className="add-page__error">{submitError}</div>}

        <div className="add-page__actions">
          <Link to={`/employees/${id}`} className="btn btn--ghost">
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
