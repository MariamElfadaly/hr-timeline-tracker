import { calendarDiff } from "./dateUtils";
import { deriveStatus, getProbationInfo } from "./employeeStatus";

export function formatTenure(joiningDate, t) {
  const diff = calendarDiff(joiningDate, new Date());
  const parts = [];
  if (diff.years > 0) parts.push(`${diff.years} ${diff.years === 1 ? t("year") : t("years")}`);
  if (diff.months > 0) parts.push(`${diff.months} ${diff.months === 1 ? t("month") : t("months")}`);
  if (diff.years === 0 && diff.months === 0) {
    parts.push(`${diff.days} ${diff.days === 1 ? t("day") : t("days")}`);
  }
  return parts.join(" ") || `0 ${t("days")}`;
}

export function buildNarrative(employee, t) {
  const status = deriveStatus(employee);
  const tenure = formatTenure(employee.joiningDate, t);
  const decision = employee.probation?.decision;

  if (status === "probation") {
    const p = getProbationInfo(employee);
    const decisionNote =
      decision?.type === "review_scheduled"
        ? t("printNarrativeReviewScheduled", { date: decision.reviewDate })
        : t("printNarrativeNoDecision");
    return t("printNarrativeProbation", {
      name: employee.name,
      tenure,
      completed: p.daysCompleted,
      total: p.totalDays,
      remaining: p.daysRemaining,
      endDate: employee.probation.endDate,
      decisionNote,
    });
  }

  if (status === "active") {
    const confirmedDate = employee.confirmation?.confirmedDate || "—";
    return t("printNarrativeActive", { name: employee.name, tenure, confirmedDate });
  }

  if (status === "action_required") {
    if (decision?.type === "review_scheduled") {
      return t("printNarrativeReviewScheduledFull", { name: employee.name, date: decision.reviewDate });
    }
    return t("printNarrativeActionRequired", {
      name: employee.name,
      endDate: employee.probation?.endDate || "—",
    });
  }

  if (status === "ended") {
    let text = t("printNarrativeEnded", { name: employee.name, tenure, endDate: decision?.date || "—" });
    if (decision?.reason) text += " " + t("printNarrativeEndedReason", { reason: decision.reason });
    return text;
  }

  return "";
}

export function checklistRows(checklist, t) {
  if (!checklist) return [];

  const status = (done, notRequired) =>
    notRequired ? t("printStatusNotRequired") : done ? t("printStatusDone") : t("printStatusPending");

  return [
    {
      item: t("employeeIdItem"),
      status: status(checklist.idIssued, false),
      detail: checklist.idIssued ? [checklist.idNumber, checklist.idIssueDate].filter(Boolean).join(" · ") : "—",
    },
    {
      item: t("uniform"),
      status: status(checklist.uniformProvided, !checklist.uniformRequired),
      detail:
        checklist.uniformRequired && checklist.uniformProvided
          ? [checklist.uniformType, checklist.uniformDate].filter(Boolean).join(" · ")
          : "—",
    },
    {
      item: t("locker"),
      status: status(checklist.lockerAssigned, !checklist.lockerRequired),
      detail:
        checklist.lockerRequired && checklist.lockerAssigned
          ? [checklist.lockerNumber, checklist.lockerDate].filter(Boolean).join(" · ")
          : "—",
    },
    {
      item: t("payrollCard"),
      status: status(checklist.payrollCardIssued, false),
      detail: checklist.payrollCardIssued ? checklist.payrollCardDate || "—" : "—",
    },
    {
      item: t("empFile"),
      status: status(checklist.empFileCompleted, false),
      detail: checklist.empFileCompleted ? checklist.empFileDate || "—" : "—",
    },
  ];
}
