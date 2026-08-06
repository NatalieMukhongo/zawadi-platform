import { useEffect, useRef, useState } from "react";
import { searchSchools } from "../../lib/collegeScorecard";

export default function SchoolSearchBar({ onSelectSchool, existingScorecardIds }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError("");
      return;
    }

    const timeoutId = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError("");
      try {
        const schools = await searchSchools(query, { signal: controller.signal });
        setResults(schools);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        placeholder="Search for a school by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="mt-2 text-sm text-gray-500">Searching...</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {results.length > 0 && (
        <ul className="mt-2 divide-y divide-gray-100 rounded-lg border border-gray-200">
          {results.map((school) => {
            const alreadyAdded = existingScorecardIds.has(school.scorecardId);
            return (
              <li
                key={school.scorecardId}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span>
                  {school.name}
                  <span className="text-gray-500">
                    {" "}
                    &middot; {school.city}, {school.state}
                  </span>
                </span>
                <button
                  disabled={alreadyAdded}
                  onClick={() => onSelectSchool(school)}
                  className="ml-3 shrink-0 rounded-lg bg-orange-600 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-700 disabled:bg-gray-300"
                >
                  {alreadyAdded ? "Already added" : "Add"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
