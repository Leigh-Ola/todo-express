import { Request, Response } from 'express';
import { HttpStatusCode } from "../utils/errorCodes"

function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
): void {
  // wahala
  console.error(err);
  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error.' });
}

export default errorHandler;
