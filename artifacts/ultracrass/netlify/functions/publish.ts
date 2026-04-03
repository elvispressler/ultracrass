import type { Handler } from "@netlify/functions";

interface PostLink {
  url: string;
  label?: string;
}

interface PublishBody {
  action?: "publish" | "delete" | "update";
  title?: string;
  category?: string;
  content?: string;
  date?: string;
  id?: string;
  links?: PostLink[];
}

interface GithubFileResponse {
  sha: string;
  content: string;
}

const GITHUB_API = "https://api.github.com";
const FILE_PATH = "artifacts/ultracrass/src/data/posts.json";

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

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
    "User-Agent": "ultracrass-publish",
  };

  const getRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}`, { headers });
  if (!getRes.ok) {
    return { statusCode: 500, body: `GitHub GET failed: ${getRes.status} ${await getRes.text()}` };
  }
  const fileData = (await getRes.json()) as GithubFileResponse;
  const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");

  let posts: Record<string, unknown>[] = [];
  try {
    posts = JSON.parse(currentContent);
  } catch {
    posts = [];
  }

  const action = body.action ?? "publish";

  if (action === "delete") {
    if (!body.id) return { statusCode: 400, body: "id is required for delete" };
    const before = posts.length;
    posts = posts.filter((p) => p.id !== body.id);
    if (posts.length === before) return { statusCode: 404, body: "Post not found" };

    const updatedContent = Buffer.from(JSON.stringify(posts, null, 2)).toString("base64");
    const putRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ message: `delete: ${body.id}`, content: updatedContent, sha: fileData.sha }),
    });
    if (!putRes.ok) return { statusCode: 500, body: `GitHub PUT failed: ${putRes.status} ${await putRes.text()}` };
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
  }

  if (action === "update") {
    if (!body.id || !body.title || !body.content || !body.category) {
      return { statusCode: 400, body: "id, title, category and content are required for update" };
    }
    const idx = posts.findIndex((p) => p.id === body.id);
    if (idx === -1) return { statusCode: 404, body: "Post not found" };

    const postDate = body.date ? new Date(body.date).toISOString() : (posts[idx].date as string);
    posts[idx] = {
      ...posts[idx],
      title: body.title.trim(),
      category: body.category,
      content: body.content.trim(),
      date: postDate,
      ...(body.links?.length ? { links: body.links } : { links: undefined }),
    };

    const updatedContent = Buffer.from(JSON.stringify(posts, null, 2)).toString("base64");
    const putRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `edit: ${body.title.slice(0, 60)}`,
        content: updatedContent,
        sha: fileData.sha,
      }),
    });
    if (!putRes.ok) return { statusCode: 500, body: `GitHub PUT failed: ${putRes.status} ${await putRes.text()}` };
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
  }

  // action === "publish"
  if (!body.title || !body.content || !body.category) {
    return { statusCode: 400, body: "title, category and content are required" };
  }

  const postDate = body.date ? new Date(body.date).toISOString() : new Date().toISOString();
  const id = `${postDate.slice(0, 10)}-${Date.now()}`;

  const newPost: Record<string, unknown> = {
    id,
    title: body.title.trim(),
    category: body.category,
    content: body.content.trim(),
    date: postDate,
    ...(body.links?.length ? { links: body.links } : {}),
  };

  const updatedPosts = [newPost, ...posts];
  const updatedContent = Buffer.from(JSON.stringify(updatedPosts, null, 2)).toString("base64");

  const putRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}`, {
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
