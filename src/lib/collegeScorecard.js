const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

export async function searchSchools(query, { signal } = {}) {
  const apiKey = import.meta.env.VITE_COLLEGE_SCORECARD_API_KEY;
  if (!apiKey) {
    throw new Error("Search unavailable: missing VITE_COLLEGE_SCORECARD_API_KEY");
  }
  if (!query || !query.trim()) return [];

  const url = new URL(BASE_URL);
  url.searchParams.set("school.name", query.trim());
  url.searchParams.set("fields", "id,school.name,school.city,school.state");
  url.searchParams.set("per_page", "10");
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error(`College Scorecard request failed: ${response.status}`);
  }

  const data = await response.json();
  return (data.results || []).map((result) => ({
    scorecardId: String(result.id),
    name: result["school.name"],
    city: result["school.city"],
    state: result["school.state"],
  }));
}
