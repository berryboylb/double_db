import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import limiter from "./middleware/ratelimiter";
import routes from "./routes";
import { logger, errorResponder, invalidPathHandler } from "./middleware";

dotenv.config();
const port = process.env.PORT || 8000;
const app: Express = express();
app.use(cors());
app.use(express.json({ extended: false } as any));
app.use(limiter());
app.use(logger);

//these are our routes
app.use("/api/v1", routes);
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from express + ts");
});

app.use(errorResponder);
app.use(invalidPathHandler);

if (!module.parent) {
  const server = app.listen(port, () => {
    console.log(`now listening on port ${port}`);
  });

  process.on("SIGTERM", () => {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
}

export default app;
