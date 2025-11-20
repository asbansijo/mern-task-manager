import React, { useEffect, useState } from 'react';
import { createTask, updateTask } from '../api';

export default function TaskForm({ editingTask, onDone }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setStatus(editingTask.status || 'pending');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
    }
    setError('');
  }, [editingTask]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }
    const payload = { title: title.trim(), description, status };
    try {
      if (editingTask) {
        await updateTask(editingTask._id, payload);
      } else {
        await createTask(payload);
      }
      window.dispatchEvent(new Event('tasksUpdated'));
      onDone && onDone();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    }
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <label>Status</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {error && <div className="error">{error}</div>}

      <div className="form-actions">
        <button className="btn" type="submit">{editingTask ? 'Update' : 'Add'}</button>
        {editingTask && <button type="button" className="btn ghost" onClick={() => onDone && onDone()}>Cancel</button>}
      </div>
    </form>
  );
}
