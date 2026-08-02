import { toDate, toISODate, todayISO, upcomingAnniversaries } from "./dateUtils";

/**
 * Builds a single, chronologically sorted list of everything that has
 * happened, is happening, or is coming up for an employee. This feeds the
 * visual Employee Timeline — the signature feature of the app alongside
 * the counter.
 */
export function buildTimelineEvents(employee, t) {
  const today = todayISO();
  const events = [];

  function add(dateISO, label, category) {
    if (!dateISO) return;
    events.push({
      dateISO,
      label,
      category,
      status: dateISO < today ? "past" : dateISO === today ? "today" : "future",
    });
  }

  add(employee.joiningDate, t("timelineJoined"), "joining");

  if (employee.probation) {
    add(employee.probation.startDate, t("timelineProbationStart"), "probation");

    const decision = employee.probation.decision;
    const confirmedDate = employee.confirmation?.confirmedDate;

    if (confirmedDate) {
      add(confirmedDate, t("timelineConfirmed"), "confirmed");
    }

    if (decision?.type === "ended") {
      add(decision.date, t("timelineEnded"), "ended");
    } else if (!confirmedDate) {
      add(employee.probation.endDate, t("timelineProbationEnd"), "probation");
    }

    (employee.probation.history || []).forEach((h) => {
      add(h.date, t("timelineExtended", { date: h.newEndDate }), "probation");
    });

    if (decision?.type === "review_scheduled" && decision.reviewDate) {
      add(decision.reviewDate, t("timelineReviewScheduled"), "probation");
    }
  }

  if (employee.upcomingReview) {
    add(employee.upcomingReview.date, t("timelineScheduledReview"), "custom");
  }

  if (employee.checklist) {
    add(employee.checklist.idIssueDate, t("timelineIdIssued"), "checklist");
    if (employee.checklist.uniformProvided) {
      add(employee.checklist.uniformDate, t("timelineUniformProvided"), "checklist");
    }
    if (employee.checklist.lockerAssigned) {
      add(employee.checklist.lockerDate, t("timelineLockerAssigned"), "checklist");
    }
    if (employee.checklist.payrollCardIssued) {
      add(employee.checklist.payrollCardDate, t("timelinePayrollCard"), "checklist");
    }
    if (employee.checklist.empFileCompleted) {
      add(employee.checklist.empFileDate, t("timelineEmpFile"), "checklist");
    }
  }

  upcomingAnniversaries(employee.joiningDate, new Date(), 5).forEach((m) => {
    const dateISO = toISODate(toDate(m.date));
    const label =
      m.label === "3_months" || m.label === "6_months"
        ? t(`timeline_${m.label}`)
        : t("timelineYearAnniversary", { years: m.label.split("_")[0] });
    add(dateISO, label, "anniversary");
  });

  (employee.milestones || []).forEach((m) => {
    const label = m.type === "other" ? m.customLabel : t(`milestoneType_${m.type}`);
    add(m.date, label, "custom");
  });

  events.sort((a, b) => (a.dateISO < b.dateISO ? -1 : a.dateISO > b.dateISO ? 1 : 0));
  return events;
}
