import { deriveStatus, getProbationInfo, isChecklistComplete } from "./employeeStatus";
import { totalDaysBetween } from "./dateUtils";

/**
 * Builds the full reminders list for the employer, computed fresh from
 * live employee data each time — nothing here is stored separately, except
 * dismissals (employee.dismissedReminders), which HR can mark as "done" to
 * silence a specific reminder until the underlying situation changes.
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

    // Only surface a probation reminder in the final week — anything
    // further out is just noise on the Reminders page.
    if (status === "probation") {
      const p = getProbationInfo(emp);
      if (p.daysRemaining <= 7) {
        items.push({
          id: `${emp.id}-probation`,
          employeeId: emp.id,
          employeeName: emp.name,
          severity: "high",
          text:
            p.daysRemaining === 0
              ? t("reminderProbationDecideToday")
              : t("reminderProbationDecideSoon", { days: p.daysRemaining }),
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

    if (status === "active" && emp.upcomingReview) {
      const daysAway = totalDaysBetween(new Date(), emp.upcomingReview.date);
      if (daysAway <= 7) {
        items.push({
          id: `${emp.id}-active-review`,
          employeeId: emp.id,
          employeeName: emp.name,
          severity: "high",
          text:
            daysAway <= 0
              ? t("reminderActiveReviewToday")
              : t("reminderActiveReviewIn", { days: daysAway }),
        });
      }
    }

    for (const m of emp.milestones || []) {
      const daysAway = totalDaysBetween(new Date(), m.date);
      const offsets = m.reminderOffsets && m.reminderOffsets.length > 0 ? m.reminderOffsets : [30, 14, 7, 1, 0];
      const maxOffset = Math.max(...offsets);
      if (daysAway <= maxOffset) {
        const label = m.type === "other" ? m.customLabel : t(`milestoneType_${m.type}`);
        items.push({
          id: `${emp.id}-milestone-${m.id}`,
          employeeId: emp.id,
          employeeName: emp.name,
          severity: daysAway <= 7 ? "high" : daysAway <= 14 ? "medium" : "low",
          text:
            daysAway <= 0
              ? t("reminderMilestoneToday", { label })
              : t("reminderMilestoneIn", { label, days: daysAway }),
        });
      }
    }
  }

  const visible = items
    .filter((item) => {
      const emp = employees.find((e) => e.id === item.employeeId);
      return !emp?.dismissedReminders?.[item.id];
    })
    .map((item) => {
      const emp = employees.find((e) => e.id === item.employeeId);
      return { ...item, checked: !!emp?.checkedReminders?.[item.id] };
    });

  const order = { high: 0, medium: 1, low: 2 };
  return visible.sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    return order[a.severity] - order[b.severity];
  });
}
