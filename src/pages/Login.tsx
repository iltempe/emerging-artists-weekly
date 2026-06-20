import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { AuthShell } from "./Signup";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    nav("/dashboard", { replace: true });
  }

  return (
    <AuthShell title="Bentornato" subtitle="Accedi al tuo studio OpenStage.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-like">{error}</p>}
        <button className="btn-primary w-full py-3" disabled={busy}>
          {busy ? "Accesso…" : "Accedi"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-dim">
        Non hai un account?{" "}
        <Link to="/signup" className="font-semibold text-accent-soft">
          Registrati
        </Link>
      </p>
    </AuthShell>
  );
}
