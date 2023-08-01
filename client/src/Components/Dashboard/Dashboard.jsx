import React,{useEffect, useState} from 'react'
import Axios from 'axios'

const Dashboard = () =>
{

    const [userId, setUserId] = useState(null);
    const [ error, setError ] = useState( false );
    
    useEffect( () =>
    {
        // a JavaScript library used for making HTTP requests from a web browser
        // or a Node.js environment. 
        Axios.get('http://localhost:3002/dashboard', {
            withCredentials: true}).then( response =>
            {
                const data = getCookieValue( 'ID' );
                console.log('useeffect ' + data );
                setUserId( data );
                setError( false );
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
            console.log( 'ji' );
            console.group( cookie.substring( name.length + 1 ) );
        return cookie.substring(name.length + 1);
      }
    }
      console.log( 'ji2' );
    return null;
  };
    
    return (
        <div>
          
            This is Dashboard page!
             <h1>User Profile</h1>
                {error ? ( <p>Error fetching user profile.</p>) : (
                userId && <p>User ID: {userId}</p>
            )}
            
            <a href="/todolistMain">ToDO</a>
            <a href="/rewardMain">Reward</a>
            <a href="/decision">Decision</a>
          <a href="/">Log Out</a>

    </div>
  )
}

export default Dashboard
