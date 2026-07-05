import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const headerRequestId = req.header('X-Request-Id');
  const cleanedHeaderRequestId = headerRequestId?.trim() || undefined;
  const requestId = cleanedHeaderRequestId ?? randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  next();
}
