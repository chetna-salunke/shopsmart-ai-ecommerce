import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icons";
import Logo from "../components/Logo";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function Login() {
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get("tab") === "signup" ? "signup" : "login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const signupMode = mode === "signup";
  const dest = location.state?.from || "/";

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setErrors({ ...errors, [k]: undefined }); };
  const finish = (fn) => { setBusy(true); setTimeout(() => { fn(); navigate(dest, { replace: true }); }, 700); };

  function submit(e) {
    e.preventDefault();
    const er = {};
    if (signupMode && form.name.trim().length < 2) er.name = "Enter your full name";
    if (!EMAIL_RE.test(form.email)) er.email = "Enter a valid email address";
    if (form.password.length < 6) er.password = "Password must be at least 6 characters";
    setErrors(er);
    if (Object.keys(er).length) return;
    finish(() => (signupMode ? signup(form.name, form.email) : login(form.email)));
  }

  return (
    <div className="container section auth-wrap">
      <div className="auth">
        <aside className="auth-side">
          <Logo light />
          <h2>{signupMode ? "Join ShopSmart" : "Welcome back"}</h2>
          <p>{signupMode ? "Create an account to keep your cart and check out faster." : "Log in to pick up where you left off."}</p>
          <ul>
            <li><Icon name="cart" size={18} /> Your cart stays saved</li>
            <li><Icon name="lock" size={18} /> Quick and secure checkout</li>
            <li><Icon name="sparkles" size={18} /> AI help on every product</li>
          </ul>
        </aside>

        <section className="auth-card">
          <div className="auth-tabs" role="tablist">
            <button role="tab" aria-selected={!signupMode} className={!signupMode ? "on" : ""} onClick={() => { setMode("login"); setErrors({}); }}>Log in</button>
            <button role="tab" aria-selected={signupMode} className={signupMode ? "on" : ""} onClick={() => { setMode("signup"); setErrors({}); }}>Sign up</button>
          </div>

          <button type="button" className="google-btn" disabled={busy} onClick={() => finish(loginWithGoogle)}>
            <GoogleG /> Continue with Google
          </button>
          <div className="or"><span>or use your email</span></div>

          <form onSubmit={submit} noValidate>
            {signupMode && (
              <label className="field">Full name
                <input value={form.name} onChange={set("name")} autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} />
                {errors.name && <small className="err">{errors.name}</small>}
              </label>
            )}
            <label className="field">Email
              <input type="email" value={form.email} onChange={set("email")} autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} />
              {errors.email && <small className="err">{errors.email}</small>}
            </label>
            <label className="field">Password
              <span className="pw">
                <input type={show ? "text" : "password"} value={form.password} onChange={set("password")} autoComplete={signupMode ? "new-password" : "current-password"} placeholder="At least 6 characters" aria-invalid={!!errors.password} />
                <button type="button" className="link" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
              </span>
              {errors.password && <small className="err">{errors.password}</small>}
            </label>
            {!signupMode && <div className="auth-row"><label className="check"><input type="checkbox" defaultChecked /> Remember me</label><button type="button" className="link">Forgot password?</button></div>}
            <button className="btn big full" disabled={busy}>{busy ? "Please wait..." : signupMode ? "Create account" : "Log in"}</button>
          </form>

          <p className="auth-switch">
            {signupMode ? "Already have an account?" : "New to ShopSmart?"}{" "}
            <button className="link" onClick={() => { setMode(signupMode ? "login" : "signup"); setErrors({}); }}>{signupMode ? "Log in" : "Create an account"}</button>
          </p>
          <p className="demo-note"><Icon name="shield" size={14} /> Demo sign-in: no real account is created. Any valid email and password will work.</p>
        </section>
      </div>
    </div>
  );
}
