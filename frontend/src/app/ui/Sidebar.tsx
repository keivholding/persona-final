import { NavLink } from "react-router-dom";
import { HomeIcon, UserIcon, LayersIcon, ShieldIcon, EyeIcon, CogIcon, LogoutIcon } from "./icons";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-indigo-600 text-white"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  }`;

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 shrink-0 bg-slate-900 p-4 text-slate-100 md:block">
      <div className="mb-6 flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-indigo-600 text-white">
          <span className="text-lg font-bold">π</span>
        </div>
        <span className="text-xl font-semibold">Persona.io</span>
      </div>
      <nav className="space-y-1">
        <NavLink to="/dashboard" className={navLinkClass}>
          <HomeIcon />
          <span>Dashboard</span>
        </NavLink>
        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400">
          <UserIcon />
          <span>My Profile</span>
        </div>
        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400">
          <LayersIcon />
          <span>Contexts</span>
        </div>
        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400">
          <ShieldIcon />
          <span>Privacy Matrix</span>
        </div>
        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400">
          <EyeIcon />
          <span>Requests</span>
        </div>
        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400">
          <EyeIcon />
          <span>Preview</span>
        </div>
      </nav>
      <div className="mt-8 space-y-2">
        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400">
          <CogIcon />
          <span>Settings</span>
        </div>
        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400">
          <LogoutIcon />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

