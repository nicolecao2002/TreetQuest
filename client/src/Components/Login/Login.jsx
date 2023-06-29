import React,{useState} from 'react'
import './Login.css'
import '../../App.css'
import video from '../../LoginAssets/video.mp4'
import logo from '../../LoginAssets/logo.png'
import {Link, useNavigate} from 'react-router-dom'
import { FaUserShield } from 'react-icons/fa'
import { BsFillShieldLockFill } from 'react-icons/bs'
import { AiOutlineSwapRight } from 'react-icons/ai'
import Axios from 'axios'

const Login = () =>
{
const [ loginUserName, setLoginUserName ] = useState( '' ) 
    const [ loginPassword, setLoginPassword ] = useState( '' )
    const navigateTo = useNavigate();
 const loginUser = (e) =>
 {
       e.preventDefault();
        //require axios to create an API that connects to the server
        Axios.post('http://localhost:3002/login', { //TODD
            //create variable to send to the server
            LoginUserName: loginUserName,
            LoginPassword: loginPassword
        } ).then( (response) =>
        {
            console.log(response.data.message)
            if ( response.data.message )
            {
                navigateTo('/') // login to same page
            } else
            {
                navigateTo('/dashboard')
            }
        } );
    } 
    
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
                  
                  <form action="" className='form gird'>
                  
                    {/* <span className='showMessage'>Login status will go here</span> */}
                    
                    <div className="inputDiv">
                        <label htmlFor='username'>Username</label>
                        <div className="input flex">
                            <FaUserShield className='icon' />
                            <input type='text' id='username' placeholder='Enter Username' onChange={(event)=>{ setLoginUserName(event.target.value)}}/>
                        </div>
                    </div>
                    
                    <div className="inputDiv">
                        <label htmlFor='password'>Password</label>
                        <div className="input flex">
                            <BsFillShieldLockFill className='icon' />
                            <input type='password' id='password' placeholder='Enter Password' onChange={(event)=>{setLoginPassword(event.target.value)}}/>
                        </div>
                    </div>

                    <button type='submit' className='btn flex' onClick={loginUser}>
                        <span>Login</span>
                        <AiOutlineSwapRight className='icon'/>           
                    </button>
                      <span className='forgotPassword'>Forgot Password? <a href="">Click Here</a>
                      </span>
                  </form>
              </div>
        </div>     
    </div>
  )
}

export default Login
