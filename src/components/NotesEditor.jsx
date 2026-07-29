import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { updateNotes } from "../lib/employees";
import "./NotesEditor.css";

export default function NotesEditor({ employee }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [value, setValue] = useState(employee.notes || "");
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleBlur() {
    if (value === (employee.notes || "")) return;
    setSaving(true);
    try {
      await updateNotes(user.uid, employee.id, value);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="notes-editor">
      <div className="notes-editor__header">
        <span className="notes-editor__title">{t("notes")}</span>
        {saving && <span className="notes-editor__status">{t("saving")}</span>}
      </div>
      <textarea
        className="notes-editor__textarea"
        placeholder={t("notesPlaceholder")}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        onBlur={handleBlur}
        rows={4}
      />
      {!saved && !saving && <span className="notes-editor__hint">{t("notesUnsavedHint")}</span>}
    </div>
  );
}
