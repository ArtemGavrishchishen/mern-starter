const { Router } = require('express');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

const router = Router();

//=== get all users
router.get('/', auth, async (req, res) => {
  try {
    const Role = config.get('Role');
    const currentUser = await User.findOne({ _id: req.user.userId });

    if (currentUser.role !== Role.Admin) {
      return res.status(401).json({ message: 'Access denied' });
    }

    const users = await User.find();

    const usersWithoutPassword = users.map(user => {
      const userObject = { ...user.toObject() };
      const { password, __v, ...withoutPassword } = userObject;
      return withoutPassword;
    });

    res.json(usersWithoutPassword);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

//=== get userById
router.get('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: req.user.userId });

    if (id !== user.id && user.role !== Role.Admin) {
      return res.status(401).json({ message: 'Access denied' });
    }

    const userObject = { ...user.toObject() };
    const { password, __v, ...userWithoutPassword } = userObject;

    res.json({ ...userWithoutPassword });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

//=== update
router.put('/', auth, async (req, res) => {
  try {
    const _id = req.user.userId;
    const { user } = req.body;

    const newUser = {
      updateAt: new Date()
    };

    if (user.name) {
      newUser.name = user.name;
    }

    if (user.surname) {
      newUser.surname = user.surname;
    }

    if (user.password && user.password.length >= 6) {
      newUser.password = await bcrypt.hash(user.password, 12);
    }

    const updateUser = await User.findOneAndUpdate(
      { _id },
      { ...newUser },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json({ updateUser });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

//=== delete userById
router.delete('/', auth, async (req, res) => {
  try {
    const { id } = req.body;
    if (id !== req.user.userId) {
      return res.status(401).json({ message: 'Access denied' });
    }

    const user = await User.findById(id);
    await user.remove();
    res.status(200).json(id);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

module.exports = router;
