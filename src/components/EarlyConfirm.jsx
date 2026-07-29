import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { confirmEmployee } from "../lib/employees";
import { todayISO } from "../lib/dateUtils";

export default function EarlyConfirm({ employee, onDecided }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setBusy(true);
    setError("");
    try {
      await confirmEmployee(user.uid, employee.id, todayISO());
      onDecided?.();
    } catch {
      setError(t("genericError"));
      setBusy(false);
    }
  }

  if (!confirming) {
    return (
      <button className="early-confirm__trigger" onClick={() => setConfirming(true)}>
        {t("confirmEarly")}
      </button>
    );
  }

  return (
    <div className="early-confirm__box">
      <p className="early-confirm__prompt">{t("confirmEarlyPrompt")}</p>
      {error && <div className="action-form__error">{error}</div>}
      <div className="action-form__actions">
        <button className="btn btn--ghost" onClick={() => setConfirming(false)} disabled={busy}>
          {t("cancel")}
        </button>
        <button className="btn btn--primary" onClick={handleConfirm} disabled={busy}>
          {busy ? t("saving") : t("confirmEmployee")}
        </button>
      </div>
    </div>
  );
}
