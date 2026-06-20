import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const nav = useNavigate();
  const [nomeArte, setNomeArte] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome_arte: nomeArte || email.split("@")[0] } },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      nav("/dashboard", { replace: true });
    } else {
      setInfo("Ti abbiamo inviato un'email di conferma. Controlla la posta per attivare l'account.");
    }
  }

  return (
    <AuthShell title="Crea il tuo spazio" subtitle="Pubblica la tua musica su OpenStage.">
      {info ? (
        <p className="rounded-xl bg-accent/15 p-4 text-sm text-accent-soft">{info}</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Nome d'arte</label>
            <input
              className="input"
              value={nomeArte}
              onChange={(e) => setNomeArte(e.target.value)}
              placeholder="Es. Marta Lo Russo"
              required
            />
          </div>
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
              minLength={6}
              required
            />
          </div>
          {error && <p className="text-sm text-like">{error}</p>}
          <button className="btn-primary w-full py-3" disabled={busy}>
            {busy ? "Creazione…" : "Crea account"}
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-dim">
        Hai già un account?{" "}
        <Link to="/login" className="font-semibold text-accent-soft">
          Accedi
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card p-7">
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="mb-6 mt-1 text-sm text-dim">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
