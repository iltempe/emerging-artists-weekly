import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-elev/60 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-[#f3f3f6]">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          <span className="text-base font-extrabold tracking-tight">OpenStage</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 font-medium ${isActive ? "text-[#f3f3f6]" : "text-dim hover:text-[#f3f3f6]"}`
            }
          >
            Esplora
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 font-medium ${isActive ? "text-[#f3f3f6]" : "text-dim hover:text-[#f3f3f6]"}`
                }
              >
                Studio
              </NavLink>
              {profile?.slug && (
                <Link
                  to={`/@${profile.slug}`}
                  className="rounded-lg px-3 py-2 font-medium text-dim hover:text-[#f3f3f6]"
                >
                  Profilo
                </Link>
              )}
              <button onClick={signOut} className="btn-ghost ml-1 px-3 py-2">
                Esci
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 font-medium text-dim hover:text-[#f3f3f6]">
                Accedi
              </Link>
              <Link to="/signup" className="btn-primary ml-1 px-3 py-2">
                Pubblica la tua musica
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
