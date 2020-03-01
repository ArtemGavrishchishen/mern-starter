const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const User = require('../models/User');
const router = Router();

//=== /auth/register
router.post(
  '/register',
  [
    check('email', 'Invalid email')
      .normalizeEmail()
      .isEmail(),
    check('password', 'Minimum password length 6 characters').isLength({
      min: 6
    }),
    check('name', 'Enter your Name').notEmpty(),
    check('surname', 'Enter your Surname').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect registration data'
        });
      }
      const { name, surname, email, password } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: 'Such user exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ name, surname, email, password: hashedPassword });

      await user.save();
      res.status(201).json({ message: 'User created' });
    } catch (e) {
      res.status(500).json({ message: e });
    }
  }
);

//=== /auth/login
router.post(
  '/login',
  [
    check('email', 'Please enter a valid email')
      .normalizeEmail()
      .isEmail(),
    check('password', 'Enter password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect login details'
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'User is not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password, try again' });
      }

      const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'), {
        expiresIn: '72h'
      });

      res.json({
        token,
        userId: user._id
      });
    } catch (e) {
      res.status(500).json({ message: e });
    }
  }
);

module.exports = router;
