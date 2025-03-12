import React, { useRef, useState } from 'react';
import '../styles/AuthForm.css';
import { signUp } from '../api/auth';
import { login } from '../api/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const navigate = useNavigate();

  const fullNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = fullNameRef.current?.value;
    const username = usernameRef.current.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current.value;

    // Add your form submission logic here
    console.log({ fullName, username, email, password });

    const payload = {
      fullName,
      username,
      email,
      password,
    };

    try {
      setIsPending(true);
      if (isLogin) {
        const data = await login(payload);
        toast.success(data.message);
        // navigate('/')
        window.location.href = '/';
        return;
      }
      const data = await signUp(payload);
      toast.success(data.message);
      navigate('/');

      window.location.href = '/';

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }

  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                ref={fullNameRef}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              ref={usernameRef}
              placeholder="Enter your username"
              required
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                ref={emailRef}
                placeholder="Enter your email"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn" disabled = {isPending}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span className="auth-mode" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Sign Up' : ' Login'}
          </span>
        </p>
      </div>
    </div>
  );
};
