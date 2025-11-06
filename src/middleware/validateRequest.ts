import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../utils/errorCodes';

export function validateBody<T extends object>(
  DtoClass: ClassConstructor<T>
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToInstance(DtoClass, req.body || {}, {
      exposeDefaultValues: true,
    });

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      const details = errors.map((error: ValidationError) => ({
        property: error.property,
        constraints: error.constraints,
      }));

      res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Validation failed', details });
      return;
    }

    req.body = dto;
    next();
  };
}

export function validateQuery<T extends object>(
  DtoClass: ClassConstructor<T>
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToInstance(DtoClass, req.query || {}, {
      exposeDefaultValues: true,
    });

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      const details = errors.map((error: ValidationError) => ({
        property: error.property,
        constraints: error.constraints,
      }));

      res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Validation failed', details });
      return;
    }

    // Attach the validated DTO to a new property on the request object
    (req as any).validatedQuery = dto;
    next();
  };
}