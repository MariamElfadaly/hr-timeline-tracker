import { deriveStatus, getProbationInfo, isChecklistComplete } from "./employeeStatus";

/**
 * Builds the full reminders list for the employer, computed fresh from
 * live employee data each time — nothing here is stored separately.
 * Sorted most-urgent first.
 */
export function buildReminders(employees, t) {
  const items = [];

  for (const emp of employees) {
    const status = deriveStatus(emp);
    const decision = emp.probation?.decision;

    if (status === "action_required") {
      if (decision?.type === "review_scheduled") {
        items.push({
          id: `${emp.id}-review`,
          employeeId: emp.id,
          employeeName: emp.name,
          severity: "high",
          text: t("reminderReviewScheduled", { date: decision.reviewDate }),
        });
      } else {
        items.push({
          id: `${emp.id}-action`,
          employeeId: emp.id,
          employeeName: emp.name,
          severity: "high",
          text: t("reminderActionRequired"),
        });
      }
    }

    if (status === "probation") {
      const p = getProbationInfo(emp);
      if (p.daysRemaining <= 30) {
        items.push({
          id: `${emp.id}-probation`,
          employeeId: emp.id,
          employeeName: emp.name,
          severity: p.daysRemaining <= 7 ? "high" : "medium",
          text:
            p.daysRemaining === 0
              ? t("reminderProbationEndsToday")
              : t("reminderProbationEndsIn", { days: p.daysRemaining }),
        });
      }
    }

    if (status === "active" && emp.checklist && !isChecklistComplete(emp.checklist)) {
      const missing = [];
      if (!emp.checklist.idIssued) missing.push(t("employeeId"));
      if (emp.checklist.uniformRequired && !emp.checklist.uniformProvided) missing.push(t("uniform"));
      if (emp.checklist.lockerRequired && !emp.checklist.lockerAssigned) missing.push(t("locker"));
      if (!emp.checklist.payrollCardIssued) missing.push(t("payrollCard"));
      if (!emp.checklist.empFileCompleted) missing.push(t("empFile"));

      if (missing.length > 0) {
        items.push({
          id: `${emp.id}-checklist`,
          employeeId: emp.id,
          employeeName: emp.name,
          severity: "low",
          text: t("reminderChecklistMissing", { items: missing.join(", ") }),
        });
      }
    }
  }

  const order = { high: 0, medium: 1, low: 2 };
  return items.sort((a, b) => order[a.severity] - order[b.severity]);
}
