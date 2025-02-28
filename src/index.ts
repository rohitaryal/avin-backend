import { Hono } from 'hono/tiny';
import { cors } from 'hono/cors';
import chatRouter from './routes/chat';
import imageRouter from './routes/image';

const app = new Hono();

app.use(cors());

app.get("/", (c) => {
  return c.text("There's nothing but walls");
})

app.route("/chat/", chatRouter);
app.route("/image/", imageRouter);

export default app;
