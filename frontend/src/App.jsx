import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Login from './components/Login';

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('user') || '');
  const [editingTask, setEditingTask] = useState(null);

  const onLogin = (name) => {
    localStorage.setItem('user', name);
    setUser(name);
  };
  const onLogout = () => {
    localStorage.removeItem('user');
    setUser('');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        {user ? (
          <div>
            <span>Hi, {user} </span>
            <button className="btn" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <Login onLogin={onLogin} />
        )}
      </header>

      <main>
        <div className="grid">
          <section className="card">
            <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>
            <TaskForm editingTask={editingTask} onDone={() => setEditingTask(null)} />
          </section>

          <section className="card">
            <h2>Tasks</h2>
            <TaskList onEdit={setEditingTask} />
          </section>
        </div>
      </main>

      <footer className="footer"></footer>
    </div>
  );
}
