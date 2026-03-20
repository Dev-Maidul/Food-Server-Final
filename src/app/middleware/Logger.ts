import { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  console.log(
    `[REQUEST] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`
  );
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[RESPONSE] ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${duration}ms`
    );
  });

  next();
};

export default logger;
