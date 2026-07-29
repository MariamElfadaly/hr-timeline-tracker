import { deriveStatus, getProbationInfo, isChecklistComplete } from "./employeeStatus";
import { totalDaysBetween } from "./dateUtils";

export function buildReportData(employees) {
  const counts = { active: 0, probation: 0, action_required: 0, ended: 0 };
  const endingSoon = [];
  const incompleteChecklists = [];
  const upcomingMilestones = [];

  for (const emp of employees) {
    const status = deriveStatus(emp);
    counts[status] = (counts[status] || 0) + 1;

    if (status === "probation") {
      const p = getProbationInfo(emp);
      if (p.daysRemaining <= 30) {
        endingSoon.push({ id: emp.id, name: emp.name, daysRemaining: p.daysRemaining });
      }
    }

    if (status === "active" && emp.checklist && !isChecklistComplete(emp.checklist)) {
      incompleteChecklists.push({ id: emp.id, name: emp.name });
    }

    for (const m of emp.milestones || []) {
      const daysAway = totalDaysBetween(new Date(), m.date);
      if (daysAway >= 0 && daysAway <= 30) {
        upcomingMilestones.push({
          id: emp.id,
          name: emp.name,
          milestoneType: m.type,
          customLabel: m.customLabel,
          date: m.date,
          daysAway,
        });
      }
    }
  }

  endingSoon.sort((a, b) => a.daysRemaining - b.daysRemaining);
  upcomingMilestones.sort((a, b) => a.daysAway - b.daysAway);

  return {
    total: employees.length,
    counts,
    endingSoon,
    incompleteChecklists,
    upcomingMilestones,
  };
}
