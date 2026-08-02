import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { calcProbationEnd } from "./dateUtils";

function employeesCol(userId) {
  return collection(db, "users", userId, "employees");
}

function employeeDoc(userId, employeeId) {
  return doc(db, "users", userId, "employees", employeeId);
}

/** Live-subscribe to the employer's employee list, newest joiners first. */
export function subscribeToEmployees(userId, onChange, onError) {
  const q = query(employeesCol(userId), orderBy("joiningDate", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onChange(list);
    },
    onError
  );
}

export async function getEmployee(userId, employeeId) {
  const snap = await getDoc(employeeDoc(userId, employeeId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Create a new employee record.
 * input: { name, employeeId, jobTitle, joiningDate (ISO), phoneNumber,
 *          probationType, probationCustomEndDate, department, email, manager }
 */
export async function createEmployee(userId, input) {
  const probationEnd = calcProbationEnd(input.joiningDate, {
    type: input.probationType,
    customEndDate: input.probationCustomEndDate,
  });

  const record = {
    name: input.name.trim(),
    employeeId: input.employeeId.trim(),
    jobTitle: input.jobTitle.trim(),
    joiningDate: input.joiningDate,
    phoneNumber: input.phoneNumber.trim(),
    department: input.department?.trim() || null,
    email: input.email?.trim() || null,
    manager: input.manager?.trim() || null,

    status: "probation",

    probation: {
      type: input.probationType,
      startDate: input.joiningDate,
      endDate: probationEnd.toISOString().slice(0, 10),
      decision: null,
    },

    confirmation: null,
    checklist: null,
    milestones: [],

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(employeesCol(userId), record);
  return ref.id;
}

export async function deleteEmployee(userId, employeeId) {
  await deleteDoc(employeeDoc(userId, employeeId));
}

export async function updateEmployee(userId, employeeId, patch) {
  await updateDoc(employeeDoc(userId, employeeId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

const DEFAULT_CHECKLIST = {
  idIssued: false,
  idNumber: "",
  idIssueDate: null,

  uniformRequired: false,
  uniformProvided: false,
  uniformType: "",
  uniformQuantity: "",
  uniformSize: "",
  uniformDate: null,

  lockerRequired: false,
  lockerAssigned: false,
  lockerNumber: "",
  lockerDate: null,

  payrollCardIssued: false,
  payrollCardDate: null,
  empFileCompleted: false,
  empFileDate: null,
};

export async function confirmEmployee(userId, employeeId, confirmDate) {
  await updateEmployee(userId, employeeId, {
    status: "active",
    "probation.decision": { type: "confirmed", date: confirmDate },
    confirmation: { confirmedDate: confirmDate },
    checklist: DEFAULT_CHECKLIST,
  });
}

export async function extendProbation(userId, employeeId, newEndDateISO, note, todayDate) {
  const emp = await getEmployee(userId, employeeId);
  const history = emp?.probation?.history || [];
  await updateEmployee(userId, employeeId, {
    status: "probation",
    "probation.endDate": newEndDateISO,
    "probation.decision": null,
    "probation.history": [
      ...history,
      { type: "extended", date: todayDate, newEndDate: newEndDateISO, note: note || null },
    ],
  });
}

export async function endEmployment(userId, employeeId, endDate, reason) {
  await updateEmployee(userId, employeeId, {
    status: "ended",
    "probation.decision": { type: "ended", date: endDate, reason: reason || null },
  });
}

export async function scheduleReview(userId, employeeId, reviewDateISO, note, todayDate) {
  await updateEmployee(userId, employeeId, {
    status: "action_required",
    "probation.decision": {
      type: "review_scheduled",
      date: todayDate,
      reviewDate: reviewDateISO,
      note: note || null,
    },
  });
}

export async function updateChecklist(userId, employeeId, checklistPatch) {
  const emp = await getEmployee(userId, employeeId);
  const merged = { ...DEFAULT_CHECKLIST, ...(emp?.checklist || {}), ...checklistPatch };
  await updateEmployee(userId, employeeId, { checklist: merged });
}

function makeId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * input: { type, customLabel, date (ISO), reminderOffsets: number[], note }
 */
export async function addMilestone(userId, employeeId, input) {
  const emp = await getEmployee(userId, employeeId);
  const milestones = emp?.milestones || [];
  const milestone = {
    id: makeId(),
    type: input.type,
    customLabel: input.type === "other" ? input.customLabel?.trim() || "" : "",
    date: input.date,
    reminderOffsets: input.reminderOffsets || [30, 14, 7, 1, 0],
    note: input.note?.trim() || null,
    createdAt: new Date().toISOString(),
  };
  await updateEmployee(userId, employeeId, { milestones: [...milestones, milestone] });
  return milestone.id;
}

export async function deleteMilestone(userId, employeeId, milestoneId) {
  const emp = await getEmployee(userId, employeeId);
  const milestones = (emp?.milestones || []).filter((m) => m.id !== milestoneId);
  await updateEmployee(userId, employeeId, { milestones });
}

export async function addNoteEntry(userId, employeeId, text) {
  const emp = await getEmployee(userId, employeeId);
  const notesLog = emp?.notesLog || [];
  const entry = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };
  await updateEmployee(userId, employeeId, { notesLog: [entry, ...notesLog] });
}

export async function deleteNoteEntry(userId, employeeId, noteId) {
  const emp = await getEmployee(userId, employeeId);
  const notesLog = (emp?.notesLog || []).filter((n) => n.id !== noteId);
  await updateEmployee(userId, employeeId, { notesLog });
}

/**
 * Editable core info fields — deliberately excludes joiningDate and
 * probation, since those drive dates/history tracked elsewhere and are
 * safer to change only through the dedicated probation actions.
 */
export async function updateEmployeeInfo(userId, employeeId, input) {
  await updateEmployee(userId, employeeId, {
    name: input.name.trim(),
    employeeId: input.employeeId.trim(),
    jobTitle: input.jobTitle.trim(),
    phoneNumber: input.phoneNumber.trim(),
    department: input.department?.trim() || null,
    email: input.email?.trim() || null,
    manager: input.manager?.trim() || null,
  });
}

/**
 * Review scheduling for an ACTIVE (already confirmed) employee — distinct
 * from probation's review_scheduled decision. Doesn't touch status; it's
 * just a dated note that shows on the timeline and reminders.
 */
export async function scheduleActiveReview(userId, employeeId, dateISO, note) {
  await updateEmployee(userId, employeeId, {
    upcomingReview: { date: dateISO, note: note || null, createdAt: new Date().toISOString() },
  });
}

export async function clearActiveReview(userId, employeeId) {
  await updateEmployee(userId, employeeId, { upcomingReview: null });
}

/** Reminder "delete" — permanently removes it from the list. */
export async function deleteReminder(userId, employeeId, reminderId) {
  await updateEmployee(userId, employeeId, {
    [`dismissedReminders.${reminderId}`]: true,
  });
}

/** Reminder "check" — marks as done but keeps it visible, struck through. */
export async function toggleReminderChecked(userId, employeeId, reminderId, checked) {
  await updateEmployee(userId, employeeId, {
    [`checkedReminders.${reminderId}`]: checked,
  });
}
