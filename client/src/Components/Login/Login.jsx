import React from 'react'
import './Login.css'
import video from '../../LoginAssets/video.mp4'
import {Link, NavLink} from 'react-router-dom'
const Login = () => {
  return (
    <div className='loginPage flex'>
          <div className='container flex'>
              
              <div className='videoDiv'>
                  <video src={ video } autoPlay muted loop></video>
                  <div className='textDiv'>
                      <h2 className='title'>Welcome to TreetQuest</h2>
                      <p>An App that can make you happy!</p>
                  </div>
                  <div className='footerDiv flex'>
                      <span className='text'>Don't have an Account?</span>
                      <Link to='/register'>
                          <button className='btn'>Sign Up</button>
                      </Link>
                    </div>
              </div>
        </div>     
    </div>
  )
}

export default Login
