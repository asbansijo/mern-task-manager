import React, { useEffect, useState } from 'react';
import { fetchTasks, deleteTask } from '../api';

export default function TaskList({ onEdit }) {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (statusFilter !== 'all') params.status = statusFilter;
      const data = await fetchTasks(params);
      setTasks(data.tasks);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('tasksUpdated', handler);
    return () => window.removeEventListener('tasksUpdated', handler);
    // eslint-disable-next-line
  }, [statusFilter, page]);

  const onDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    await deleteTask(id);
    load();
  };

  return (
    <div>
      <div className="controls">
        <div>
          <label>Filter</label>
          <select className='filters' value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="pagination-info">
          <small>Page {page} / {totalPages} • {total} tasks</small>
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        <ul className="task-list">
          {tasks.length === 0 && <li className="empty-message">No tasks</li>}
          {tasks.map(t => (
            <li key={t._id} className={`task-item ${t.status}`}>
              <div className="task-main">
                <strong className="task-title">{t.title}</strong>
                <div className="meta">
                  <small className="task-desc">{t.description}</small>
                  <small>Created: {new Date(t.createdAt).toLocaleString()}</small>
                </div>
              </div>

              <div className="task-actions">
                <span className={`badge ${t.status}`}>{t.status}</span>
                <button className="btn ghost" onClick={() => onEdit(t)}>Edit</button>
                <button className="btn danger" onClick={() => onDelete(t._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="pager" style={{marginTop:10, display:'flex', gap:8}}>
        <button className="btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(p-1, 1))}>Prev</button>
        <button className="btn" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(p+1, totalPages))}>Next</button>
      </div>
    </div>
  );
}
