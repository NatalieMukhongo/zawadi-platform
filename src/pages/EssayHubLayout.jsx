import { Link, NavLink, Outlet } from "react-router-dom";
import {
  ADDITIONAL_INFO_ESSAY_ID,
  CONTEXT_GAP_ESSAY_ID,
  PERSONAL_STATEMENT_ID,
} from "../lib/essaysApi";

const TABS = [
  { label: "Dashboard", to: "/essays", end: true },
  { label: "Personal Statement", to: `/essays/${PERSONAL_STATEMENT_ID}` },
  { label: "Context/Gap Essay", to: `/essays/${CONTEXT_GAP_ESSAY_ID}` },
  { label: "Supplemental Essay", to: "/essays/supplemental" },
  { label: "Additional Info Essay", to: `/essays/${ADDITIONAL_INFO_ESSAY_ID}` },
  { label: "Resource Drive", to: "/essays/resources" },
];

export default function EssayHubLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/60 via-white to-orange-50/40">
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 px-6 py-4 shadow-md">
        <Link to="/student-dashboard" className="text-sm text-white/80 underline hover:text-white">
          &larr; Back to dashboard
        </Link>
        <h1 className="mt-1 text-center text-2xl font-bold text-white">Essay Hub</h1>
      </div>

      <nav className="flex border-b border-gray-200 bg-white shadow-sm">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex-1 px-3 py-3 text-center text-sm font-semibold ${
                isActive ? "bg-green-100 text-green-800" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
