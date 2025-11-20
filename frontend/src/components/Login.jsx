import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) onLogin(name.trim()); }}>
      <input className='log-input' placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <button className="btn login" type="submit">Login</button>
    </form>
  );
}
