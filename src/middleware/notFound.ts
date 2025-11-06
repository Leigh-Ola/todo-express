import { Request, Response } from 'express';
import { HttpStatusCode } from "../utils/errorCodes"

function notFound(req: Request, res: Response): void {
  res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Route not found.' });
}

export default notFound;
