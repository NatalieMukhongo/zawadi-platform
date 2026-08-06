import { useState } from "react";
import { updateUserProfile } from "../../lib/studentDashboardApi";

export default function ProfileCard({ uid, profile, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await updateUserProfile(uid, { displayName, bio });
      onSaved({ displayName, bio });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 border-l-4 border-l-orange-500 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-green-800">Profile</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-gray-600 underline"
          >
            Edit
          </button>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-500">{profile?.email}</p>

      {editing ? (
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Bio</span>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A little about you"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-lg px-4 py-2 text-sm text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <p className="font-semibold text-gray-900">
            {profile?.displayName || "No name set"}
          </p>
          <p className="mt-1 text-sm text-gray-600">{profile?.bio || "No bio yet."}</p>
        </div>
      )}
    </section>
  );
}
