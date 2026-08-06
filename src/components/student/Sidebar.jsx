import ProfileCard from "./ProfileCard";

export default function Sidebar({ open, onClose, uid, profile, onProfileSaved }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform overflow-y-auto bg-white shadow-xl transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-green-700 to-green-600 px-5 py-4">
          <h2 className="text-lg font-bold text-white">Menu</h2>
          <button onClick={onClose} className="text-sm text-white/90 underline hover:text-white">
            Close
          </button>
        </div>

        <div className="p-5">
          <ProfileCard uid={uid} profile={profile} onSaved={onProfileSaved} />
        </div>
      </aside>
    </>
  );
}
