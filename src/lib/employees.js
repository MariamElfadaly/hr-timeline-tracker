import {
  collection,
  doc,
  addDoc,
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

export async function updateEmployee(userId, employeeId, patch) {
  await updateDoc(employeeDoc(userId, employeeId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}
