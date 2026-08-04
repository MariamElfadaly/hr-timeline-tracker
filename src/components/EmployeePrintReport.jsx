import { useLanguage } from "../contexts/LanguageContext";
import { deriveStatus } from "../lib/employeeStatus";
import { buildTimelineEvents } from "../lib/timeline";
import { buildNarrative, checklistRows } from "../lib/printReport";
import { todayISO } from "../lib/dateUtils";

const STATUS_LABEL_KEY = {
  active: "statusActive",
  probation: "statusProbation",
  action_required: "statusActionRequired",
  ended: "statusEnded",
};

function formatNoteTimestamp(iso, lang) {
  const d = new Date(iso);
  return d.toLocaleString(lang === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EmployeePrintReport({ employee }) {
  const { t, lang } = useLanguage();
  const status = deriveStatus(employee);
  const timelineEvents = buildTimelineEvents(employee, t);
  const checklist = checklistRows(employee.checklist, t);
  const narrative = buildNarrative(employee, t);
  const upcomingMilestones = [...(employee.milestones || [])].sort((a, b) => (a.date < b.date ? -1 : 1));
  const notes = employee.notesLog || [];
  const isConfirmedOrLater = status === "active" || status === "ended";

  return (
    <div className="print-report">
      <div className="pr-masthead">
        <div>
          <div className="pr-eyebrow">{t("printReportEyebrow2")}</div>
          <div className="pr-name">{employee.name}</div>
        </div>
        <div className="pr-ref">
          <div>{t("printRef", { id: employee.employeeId, year: new Date().getFullYear() })}</div>
          <div>{t("printGeneratedOn", { date: todayISO() })}</div>
        </div>
      </div>
      <div className="pr-confidential">{t("printConfidential")}</div>

      <div className="pr-section-title">{t("printPersonalInfo")}</div>
      <table className="pr-table pr-table--info">
        <tbody>
          <tr>
            <td className="pr-label">{t("jobTitle")}</td>
            <td>{employee.jobTitle}</td>
            <td className="pr-label">{t("department")}</td>
            <td>{employee.department || "—"}</td>
          </tr>
          <tr>
            <td className="pr-label">{t("employeeId")}</td>
            <td>{employee.employeeId}</td>
            <td className="pr-label">{t("manager")}</td>
            <td>{employee.manager || "—"}</td>
          </tr>
          <tr>
            <td className="pr-label">{t("phoneNumber")}</td>
            <td>{employee.phoneNumber}</td>
            <td className="pr-label">{t("emailOptional")}</td>
            <td>{employee.email || "—"}</td>
          </tr>
          <tr>
            <td className="pr-label">{t("joiningDate")}</td>
            <td>{employee.joiningDate}</td>
            <td className="pr-label">{t("printStatusLabel")}</td>
            <td className="pr-strong">{t(STATUS_LABEL_KEY[status])}</td>
          </tr>
        </tbody>
      </table>

      <div className="pr-section-title">{t("printEmploymentStatus")}</div>
      <p className="pr-narrative">{narrative}</p>

      {employee.probation && (
        <table className="pr-table pr-table--boxed">
          <tbody>
            {isConfirmedOrLater ? (
              employee.confirmation?.confirmedDate && (
                <tr>
                  <td className="pr-label">{t("confirmedOn")}</td>
                  <td>{employee.confirmation.confirmedDate}</td>
                </tr>
              )
            ) : (
              <tr>
                <td className="pr-label">{t("probationPeriod")}</td>
                <td>
                  {employee.probation.startDate} → {employee.probation.endDate}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {checklist.length > 0 && (
        <>
          <div className="pr-section-title">{t("postProbationChecklist")}</div>
          <table className="pr-table">
            <thead>
              <tr>
                <th>{t("printColItem")}</th>
                <th>{t("printColStatus")}</th>
                <th>{t("printColDetail")}</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map((row, i) => (
                <tr key={i}>
                  <td>{row.item}</td>
                  <td className={row.status === t("printStatusPending") ? "pr-pending" : ""}>{row.status}</td>
                  <td>{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="pr-section-title">{t("employeeTimeline")}</div>
      <table className="pr-table">
        <thead>
          <tr>
            <th>{t("printColDate")}</th>
            <th>{t("printColEvent")}</th>
          </tr>
        </thead>
        <tbody>
          {timelineEvents.map((ev, i) => (
            <tr key={i}>
              <td className="pr-mono">{ev.dateISO}</td>
              <td>{ev.label}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {upcomingMilestones.length > 0 && (
        <>
          <div className="pr-section-title">{t("customMilestones")}</div>
          <table className="pr-table">
            <thead>
              <tr>
                <th>{t("printColDate")}</th>
                <th>{t("printColMilestone")}</th>
              </tr>
            </thead>
            <tbody>
              {upcomingMilestones.map((m) => (
                <tr key={m.id}>
                  <td className="pr-mono">{m.date}</td>
                  <td>{m.type === "other" ? m.customLabel : t(`milestoneType_${m.type}`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {notes.length > 0 && (
        <>
          <div className="pr-section-title">{t("printNotesLog")}</div>
          <table className="pr-table">
            <tbody>
              {notes.map((n) => (
                <tr key={n.id}>
                  <td className="pr-mono pr-notes-ts">{formatNoteTimestamp(n.timestamp, lang)}</td>
                  <td>{n.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="pr-footer">
        <div>{t("printPreparedBy")}</div>
        <div>{t("printPageOf")}</div>
      </div>
    </div>
  );
}
