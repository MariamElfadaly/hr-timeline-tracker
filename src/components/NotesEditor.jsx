import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { addNoteEntry, deleteNoteEntry } from "../lib/employees";
import "./NotesEditor.css";

function formatTimestamp(iso, lang) {
  const d = new Date(iso);
  return d.toLocaleString(lang === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotesEditor({ employee, onChanged }) {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const notes = employee.notesLog || [];

  async function handleAdd() {
    if (!draft.trim()) return;
    setBusy(true);
    try {
      await addNoteEntry(user.uid, employee.id, draft);
      setDraft("");
      onChanged?.();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    await deleteNoteEntry(user.uid, employee.id, id);
    onChanged?.();
  }

  return (
    <div className="notes-editor">
      <span className="notes-editor__title">{t("notes")}</span>

      <div className="notes-editor__add no-print">
        <textarea
          className="notes-editor__textarea"
          placeholder={t("notesPlaceholder")}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
        />
        <button className="btn btn--primary notes-editor__add-btn" onClick={handleAdd} disabled={busy || !draft.trim()}>
          {busy ? t("saving") : t("addNote")}
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="notes-editor__empty">{t("noNotesYet")}</p>
      ) : (
        <div className="notes-editor__log">
          {notes.map((n) => (
            <div key={n.id} className="notes-editor__entry">
              <div className="notes-editor__entry-header">
                <span className="notes-editor__timestamp">{formatTimestamp(n.timestamp, lang)}</span>
                <button
                  className="notes-editor__delete no-print"
                  onClick={() => handleDelete(n.id)}
                  aria-label={t("cancel")}
                >
                  ×
                </button>
              </div>
              <div className="notes-editor__entry-text">{n.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
