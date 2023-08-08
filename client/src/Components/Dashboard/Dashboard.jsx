import React,{useEffect, useState} from 'react'
import Axios from 'axios'
import Board from './Board/Board.jsx'; // Add this import statement
import './Dashboard.css';
import { HiOutlineLogout } from 'react-icons/hi';
const Dashboard = () =>
{

    const [userId, setUserId] = useState(null);
    const [ error, setError ] = useState( false );
    const [ userName, setUserName ] = useState( null );
   
    useEffect( () =>
    {
        Axios.get('http://localhost:3002/dashboard', {
            withCredentials: true
        })
            .then( response =>
            {
            const cookies = document.cookie.split( ';' );
            console.log( cookies ); 
            const data = getCookieValue( 'ID' );  
            const fetchedUserName = getCookieValue('NAME');; 
            setUserId(data);
            setUserName(fetchedUserName); // Set the username in state
            setError(false);
            })
            .catch(error => {
            console.error('Error fetching user profile:', error);
            setError(true);
            });
    }, []);
    

    // Function to get the value of a specific cookie by its name
  const getCookieValue = (name) => {
      const cookies = document.cookie.split( ';' );
      console.log( cookies );
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
        if ( cookie.startsWith( `${ name }=` ) )
        {
            console.group( cookie.substring( name.length + 1 ) );
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  };
    
    return (
        <div>
            <div className='header'>
                {error ? <p>Error fetching user profile.</p> : (
                    <div>
                    <h1> Welcome {userName} </h1>
                    <p>User ID: {userId}</p>
                    </div>
                )}
            </div>
            <div className='dashboard'>
                <div className='dashboard_container'>
                    <div className='left_container'>
                        <div className='link_container'>
                            <h3>Menu Options</h3>
                            <a href="/todolistMain">Add Task</a>
                            <a href="/rewardMain">Add Reward</a>
                            <a href="/decision">Spin!</a>
                        </div>
                        <div className='logout_container'>
                            <HiOutlineLogout className='icon' />
                            <a href="/">Log Out</a>
                            </div>
                    </div>
                        <Board width={450} height={600} />
                    </div>
            </div>
            
        </div>
  );
};

export default Dashboard;
