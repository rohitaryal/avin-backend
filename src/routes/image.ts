import { Hono } from "hono/tiny";
import { env } from "hono/adapter";
import generateImage from "imagefx-api";

const imageRouter = new Hono();

imageRouter.get("/", async (c) => {
  const prompt = c.req.query("prompt");

  if (!prompt) {
    return c.text("You forgot to provide prompt");
  }
  const { AUTH } = env<{ AUTH: string }>(c);

  if (!AUTH) {
    return c.text("Did you provide your authentication keys?");
  }

  return c.json(await generateImage(
    {
      prompt,
      imageCount: 1,
      authorization: AUTH,
      seed: null
    }
  ));
});

export default imageRouter;
