import { Hono } from "hono";
import { streamSSE, streamText } from "hono/streaming";

export interface Env {
  ai: Ai;
}

const chatRouter = new Hono<{ Bindings: CloudflareBindings }>();

chatRouter.post("/", async (c) => {
  // URL must contain 'prompt' query
  const prompt = c.req.query("prompt");
  if (!prompt)
    return c.text("Please provide a prompt query parameter.");


  // Get message history from the request body
  let messageHistory: string[] = [];
  try {
    messageHistory = JSON.parse(await c.req.text());
  } catch {
    return c.text("Message history is not a valid JSON array.");
  }

  // Map each history array to corresponding role and content
  const parsedMessages = messageHistory.map((message, index) => {
    return {
      content: message,
      role: index % 2 == 0 ? "user" : "system",
    };
  });


  // Add the user's prompt to the end of parsed messages
  parsedMessages.push({
    content: prompt,
    role: "user",
  });


  // Stream model response
  const modelResponseStream = await (c.env as Env).ai.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: parsedMessages,
    stream: true,
  });


  // Issue according to docs: https://hono.dev/docs/helpers/streaming#streamtext
  c.header('Content-Encoding', 'Identity'); // Disable compression
  return streamText(c, (stream) => stream.pipe(modelResponseStream));
});

export default chatRouter;
