module.exports = (...allowedRoles) => (req, _res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) return next(Object.assign(new Error('Forbidden'), { status: 403 }));
  next();
};
