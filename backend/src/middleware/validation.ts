import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ApiResponse } from "../types";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: error.details.map((detail) => detail.message).join(", "),
      };
      res.status(400).json(response);
      return;
    }

    next();
  };
};

// Validation Schemas
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(1).required().messages({
    "any.required": "Password is required",
  }),
});

export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Password confirmation is required",
  }),
});

// Context validation schemas
export const createContextSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    "string.min": "Context name is required",
    "string.max": "Context name must be less than 50 characters",
    "any.required": "Context name is required",
  }),
  description: Joi.string().min(1).max(200).required().messages({
    "string.min": "Context description is required",
    "string.max": "Context description must be less than 200 characters",
    "any.required": "Context description is required",
  }),
  color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .messages({
      "string.pattern.base": "Color must be a valid hex color (e.g., #6366f1)",
    }),
});

export const updateContextSchema = Joi.object({
  name: Joi.string().min(1).max(50).optional().messages({
    "string.min": "Context name cannot be empty",
    "string.max": "Context name must be less than 50 characters",
  }),
  description: Joi.string().min(1).max(200).optional().messages({
    "string.min": "Context description cannot be empty",
    "string.max": "Context description must be less than 200 characters",
  }),
  color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .messages({
      "string.pattern.base": "Color must be a valid hex color (e.g., #6366f1)",
    }),
});

// Attribute validation schemas
export const createAttributeSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Attribute name is required",
    "string.min": "Attribute name cannot be empty",
    "string.max": "Attribute name must be less than 100 characters",
  }),
  value: Joi.string().min(1).required().messages({
    "string.empty": "Attribute value is required",
    "string.min": "Attribute value cannot be empty",
  }),
  type: Joi.string()
    .valid("text", "email", "phone", "url", "image", "date", "address")
    .required()
    .messages({
      "any.only":
        "Type must be one of: text, email, phone, url, image, date, address",
    }),
});

export const updateAttributeSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional().messages({
    "string.min": "Attribute name cannot be empty",
    "string.max": "Attribute name must be less than 100 characters",
  }),
  value: Joi.string().min(1).optional().messages({
    "string.min": "Attribute value cannot be empty",
  }),
  type: Joi.string()
    .valid("text", "email", "phone", "url", "image", "date", "address")
    .optional()
    .messages({
      "any.only":
        "Type must be one of: text, email, phone, url, image, date, address",
    }),
});

// Context-Attribute validation schemas
export const assignAttributeToContextSchema = Joi.object({
  context_id: Joi.alternatives()
    .try(Joi.string().min(1), Joi.number().integer().positive())
    .required()
    .messages({
      "any.required": "Context ID is required",
      "alternatives.match": "Context ID must be a valid string or number",
    }),
  attribute_id: Joi.alternatives()
    .try(Joi.string().min(1), Joi.number().integer().positive())
    .required()
    .messages({
      "any.required": "Attribute ID is required",
      "alternatives.match": "Attribute ID must be a valid string or number",
    }),
});
