import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import facebook from '../assets/icons/facebook.svg';
import google from '../assets/icons/google.svg';
import github from '../assets/icons/github.svg';
import './css/login.css';
import bg from '../assets/images/Login.png';
import { message } from 'antd';
import axios from 'axios';
import Foot from '../component/footer/Foot';

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
    if(userData.email === ''){
      message.info('Fill the email field..')
      return
    }
    if(userData.password === ''){
      message.info('Fill the password field..')
      return
    }

    if(showSignUp && userData.username === ''){
      message.info('Fill the username field..')
      return
    }

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
        
        <div className="right-side">
          <form onSubmit={handleFormSubmit}>
            <div className='h2'>
              {/* <img src={logo} alt="Logo" /> */}
              <h2>{showSignUp ? 'Sign Up' : 'Login'}</h2>
            </div>
            <div className="form-group">
              <label htmlFor="Email">Email</label>
              <div className='input'>
                <input type="email" value={userData.email} required id="email" name="email" onChange={handleChange} placeholder='username@gmail.com' />
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
                
                <h5>Or continue with</h5>
                
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
      <Foot />
    </div>
  );
}

export default Login;
