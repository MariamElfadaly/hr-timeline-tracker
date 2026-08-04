import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { subscribeToEmployees } from "../lib/employees";
import { deriveStatus } from "../lib/employeeStatus";
import { buildReminders } from "../lib/reminders";
import EmployeeCard from "../components/EmployeeCard";
import PrintDirectory from "../components/PrintDirectory";
import "./EmployeeList.css";

const STATUS_FILTERS = [
  { value: "all", key: "allStatuses" },
  { value: "active", key: "statusActive" },
  { value: "probation", key: "statusProbation" },
  { value: "action_required", key: "statusActionRequired" },
  { value: "ended", key: "statusEnded" },
];

export default function EmployeeList() {
  const { user, logout } = useAuth();
  const { t, toggleLang, lang } = useLanguage();
  const [employees, setEmployees] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToEmployees(
      user.uid,
      (list) => setEmployees(list),
      () => setError(t("genericError"))
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const filtered = useMemo(() => {
    if (!employees) return [];
    return employees.filter((emp) => {
      const status = deriveStatus(emp);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q || emp.name.toLowerCase().includes(q) || emp.jobTitle.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [employees, search, statusFilter]);

  const reminderCount = useMemo(() => {
    if (!employees) return 0;
    return buildReminders(employees, t).length;
  }, [employees, t]);

  const filterLabel = statusFilter !== "all" ? t(STATUS_FILTERS.find((s) => s.value === statusFilter).key) : "";

  return (
    <div className="list-page">
      <header className="list-page__header no-print">
        <h1 className="list-page__title">{t("employees")}</h1>
        <div className="list-page__header-actions">
          <button className="btn btn--ghost" onClick={() => window.print()} type="button">
            {t("print")}
          </button>
          <Link to="/reports" className="btn btn--ghost">
            {t("reports")}
          </Link>
          <Link to="/reminders" className="btn btn--ghost list-page__reminders-btn">
            {t("reminders")}
            {reminderCount > 0 && <span className="list-page__reminders-badge">{reminderCount}</span>}
          </Link>
          <button className="btn btn--ghost" onClick={toggleLang} type="button">
            {lang === "ar" ? "EN" : "AR"}
          </button>
          <button className="btn btn--ghost" onClick={logout} type="button">
            {t("signOut")}
          </button>
        </div>
      </header>

      <div className="list-page__controls no-print">
        <input
          className="list-page__search"
          type="search"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="list-page__filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {t(s.key)}
            </option>
          ))}
        </select>
        <Link to="/employees/new" className="btn btn--primary list-page__add">
          + {t("addEmployee")}
        </Link>
      </div>

      {error && <div className="list-page__error no-print">{error}</div>}

      {employees === null && !error && <div className="list-page__loading no-print">…</div>}

      {employees !== null && employees.length === 0 && (
        <div className="list-page__empty no-print">
          <p className="list-page__empty-title">{t("noEmployees")}</p>
          <p className="list-page__empty-hint">{t("noEmployeesHint")}</p>
          <Link to="/employees/new" className="btn btn--primary">
            + {t("addEmployee")}
          </Link>
        </div>
      )}

      {employees !== null && employees.length > 0 && filtered.length === 0 && (
        <div className="list-page__empty no-print">
          <p className="list-page__empty-title">{t("noResults")}</p>
        </div>
      )}

      <div className="list-page__grid no-print">
        {filtered.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>

      {employees !== null && <PrintDirectory employees={filtered} filterLabel={filterLabel} />}
    </div>
  );
}
