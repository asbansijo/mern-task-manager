const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const mongoose = require('mongoose');

// Create task
router.post('/', async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    const task = await Task.create({ title, description, status });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// Get all tasks (supports optional query params: status, page, limit)
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status && ['pending','in-progress','completed'].includes(status)) {
      filter.status = status;
    }

    const skip = (Math.max(parseInt(page,10),1) - 1) * Math.max(parseInt(limit,10),1);
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.max(parseInt(limit,10), 1));

    const total = await Task.countDocuments(filter);

    res.json({ tasks, total, page: parseInt(page,10), limit: parseInt(limit,10) });
  } catch (err) {
    next(err);
  }
});

// Get single task
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// Update task
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    const updated = await Task.findByIdAndUpdate(
      id,
      { title, description, status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete task
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
