const { z } = require('zod');
const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!parsed.success) return next(Object.assign(new Error('Request validation failed'), { name: 'ZodError', issues: parsed.error.issues }));
  req.validated = parsed.data;
  next();
};
const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const loginSchema = z.object({ body: z.object({ email, password: z.string().min(1).max(128) }) });
const changePasswordSchema = z.object({ body: z.object({ currentPassword: z.string().min(1).max(128), newPassword: z.string().min(12).max(128) }) });
const forgotSchema = z.object({ body: z.object({ email }) });
const resetSchema = z.object({ body: z.object({ token: z.string().min(32).max(256), newPassword: z.string().min(12).max(128) }) });
module.exports = { validate, loginSchema, changePasswordSchema, forgotSchema, resetSchema };
