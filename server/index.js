/* Dependencies */
const sessionPaths = ['/login', '/dashboard', '/todolistMain'];
const session = require('express-session');
const express = require( 'express' )
const app = express()
const mysql = require( 'mysql' )
const cors = require( 'cors' )
const redis = require('ioredis');

const redisStore = require("connect-redis").default;



app.use( express.json() )

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
} );

redisClient.on('connect', () => {
    console.log('Connected to Redis');
    //startServer(); // Start the server only after the Redis connection is established
});



app.use( cors( {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
} ) );

app.use(sessionPaths,
  session({
    store: new redisStore({ client: redisClient }),
    secret: '1',
    maxAge: 600 * 600 * 10000,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true, // Set this to 'true' if your server is running on HTTPS
      httpOnly: false,
      sameSite: 'none', // Important for cross-site cookies
      maxAge: 10000 * 600 * 600
    }
  })
);

//run the server
app.listen( 3002, () =>
{
    console.log('server is running on port 3002')
} )




//create database
const db = mysql.createConnection( {
    user: 'nicole_cao',
    password : 'Asdf1234@',
    host: 'localhost',
    database: 'TreetQuest',
   
} );

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database!');
} );


// setup a route to the server that will register a user
app.post( '/register', (req, res) =>
{
    //variable
    const sentEmail = req.body.Email
    const sentUsername = req.body.UserName
    const sentPassword = req.body.Password
    console.log( "what the " );
    // sql statements to insert the user to the database
    const SQL = 'INSERT INTO users (email, username, password) VALUES (?,?,?)'
    // enter the value through variable
    const Values = [ sentEmail, sentUsername, sentPassword ]
    //Query to execute the sql statement stated above
    db.query( SQL, Values, ( err, results ) =>
    {
        console.log( 'before if' )
        if ( err )
        {
            console.log(err)
            console.log( 'hiii' )
            res.send(err)
        } else
        {
            console.log( 'User inserted Successfully' )
            res.send({message: 'User added!'})
        }
    } )
    // at this point user hasn't been submitted yet, need to use express and cors
} )

// now we need to login with these credentials from a registered user.
// create route to login

app.post( '/login', ( req, res ) =>
{
    //variable
    const sentloginUsername = req.body.LoginUserName
    const sentloginPassword = req.body.LoginPassword

    // sql statements to insert the user to the database
    const SQL = 'SELECT * FROM users WHERE username = ? && password = ?'
    // enter the value through variable
    const Values = [ sentloginUsername, sentloginPassword ]
    
    db.query( SQL, Values, ( err, results ) =>
    {
        if ( err )
        {
            res.send( { error: err } )
        } if ( results.length > 0 )
        {
           const userId = results[0].id;
        
      // Store the user ID in the session, TODO
            req.session.userId = userId;
            console.log( 'Session saved' );
            const sessionId = req.sessionID;
            // console.log( 'Session ID:', sessionId );
            // console.log( 'Retrieved user ID:', userId );
            // console.log( 'Session object in login :', req.session );
            // console.log( 'req.headers =', req.headers );
            const cookieName = 'ID';
            res.cookie( cookieName, userId,
                {
                    // Set other cookie options if needed, e.g., maxAge, secure, httpOnly, etc.
                    maxAge: 9000000, // Cookie expires in 15 minutes (in milliseconds)
                    httpOnly: false,
                    secure: false,
                    sameSite: 'none', // Restrict cookie access to the same site (optional)
                } );
            //console.log( res);
            res.send( results );
        } else
        {
            res.send({message: 'Credentials Don not match!'})
        }
    } )
})

// get the cookie stored in the browser
app.get('/dashboard', (req, res) => {
  const sessionId = req.sessionID;
  console.log('Session ID:', sessionId);
  console.log('req.headers =', req.headers);

  const userIdCookie = req.headers.cookie
    ? req.headers.cookie.split(';').find((cookie) => cookie.trim().startsWith('ID='))
    : null;

  if (userIdCookie) {
    const userId = userIdCookie.split('=')[1];
    res.json({ userId });
  } else {
    console.log('User not authenticated');
    res.status(401).json({ message: 'User not authenticated' });
  }
});

app.post( '/todolistMain', ( req, res ) =>
{
  const { task_name, task_level, status, task_creator_id } = req.body;
  const SQL = 'INSERT INTO tasks (task_name, task_level, status, task_creator_id) VALUES (?, ?, ?, ?)';
  const values = [task_name, task_level, status, task_creator_id];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error adding task' });
    } else {
      const newTask = { task_id: results.insertId, task_name, task_level, status, task_creator_id };
      res.json(newTask);
    }
  });
} );


app.get('/todolistMain', (req, res) => {
  const userId = req.query.userId; // Get the 'userId' query parameter from the URL

    console.log( 'in app.get ' + userId );
  if (!userId) {
    // If 'userId' is not found in the query parameter, return an error response
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const SQL = 'SELECT * FROM tasks WHERE task_creator_id = ?'; // Filter tasks based on 'task_creator_id'
  db.query(SQL, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching tasks' });
    } else {
      res.json(results);
    }
  });
} );

app.delete('/todolistMain/:id', (req, res) => {
  const taskId = req.params.id;
  const SQL_DELETE_TASK = 'DELETE FROM tasks WHERE task_id = ?';
  
  db.query(SQL_DELETE_TASK, [taskId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting task' });
    }

    // Task deleted successfully
    res.json({ message: 'Task deleted successfully' });
  });
});