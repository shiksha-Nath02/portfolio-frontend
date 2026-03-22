import { transformOpenApi } from "./openApiTransformer";

const GITHUB_USERNAME = "shiksha-Nath02";

async function safeFetch(url, isJson = false) {
  try {
    const res = await fetch(url);

    if (!res.ok) return null;

    return isJson ? await res.json() : await res.text();
  } catch (err) {
    console.warn("Failed to fetch:", url);
    return null;
  }
}

export async function loadProjectContent(slug) {
  const base = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${slug}/main/docs`;

  const [
    overview,
    challenges,
    lessons,
    timeline,
    architecture,
    api,
    database,
  ] = await Promise.all([
    safeFetch(`${base}/overview.md`),
    safeFetch(`${base}/challenges.md`),
    safeFetch(`${base}/retrospective.md`),
    safeFetch(`${base}/timeline.json`, true),
    safeFetch(`${base}/architecture.json`, true),
    safeFetch(`${base}/api.json`, true),
    safeFetch(`${base}/database.json`, true),
  ]);

  const transformedApi = api?.openapi ? transformOpenApi(api) : api;

  return {
    markdown: {
      overview,
      challenges,
      lessons,
    },
    json: {
      timeline,
      architecture,
      api: transformedApi,
      database,
    },
  };
}