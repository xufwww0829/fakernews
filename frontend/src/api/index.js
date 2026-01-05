// Elysia-like API mock for frontend development
const API_BASE = "/api";

// --- MOCK DATA ---
const users = ["alice", "bob", "charlie", "diana", "eliza", "frank"];
const storyTitles = [
  "The Future of AI in Software Development",
  "Modern Frontend Frameworks: A 2025 Comparison",
  "Why Elysia.js is Gaining Traction",
  "A Deep Dive into Bun's Performance",
  "Building Scalable Systems with Micro-frontends",
  "State Management in Vue: Pinia vs. Vuex",
];

const generateMockComment = (id, storyId, depth = 0, maxDepth = 2, maxChildren = 3) => {
  const hasChildren = depth < maxDepth && Math.random() > 0.4;
  const numChildren = hasChildren ? Math.floor(Math.random() * maxChildren) + 1 : 0;
  
  const comment = {
    id: `c${id}`,
    story: storyId,
    parent: storyId, // Simplified for mock
    by: users[id % users.length],
    time: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 200000),
    text: `This is a mock comment (ID: ${id}, Depth: ${depth}). What are your thoughts on this? I think it's quite interesting. The quick brown fox jumps over the lazy dog.`,
    children: [],
  };

  if (hasChildren) {
    for (let i = 0; i < numChildren; i++) {
      // Create a unique-ish ID for children
      const childId = `${id}-${i}`; 
      comment.children.push(generateMockComment(childId, storyId, depth + 1, maxDepth));
    }
  }

  return comment;
};

const generateMockStory = (id, type) => ({
  id: id,
  title: storyTitles[id % storyTitles.length],
  url: id % 3 !== 0 ? `https://example.com/story/${id}` : null,
  text: id % 3 === 0 ? `This is the text content for story #${id}. It's a self-post, so the content is right here. This allows for discussions directly on the site.` : null,
  score: Math.floor(Math.random() * (300 + id)),
  by: users[id % users.length],
  time: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 3),
  descendants: Math.floor(Math.random() * 50),
  type: "story",
});

const mockStories = (type, count = 30) => {
  return Array.from({ length: count }, (_, i) => generateMockStory(i + 1, type));
};

const mockComments = (storyId, count = 10) => {
  return Array.from({ length: count }, (_, i) => generateMockComment(i + 1, storyId));
};


// --- API SIMULATION ---
const request = async (path, options = {}) => {
  console.log(`[API MOCK] Fetching: ${path}`, options);
  await new Promise(resolve => setTimeout(resolve, 250)); // Simulate network latency

  const storiesRegex = /^\/stories\/(top|new|best|ask|show)/;
  const storyRegex = /^\/story\/(\d+)$/;
  const commentsRegex = /^\/story\/(\d+)\/comments/;
  const userRegex = /^\/user\/(\w+)$/;

  let match;

  if ((match = path.match(storiesRegex))) {
    const type = match[1];
    return mockStories(type);
  }
  if ((match = path.match(storyRegex))) {
    const id = parseInt(match[1], 10);
    const story = generateMockStory(id);
    if (story) return story;
    throw new Error(`Story with ID ${id} not found.`);
  }
  if ((match = path.match(commentsRegex))) {
    const storyId = parseInt(match[1], 10);
    return mockComments(storyId);
  }
  if ((match = path.match(userRegex))) {
    const id = match[1];
    if (users.includes(id)) {
      return {
        id: id,
        created: Math.floor(Date.now() / 1000) - 365 * 86400,
        karma: Math.floor(Math.random() * 10000),
        about: "A software developer passionate about modern web technologies, open source, and building cool things.",
      };
    }
    throw new Error(`User with ID ${id} not found.`);
  }

  // POST requests
  if (options.method === 'POST') {
      const { body } = options;
      if (path === '/story') {
          console.log('Submitting story:', body);
          const newId = Math.floor(Math.random() * 10000);
          return { ...body, id: newId, score: 1, descendants: 0, time: Date.now() / 1000 };
      }
      if (path.match(/\/story\/\d+\/comment/)) {
          console.log('Submitting comment:', body);
          const newId = Math.floor(Math.random() * 100000);
          return { ...body, id: `c${newId}`, time: Date.now() / 1000, children: [] };
      }
  }


  throw new Error(`Unmocked API endpoint: ${path}`);
};

// --- EXPORTED API ---
export const api = {
  getStories: (type = "top", page = 1) => request(`/stories/${type}?page=${page}`),
  getStory: (id) => request(`/story/${id}`),
  getComments: (storyId) => request(`/story/${storyId}/comments`),
  getUser: (id) => request(`/user/${id}`),
  
  submitStory: (title, url, text) => {
    return request('/story', {
      method: 'POST',
      body: { title, url, text },
    });
  },

  submitComment: (storyId, text, parent = null) => {
    return request(`/story/${storyId}/comment`, {
      method: 'POST',
      body: { text, parent },
    });
  },
};
