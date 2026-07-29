import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { deleteEmployee } from "../lib/employees";
import "./DangerZone.css";

export default function DangerZone({ employee }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setBusy(true);
    setError("");
    try {
      await deleteEmployee(user.uid, employee.id);
      navigate("/");
    } catch {
      setError(t("genericError"));
      setBusy(false);
    }
  }

  return (
    <div className="danger-zone">
      {!confirming ? (
        <button className="danger-zone__trigger" onClick={() => setConfirming(true)}>
          {t("deleteEmployee")}
        </button>
      ) : (
        <div className="danger-zone__confirm">
          <p className="danger-zone__prompt">{t("deleteEmployeePrompt", { name: employee.name })}</p>
          {error && <div className="action-form__error">{error}</div>}
          <div className="action-form__actions">
            <button className="btn btn--ghost" onClick={() => setConfirming(false)} disabled={busy}>
              {t("cancel")}
            </button>
            <button className="btn btn--danger" onClick={handleDelete} disabled={busy}>
              {busy ? t("saving") : t("deleteConfirm")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
