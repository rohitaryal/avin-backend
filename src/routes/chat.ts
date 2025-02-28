import { Hono } from "hono/tiny";

const chatRouter = new Hono();

chatRouter.get("/", (c) => {
  const prompt = c.req.query("prompt") || "I forgot to provide prompt";

  if (!prompt) {
    return c.text("You forgot to provide prompt");
  }

  return c.text(prompt);
});

export default chatRouter;
