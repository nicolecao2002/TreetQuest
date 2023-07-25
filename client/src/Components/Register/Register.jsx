import './Register.css'
import React,{useState} from 'react'
import '../../App.css'
import video from '../../LoginAssets/video.mp4'
import logo from '../../LoginAssets/logo.png'
import { Link } from 'react-router-dom'
import { MdMarkEmailRead } from 'react-icons/md'
import { FaUserShield } from 'react-icons/fa'
import { BsFillShieldLockFill } from 'react-icons/bs'
import { AiOutlineSwapRight } from 'react-icons/ai'
import Axios from 'axios'
const Register = () =>
{
    // hold the variables
    const [ email, setEmail ] = useState( '' )
    const [ userName, setUserName ] = useState( '' ) // watchout for user
    const [ password, setPassword ] = useState( '' )
    
    const createUser = () =>
    {
        //require axios to create an API that connects to the server
        console.log( "hi" );
        Axios.post('http://localhost:3002/register', {
            //create variable to send to the server
            Email: email,
            UserName: userName,
            Password: password
        },  {withCredentials: true}).then( () =>
        {
            console.log( 'User has been created.' )
        } );
    }
    
    return (
        <div className='registerPage flex'>
          <div className='container flex'>
              
              <div className='videoDiv'>
                  <video src={ video } autoPlay muted loop></video>
                  <div className='textDiv'>
                      <h2 className='title'>Welcome to TreetQuest</h2>
                      <p>An App that can make you happy! Jkjk</p>
                  </div>
                  <div className='footerDiv flex'>
                      <span className='text'>Have an Account?</span>
                      <Link to='/'>
                          <button className='btn'>Login</button>
                      </Link>
                    </div>
              </div>
              <div className='formDiv flex'>
                  <div className='headerDiv'>
                      <img src={ logo } alt="Logo Image" />
                      <h3>Let Us Know You!</h3>
                  </div>
                  
                  <form action="" className='form gird'>
                    
                    <div className="inputDiv">
                        <label htmlFor='email'>Email</label>
                        <div className="input flex">
                            <MdMarkEmailRead className='icon' />
                            <input type='email' id='email' placeholder='Enter Email' onChange={(event)=>{setEmail(event.target.value)}}/>
                        </div>
                        </div>
                        
                    <div className="inputDiv">
                        <label htmlFor='username'>Username</label>
                        <div className="input flex">
                            <FaUserShield className='icon'/>
                            <input type='text' id='username' placeholder='Enter Username' onChange={(event)=>{setUserName(event.target.value)}}/>
                        </div>
                    </div>
                    
                    <div className="inputDiv">
                        <label htmlFor='password'>Password</label>
                        <div className="input flex">
                            <BsFillShieldLockFill className='icon' />
                            <input type='password' id='password' placeholder='Enter Password' onChange={(event)=>{setPassword(event.target.value)}}/>
                        </div>
                    </div>

                    <button type='button' className='btn flex' onClick={createUser}>
                        <span>Register</span>
                        <AiOutlineSwapRight className='icon'/>           
                    </button>
                      {/* <span className='forgotPassword'>Forgot Password? <a href="">Click Here</a>
                      </span> */}
                  </form>
              </div>
        </div>     
    </div>
  )
}

export default Register
