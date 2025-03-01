import { Hono } from 'hono/tiny';
import { env } from 'hono/adapter';
import generateImage from 'imagefx-api';

const imageRouter = new Hono();

imageRouter.get("/", async (c) => {
  const prompt = c.req.query("prompt");
  const { AUTH } = env<{ AUTH: string }>(c);

  if (!prompt) {
    return c.text("Please provide a prompt query parameter.");
  }

  if (!AUTH) {
    return c.text("Environment variable AUTH is not set.");
  }

  try {
    const image = await generateImage({
      prompt,
      seed: null,
      imageCount: 1,
      authorization: AUTH,
    });

    return c.json(image);
  } catch {
    return c.text("An error occured while generating the image.");
  }
});

export default imageRouter