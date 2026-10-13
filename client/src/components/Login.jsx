import React, { useState } from 'react';

export default function Login({ onLogin }) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

function handleSubmit(e) {
e.preventDefault();

if (!email.trim() || !password.trim()) {
  alert('Please enter your email and password.');
  return;
}

onLogin();

}

return (
<div style={{
minHeight: '100vh',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
background: '#f8f3f0',
padding: '20px',
boxSizing: 'border-box'
}}>
<form onSubmit={handleSubmit} style={{
background: '#fff',
padding: '32px 24px',
borderRadius: '20px',
width: '100%',
maxWidth: '380px',
boxShadow: '0 8px 30px #00000012',
boxSizing: 'border-box'
}}>
<h1 style={{
textAlign: 'center',
color: '#9a6b57',
marginBottom: '8px'
}}>
Aura Luxe
</h1>

    <p style={{ textAlign: 'center', color: '#777' }}>
      Welcome back! Please log in.
    </p>

    <label>Email address</label>
    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      required
      style={{
        display: 'block',
        width: '100%',
        padding: '13px',
        margin: '8px 0 18px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxSizing: 'border-box'
      }}
    />

    <label>Password</label>
    <input
      type="password"
      placeholder="Enter your password"
      value={password}
      onChange={e => setPassword(e.target.value)}
      required
      style={{
        display: 'block',
        width: '100%',
        padding: '13px',
        margin: '8px 0 22px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxSizing: 'border-box'
      }}
    />

    <button type="submit" style={{
      width: '100%',
      padding: '14px',
      border: 'none',
      borderRadius: '8px',
      background: '#9a6b57',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold'
    }}>
      Login
    </button>
  </form>
</div>

);
}
