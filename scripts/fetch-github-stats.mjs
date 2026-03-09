import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const repos = ["ssaurabh9/taiga-mcp", "ssaurabh9/firefly-mcp"];
const stats = {};

for (const slug of repos) {
  const res = await fetch(`https://api.github.com/repos/${slug}`, {
    headers: { "User-Agent": "fetch-github-stats" },
  });
  if (!res.ok) {
    console.warn(`[skip] ${slug} — HTTP ${res.status}`);
    continue;
  }
  const data = await res.json();
  const fields = [];
  if (data.stargazers_count != null) fields.push(["stars", data.stargazers_count]);
  if (data.forks_count != null) fields.push(["forks", data.forks_count]);
  if (data.open_issues_count != null) fields.push(["open_issues", data.open_issues_count]);
  if (data.language) fields.push(["language", data.language]);
  if (fields.length === 0 && data.visibility) fields.push(["visibility", data.visibility]);
  if (fields.length > 0) {
    stats[slug] = { fields, ts: Date.now() };
    console.log(`[ok] ${slug} — ${fields.length} fields`);
  }
}

const out = join(__dirname, "../src/data/github-stats.json");
writeFileSync(out, JSON.stringify(stats, null, 2) + "\n");
console.log(`Written → ${out}`);
