import { useLanguage } from "../contexts/LanguageContext";
import "./StatusBadge.css";

const STATUS_MAP = {
  active: { key: "statusActive", tone: "teal" },
  probation: { key: "statusProbation", tone: "brass" },
  action_required: { key: "statusActionRequired", tone: "red" },
  ended: { key: "statusEnded", tone: "muted" },
};

export default function StatusBadge({ status }) {
  const { t } = useLanguage();
  const meta = STATUS_MAP[status] || STATUS_MAP.active;
  return <span className={`badge badge--${meta.tone}`}>{t(meta.key)}</span>;
}
