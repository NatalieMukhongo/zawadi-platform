import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border border-white/40 bg-white/10 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/20"
    >
      Logout
    </button>
  );
}
