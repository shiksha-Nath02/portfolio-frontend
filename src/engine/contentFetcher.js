const GITHUB_USERNAME = "shiksha-Nath02";

export async function fetchProjectIndex() {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github.mercy-preview+json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch GitHub repositories");
  }

  const repos = await res.json();

  // filter repos that contain topic "portfolio"
  const portfolioRepos = repos.filter((repo) =>
    repo.topics.includes("portfolio")
  );

 const projects = portfolioRepos.map((repo) => ({
  slug: repo.name,
  title: repo.name.replace(/-/g, " "),
  tagline: repo.description || "No description provided",
  status: "active",
  stars: repo.stargazers_count,
  language: repo.language,
  repoUrl: repo.html_url,
  liveUrl: repo.homepage || null
}));

  return { projects };
}