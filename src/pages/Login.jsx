import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const { t, toggleLang, lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
    } catch {
      setError(t("loginError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login">
      <button className="login__lang" onClick={toggleLang} type="button">
        {lang === "ar" ? "EN" : "AR"}
      </button>

      <div className="login__card">
        <div className="login__mark">
          <span className="login__mark-dot" />
        </div>
        <h1 className="login__title">{t("appName")}</h1>

        <form onSubmit={handleSubmit} className="login__form">
          <label className="field">
            <span className="field__label">{t("email")}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span className="field__label">{t("password")}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          {error && <div className="login__error">{error}</div>}

          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? "…" : t("signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}
