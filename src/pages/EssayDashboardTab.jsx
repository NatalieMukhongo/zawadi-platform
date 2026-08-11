import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import YoutubeEmbed from "../components/essays/YoutubeEmbed";
import { DIAGNOSTIC_ESSAY_ID, getEssay } from "../lib/essaysApi";

const FEATURED_VIDEO_ID = "PEzrgFCaoXM";
const FEATURED_VIDEO_TITLE = "How to Write Outstanding College Essays (BigFuture x Khan Academy)";

export default function EssayDashboardTab() {
  const { currentUser } = useAuth();
  const [diagnostic, setDiagnostic] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getEssay(currentUser.uid, DIAGNOSTIC_ESSAY_ID)
      .then(setDiagnostic)
      .catch((err) => setError(err.message));
  }, [currentUser.uid]);

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 border-l-4 border-l-orange-500 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-green-800">Diagnostic Essay</h2>
          <p className="mt-2 text-sm text-gray-600">
            Before diving into your applications, write a short diagnostic essay so your mentor can get a baseline
            sense of your writing.
          </p>
          <Link
            to={`/essays/${DIAGNOSTIC_ESSAY_ID}`}
            className="mt-3 inline-block text-sm font-semibold text-green-800 underline"
          >
            {diagnostic ? "Continue diagnostic essay" : "Start diagnostic essay"}
          </Link>
        </section>

        <section className="rounded-2xl border border-gray-200 border-l-4 border-l-green-600 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-green-800">Show/Tell Activity</h2>
          <Link to="/essays/show-tell" className="mt-2 block text-sm font-semibold text-green-800 underline">
            Do a short show/tell exercise.
          </Link>
        </section>
      </div>

      <section>
        <h2 className="text-center text-lg font-bold text-green-800">Featured Video</h2>
        <div className="mx-auto mt-3 max-w-xl">
          <YoutubeEmbed videoId={FEATURED_VIDEO_ID} title={FEATURED_VIDEO_TITLE} />
        </div>
      </section>
    </div>
  );
}
