import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../config';
import './Login.css'

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin-token', data.token);
        navigate('/addproduct');
      } else {
        setError(data.errors || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Could not reach the backend. Is it running?');
    }
    setLoading(false);
  }

  return (
    <div className="admin-login">
      <div className="admin-login-panel">
        <div className="admin-login-panel-grid" aria-hidden="true">
          {Array.from({ length: 48 }).map((_, i) => <span key={i}></span>)}
        </div>
        <div className="admin-login-panel-content">
          <p className="admin-login-wordmark">ShopVerse</p>
          <h1>Run the store<br/>from one place.</h1>
          <p className="admin-login-subtext">
            Add products, track orders, and manage your catalog - all from this console.
          </p>
          <ul className="admin-login-points">
            <li>Add &amp; edit products with AI-generated descriptions</li>
            <li>Track and update order status in real time</li>
            <li>Keep a single source of truth for your catalog</li>
          </ul>
        </div>
      </div>

      <div className="admin-login-formside">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <p className="admin-login-eyebrow">Admin Console</p>
          <h2>Sign in</h2>
          <p className="admin-login-formsubtitle">Enter your admin credentials to continue.</p>

          <label className="admin-login-label" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="admin"
            value={credentials.username}
            onChange={changeHandler}
            autoComplete="username"
            required
          />

          <label className="admin-login-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={credentials.password}
            onChange={changeHandler}
            autoComplete="current-password"
            required
          />

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="admin-login-footnote">Restricted access. Store owners only.</p>
        </form>
      </div>
    </div>
  )
}
export default Login
