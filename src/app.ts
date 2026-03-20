import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { StatusCodes } from "http-status-codes";
import globalErrorHandler from "./app/middleware/GlobalErrorHandler";
import logger from "./app/middleware/Logger";
import notFound from "./app/middleware/NotFound";
import routes from "./app/routes";
import sendResponse from "./shared/sendResponse";
import { auth } from "./utils/auth";

const app: Application = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = process.env.FRONTEND_URL?.replace(/\/$/, "");
      if (!origin || origin.replace(/\/$/, "") === allowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(logger);

app.all("/api/auth/*any", toNodeHandler(auth));
app.get("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    data: {
      message: "Server is running",
      author: "Md. Maidul Islam",
      version: "1.0.0",
      host: req.hostname,
      protocol: req.protocol,
      ip: ip,
      time: new Date().toISOString(),
    },
  });
  res.end();
});

app.use("/api", routes);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
