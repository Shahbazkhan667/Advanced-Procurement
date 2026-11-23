const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next(Object.assign(new Error('Authentication required'), { status: 401 }));
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }); }
  catch { return next(Object.assign(new Error('Invalid or expired token'), { status: 401 })); }
  const user = await User.findById(payload.sub).select('+tokenVersion');
  if (!user || !user.isActive || user.tokenVersion !== payload.ver) return next(Object.assign(new Error('Invalid or expired token'), { status: 401 }));
  req.user = user;
  next();
});
module.exports = authenticate;
