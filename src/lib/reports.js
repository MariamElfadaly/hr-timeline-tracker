import { deriveStatus, getProbationInfo, isChecklistComplete } from "./employeeStatus";
import { totalDaysBetween } from "./dateUtils";

export function buildReportData(employees) {
  const counts = { active: 0, probation: 0, action_required: 0, ended: 0 };
  const endingSoon = [];
  const incompleteChecklists = [];
  const upcomingMilestones = [];
  const byDepartment = new Map();

  let tenureDaysSum = 0;
  let tenureCount = 0;
  let confirmedCount = 0;
  let endedDuringProbationCount = 0;
  let checklistTrackedCount = 0;
  let checklistCompleteCount = 0;

  for (const emp of employees) {
    const status = deriveStatus(emp);
    counts[status] = (counts[status] || 0) + 1;

    // Currently-employed tenure (probation + active) feeds the average.
    if (status === "probation" || status === "active" || status === "action_required") {
      tenureDaysSum += totalDaysBetween(emp.joiningDate, new Date());
      tenureCount += 1;
    }

    // Department breakdown across everyone currently employed.
    if (status !== "ended") {
      const dept = emp.department?.trim() || "—";
      byDepartment.set(dept, (byDepartment.get(dept) || 0) + 1);
    }

    // Probation outcome tracking: did they make it past probation, or leave during it?
    if (emp.confirmation?.confirmedDate) {
      confirmedCount += 1;
    } else if (status === "ended") {
      endedDuringProbationCount += 1;
    }

    // Checklist completion rate across anyone who has ever had a checklist.
    if (emp.checklist) {
      checklistTrackedCount += 1;
      if (isChecklistComplete(emp.checklist)) checklistCompleteCount += 1;
      else if (status === "active") incompleteChecklists.push({ id: emp.id, name: emp.name });
    }

    if (status === "probation") {
      const p = getProbationInfo(emp);
      if (p.daysRemaining <= 30) {
        endingSoon.push({ id: emp.id, name: emp.name, daysRemaining: p.daysRemaining });
      }
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

  const departmentBreakdown = [...byDepartment.entries()]
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count);

  const avgTenureDays = tenureCount > 0 ? tenureDaysSum / tenureCount : 0;
  const avgTenure = avgTenureDays > 0 ? daysToYearsMonths(avgTenureDays) : null;

  const probationDecided = confirmedCount + endedDuringProbationCount;
  const probationPassRate = probationDecided > 0 ? Math.round((confirmedCount / probationDecided) * 100) : null;

  const checklistCompletionRate =
    checklistTrackedCount > 0 ? Math.round((checklistCompleteCount / checklistTrackedCount) * 100) : null;

  return {
    total: employees.length,
    counts,
    departmentBreakdown,
    avgTenure,
    probationPassRate,
    probationDecided,
    checklistCompletionRate,
    checklistTrackedCount,
    endingSoon,
    incompleteChecklists,
    upcomingMilestones,
  };
}

function daysToYearsMonths(days) {
  const years = Math.floor(days / 365);
  const months = Math.round(((days % 365) / 365) * 12);
  return { years, months };
}
