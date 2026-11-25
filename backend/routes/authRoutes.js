const express = require('express');
const controller = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const { validate, loginSchema, changePasswordSchema, forgotSchema, resetSchema } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/login', validate(loginSchema), controller.login);
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me);
router.post('/change-password', authenticate, validate(changePasswordSchema), controller.changePassword);
router.post('/forgot-password', validate(forgotSchema), controller.forgotPassword);
router.post('/reset-password', validate(resetSchema), controller.resetPassword);

router.post('/register', async (req, res) => {
  if (typeof controller.register === 'function') {
    return controller.register(req, res);
  }

  try {
    const { name, email, phone, role, department, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    return res.status(201).json({
      user: {
        id: Date.now().toString(),
        name: String(name).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : '',
        role: role || 'employee',
        department: department || 'Engineering',
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Registration failed.' });
  }
});

module.exports = router;