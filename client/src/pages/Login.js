// Imports
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';

function Login() {
  // State tracker
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN);

  // Logic for handling form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // Try to login using form data
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      // Get token from response
      const token = mutationResponse.data.login.token;
      // Login user
      Auth.login(token);
    } catch (e) {
      console.log(e);
    }
  };

  // Logic for handling change
  const handleChange = (event) => {
    const { name, value } = event.target;
    // On change, set form state to new values
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // JSX
  return (
    <div className="container my-1">
      <Link to="/signup">← Go to Signup</Link>

      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <label htmlFor="email">Email address:</label>
          <input
            placeholder="youremail@test.com"
            name="email"
            type="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="pwd">Password:</label>
          <input
            placeholder="******"
            name="password"
            type="password"
            id="pwd"
            onChange={handleChange}
          />
        </div>
        {error ? (
          <div>
            <p className="error-text">The provided credentials are incorrect</p>
          </div>
        ) : null}
        <div className="flex-row flex-end">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

// Export component
export default Login;
