import { validationErrorResponse } from '../utils/response.js';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      return validationErrorResponse(res, error.errors);
    }
  };
};