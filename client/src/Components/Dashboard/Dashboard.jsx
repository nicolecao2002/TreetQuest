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
     const [taskCount, setTaskCount] = useState({
    small: 0,
    medium: 0,
    large: 0,
     } );
    const[complete, setComplete] =  useState( null );
   
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
            } );
         
}, []);
    useEffect(() => {
    if (userId) {
        Axios.get(`http://localhost:3002/todolistMain?userId=${userId}`)
            .then(response => {
                const userTasks = response.data;
                const taskCountByLevel = userTasks.reduce((countByLevel, task) => {
                    if (task.status === "todo") {
                        countByLevel[task.task_level] = (countByLevel[task.task_level] || 0) + 1;
                    }
                    return countByLevel;
                }, {});

                // Count completed tasks
                const completedTasks = userTasks.filter(task => task.status === "completed").length;

                setTaskCount(taskCountByLevel);
                setComplete(completedTasks);
            })
            .catch(error => {
                console.error("Error fetching user's task data:", error);
            });
    }
}, [userId]);

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
            <div className='dash_header'>
                {error ? <p>Error fetching user profile.</p> : (
                    <div>
                    <h1> Welcome {userName} </h1>
                        <p>User ID: { userId }</p>
                        <p>{ complete }</p>
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
                            <HiOutlineLogout className='dash_icon' />
                            <a href="/">Log Out</a>
                            </div>
                    </div>
                    <Board width={ 450 } height={ 600 } numTaskComplete = {complete} />
                    <div className='right_container'>
                        <div className='status_container'>
                             <h3>Task Status</h3>
                        <p>Small Tasks Remaining: {taskCount.small ?? 0}</p>
                        <p>Medium Tasks Remaining: {taskCount.medium ?? 0}</p>
                        <p>Large Tasks Remaining: {taskCount.large ?? 0}</p>
                        </div>
                    <div className='instruction_container'>
                        <h4>How to Navigate this APP:</h4>
                        <ul>
                        <li>📝 Add tasks with "Add Task" link.</li>
                        <li>🏆 Create various rewards with "Add Reward".</li>
                        <li>🎉 Give it a whirl – Spin for a surprise reward.</li>
                        <li>📌 Stay in the know – Task status is at the top right</li>
                        </ul>
                        <p> Jump into the game on the left by tapping the space button! 🎮 New surprises await for more task completed!</p>
                        </div>
                    </div>

                </div>
                
            </div>
            
        </div>
  );
};

export default Dashboard;
