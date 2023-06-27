import React from 'react'
import './Login.css'
import video from '../../LoginAssets/video.mp4'
import logo from '../../LoginAssets/logo3.png'
import {Link, NavLink} from 'react-router-dom'
import {FaUserShield} from 'react-icons/fa'
const Login = () =>
{
  return (
    <div className='loginPage flex'>
          <div className='container flex'>
              
              <div className='videoDiv'>
                  <video src={ video } autoPlay muted loop></video>
                  <div className='textDiv'>
                      <h2 className='title'>Welcome to TreetQuest</h2>
                      <p>An App that can make you happy! Jkjk</p>
                  </div>
                  <div className='footerDiv flex'>
                      <span className='text'>Don't have an Account?</span>
                      <Link to='/register'>
                          <button className='btn'>Sign Up</button>
                      </Link>
                    </div>
              </div>
              <div className='formDiv flex'>
                  <div className='headerDiv'>
                      <img src={ logo } alt="Logo Image" />
                      <h3>Welcome Back!</h3>
                  </div>
                  <form action="" className='form gird'></form>
                  <span>Login status will go here</span>
                  <div className="inputDiv">
                      <label htmlFor='username'>Username</label>
                      <div className="inpu tflex">
                          <FaUserShield className='icon' />
                          <input type='text' id='username' placeholder='Enter Username'/>
                      </div>
                  </div>
              </div>
        </div>     
    </div>
  )
}

export default Login
