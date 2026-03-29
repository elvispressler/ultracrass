import type { Handler } from "@netlify/functions";

interface PublishBody {
  title: string;
  category: string;
  content: string;
}

interface GithubFileResponse {
  sha: string;
  content: string;
}

const GITHUB_API = "https://api.github.com";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    return {
      statusCode: 500,
      body: "Server configuration incomplete (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO required)",
    };
  }

  let body: PublishBody;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  if (!body.title || !body.content || !body.category) {
    return { statusCode: 400, body: "title, category and content are required" };
  }

  const filePath = "artifacts/ultracrass/src/data/posts.json";
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
    "User-Agent": "ultracrass-publish",
  };

  const getRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, { headers });
  if (!getRes.ok) {
    return { statusCode: 500, body: `GitHub GET failed: ${getRes.status} ${await getRes.text()}` };
  }
  const fileData = (await getRes.json()) as GithubFileResponse;
  const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");

  let posts: object[] = [];
  try {
    posts = JSON.parse(currentContent);
  } catch {
    posts = [];
  }

  const now = new Date().toISOString();
  const id = `${now.slice(0, 10)}-${Date.now()}`;

  const newPost = {
    id,
    title: body.title.trim(),
    category: body.category,
    content: body.content.trim(),
    date: now,
  };

  const updatedPosts = [newPost, ...posts];
  const updatedContent = Buffer.from(JSON.stringify(updatedPosts, null, 2)).toString("base64");

  const putRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `post: ${body.title.slice(0, 60)}`,
      content: updatedContent,
      sha: fileData.sha,
    }),
  });

  if (!putRes.ok) {
    return { statusCode: 500, body: `GitHub PUT failed: ${putRes.status} ${await putRes.text()}` };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, id }),
  };
};
