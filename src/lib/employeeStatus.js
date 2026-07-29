import { probationProgress, upcomingAnniversaries } from "./dateUtils";

/**
 * Employee status is derived, not just read from the stored `status` field,
 * because a probation end date can pass at any moment without anyone
 * touching the record. A "review_scheduled" decision does NOT close out
 * probation — it's a note that HR wants to talk before deciding, so the
 * employee stays in "action_required" until a real decision is recorded.
 */
export function deriveStatus(employee) {
  if (employee.status === "ended") return "ended";

  const decision = employee.probation?.decision;

  if (decision?.type === "confirmed") return "active";
  if (decision?.type === "ended") return "ended";

  if (employee.probation && (!decision || decision.type === "review_scheduled")) {
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
    const decision = employee.probation?.decision;
    if (decision?.type === "review_scheduled") {
      return { text: t("statusReviewScheduled"), urgent: true };
    }
    return { text: t("statusActionRequired"), urgent: true };
  }

  if (status === "probation") {
    const p = getProbationInfo(employee);
    if (p.daysRemaining <= 7) {
      return { text: t("decideSoonShort", { days: p.daysRemaining }), urgent: true };
    }
    return { text: `${p.daysRemaining} ${t("daysRemaining")}`, urgent: false };
  }

  if (status === "active") {
    if (employee.checklist && !isChecklistComplete(employee.checklist)) {
      return { text: t("checklistIncomplete"), urgent: false };
    }
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

export function isChecklistComplete(checklist) {
  if (!checklist) return false;
  const idOk = checklist.idIssued === true;
  const uniformOk = checklist.uniformRequired === false || checklist.uniformProvided === true;
  const lockerOk = checklist.lockerRequired === false || checklist.lockerAssigned === true;
  const payrollOk = checklist.payrollCardIssued === true;
  const empFileOk = checklist.empFileCompleted === true;
  return idOk && uniformOk && lockerOk && payrollOk && empFileOk;
}

/**
 * Probation reminder schedule: 30/14/7/1 days before end, and on the end
 * date itself. Returns the single nearest upcoming reminder, or null.
 */
export function getProbationReminder(employee) {
  if (deriveStatus(employee) !== "probation") return null;
  const p = getProbationInfo(employee);
  const milestones = [30, 14, 7, 1, 0];
  const hit = milestones.find((m) => p.daysRemaining <= m);
  if (hit === undefined) return null;
  return { daysRemaining: p.daysRemaining, milestone: hit };
}
