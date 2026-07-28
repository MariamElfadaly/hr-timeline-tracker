import { probationProgress, upcomingAnniversaries } from "./dateUtils";

/**
 * Employee status is derived, not just read from the stored `status` field,
 * because a probation end date can pass at any moment without anyone
 * touching the record. The stored field is authoritative once HR has made
 * a decision (confirmed / extended / ended); until then we check the date.
 */
export function deriveStatus(employee) {
  if (employee.status === "ended") return "ended";
  if (employee.status === "active") return "active";

  if (employee.probation && !employee.probation.decision) {
    const progress = probationProgress(employee.probation.startDate, employee.probation.endDate);
    return progress.isOver ? "action_required" : "probation";
  }

  return employee.status || "active";
}

export function getProbationInfo(employee) {
  if (!employee.probation) return null;
  return probationProgress(employee.probation.startDate, employee.probation.endDate);
}

/** A single most-relevant upcoming item to surface on the list card. */
export function getNextAction(employee, t) {
  const status = deriveStatus(employee);

  if (status === "action_required") {
    return { text: t("statusActionRequired"), urgent: true };
  }

  if (status === "probation") {
    const p = getProbationInfo(employee);
    return { text: `${p.daysRemaining} ${t("daysRemaining")}`, urgent: p.daysRemaining <= 7 };
  }

  if (status === "active") {
    const anniversaries = upcomingAnniversaries(employee.joiningDate)
      .filter((m) => m.daysAway >= 0)
      .sort((a, b) => a.daysAway - b.daysAway);
    const next = anniversaries[0];
    if (next && next.daysAway <= 30) {
      return { text: `${next.label.replace("_", " ")} · ${next.daysAway}d`, urgent: false };
    }
  }

  return null;
}
