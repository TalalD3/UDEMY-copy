import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import facebook from '../assets/icons/facebook.svg';
import google from '../assets/icons/google.svg';
import github from '../assets/icons/github.svg';
import './css/login.css';
import logo from '../assets/images/colored logo.png';
import { message } from 'antd';
import axios from 'axios';

function Login() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    })
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const handleLoginClick = () => {
    setShowSignUp(false);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const loginOrSignUp = showSignUp ? 'signup' : 'login';

    console.log(loginOrSignUp , userData);
    try {
      const response = await axios.post(`http://localhost:5000/api/${loginOrSignUp}`, userData);

      const responseData = response.data;
      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace('/');
        message.success('success '+loginOrSignUp);
      } else {
        message.error(responseData.errors);
      }
    } catch (error) {
      // Handle error appropriately, e.g., show error message to user
      console.error('Error during sign up:', error);
    }

  };

  return (
    <div>
      <div className="login-container">
        <div className="left-side">
          <div className='topleft'>
            <h2>Easy Learning</h2>
            <p>Unlock boundless learning opportunities with just a click <br /> sign in now to embark on your educational journey!</p>
          </div>
        </div>
        <div className="right-side">
          <form onSubmit={handleFormSubmit}>
            <div className='h2'>
              {/* <img src={logo} alt="Logo" /> */}
              <h2>{showSignUp ? 'Sign Up' : 'Login'}</h2>
            </div>
            <div className="form-group">
              <label htmlFor="Email">Email</label>
              <div className='input'>
                <input type="email" value={userData.email} id="email" name="email" onChange={handleChange} placeholder='username@gmail.com' />
              </div>
            </div>
            {showSignUp && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className='input'>
                  <input
                    onChange={handleChange}
                    value={userData.username}
                    type="text"
                    id="username"
                    name="username"
                    placeholder='Enter your username'
                  // value={username}
                  />
                </div>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Password</label>
              <div className='input'>
                <input onChange={handleChange} value={userData.password} type="password" id="password" name="password" placeholder='Password' />
              </div>
              {!showSignUp && <Link to="/forgot-password">Forgot Password ?</Link>}
            </div>
            <div className='submit'>
              <button type="submit" onClick={handleFormSubmit}>{showSignUp ? 'Sign Up' : 'Login'}</button>
              <div className='OR'>
                <div className='hr'><hr /></div>
                <h5>Or continue with</h5>
                <div className='hr'><hr /></div>
              </div>
            </div>
            <div className='others'>
              <div className='button'><button ><img src={facebook} alt="Facebook" /></button></div>
              <div className='button'><button ><img src={google} alt="Google" /></button></div>
              <div className='button'><button ><img src={github} alt="Github" /></button></div>
            </div>
            <div className='sign'>
              <h5>{showSignUp ? 'Already have an account?' : "Don't have an account?"}</h5>
              <button type="button" className='signup' onClick={showSignUp ? handleLoginClick : handleSignUpClick}>
                {showSignUp ? 'Login' : 'Sign up for free'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
