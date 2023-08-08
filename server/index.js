/* Dependencies */
const sessionPaths = ['/login', '/dashboard', '/todolistMain','/rewardMain', '/decision'];
const session = require('express-session');
const express = require( 'express' )
const app = express()
const mysql = require( 'mysql' )
const cors = require( 'cors' )
const redis = require('ioredis');
const redisStore = require("connect-redis").default;


app.use( cors( {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE','PUT'],
  credentials: true
} ) );

app.use( express.json() )

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
} );

redisClient.on('connect', () => {
    console.log('Connected to Redis');
    //startServer(); // Start the server only after the Redis connection is established
});


app.use(sessionPaths,
  session({
    store: new redisStore({ client: redisClient }),
    secret: '1',
    maxAge: 600 * 600 * 10000,
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
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
            const userId = results[ 0 ].id;
            const name = results[ 0].username;
            console.log(results);
      // Store the user ID in the session, TODO
            req.session.userId = userId;
            req.session.name = name;
            const cookieName = 'ID';
            res.cookie( cookieName, userId, name,
                {
                    // Set other cookie options if needed, e.g., maxAge, secure, httpOnly, etc.
                    maxAge: 9000000, // Cookie expires in 15 minutes (in milliseconds)
                    httpOnly: false,
                    secure: false,
                    sameSite: 'none', // Restrict cookie access to the same site (optional)
                } );
            const cookieNameForName = 'NAME';
                res.cookie(cookieNameForName, name, {
                    maxAge: 9000000,
                    httpOnly: false,
                    secure: false,
                    sameSite: 'none',
            });
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
  const rewardID = req.params.id; // ??
  const SQL_DELETE_TASK = 'DELETE FROM tasks WHERE task_id = ?';
  
  db.query(SQL_DELETE_TASK, [rewardID], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting task' });
    }

    // Task deleted successfully
    res.json({ message: 'Task deleted successfully' });
  });
} );

app.put( '/todolistMain/:id', ( req, res ) =>
{
    console.log('in toggle');
  const rewardID = req.params.id;
  const { status } = req.body;

  // Check if the task exists before updating the status
  const SQL_FIND_TASK = 'SELECT * FROM tasks WHERE task_id = ?';
  db.query(SQL_FIND_TASK, [rewardID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error toggling task' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // If the task exists, update its status
    const SQL_UPDATE_TASK_STATUS = 'UPDATE tasks SET status = ? WHERE task_id = ?';
    db.query(SQL_UPDATE_TASK_STATUS, [status, rewardID], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error toggling task' });
      }

      // Status updated successfully
      res.json({ message: 'Task status updated successfully' });
    });
  });
});

app.post( '/rewardMain', ( req, res ) =>
{
    console.log( "in post " + req.body );
  const { reward_name, reward_level, reward_creator_id } = req.body;
  const SQL = 'INSERT INTO reward (reward_name, reward_level, reward_creator_id) VALUES (?, ?, ?)';
  const values = [reward_name, reward_level, reward_creator_id];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error adding task' });
    } else {
      const newTask = { task_id: results.insertId, reward_name, reward_level, reward_creator_id };
      res.json(newTask);
    }
  });
} );

app.get('/rewardMain', (req, res) => {
  const userId = req.query.userId; // Get the 'userId' query parameter from the URL

    console.log( 'in app.get ' + userId );
  if (!userId) {
    // If 'userId' is not found in the query parameter, return an error response
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const SQL = 'SELECT * FROM reward WHERE reward_creator_id = ?'; // Filter tasks based on 'reward_creater_id'
  db.query(SQL, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching tasks' });
    } else {
      res.json(results);
    }
  });
} );


app.delete('/rewardMain/:id', (req, res) => {
    const rewardID = req.params.id; // ??
    console.log( "delete" + rewardID );
  const SQL_DELETE_TASK = 'DELETE FROM reward WHERE reward_id = ?';
  
  db.query(SQL_DELETE_TASK, [rewardID], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting reward' });
    }

    // Task deleted successfully
    res.json({ message: 'Reward deleted successfully' });
  });
} );


app.get('/decision', (req, res) => {
  const userId = req.query.userId; // Get the 'userId' query parameter from the URL

    console.log( 'in app.get decision ' + userId );
  if (!userId) {
    // If 'userId' is not found in the query parameter, return an error response
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const SQL = 'SELECT * FROM reward WHERE reward_creator_id = ?'; // Filter tasks based on 'reward_creater_id'
  db.query(SQL, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching tasks' });
    } else {
      res.json(results);
    }
  });
} );



app.get("/todolistMain", (req, res) => {
  const userId = req.query.userId; // Assuming the user ID is passed as a query parameter

  // Query the database to get the user's completed tasks
  const query = "SELECT * FROM tasks WHERE task_creator_id = ? AND status = 'completed'";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user's task data:", err);
      res.status(500).json({ error: "Error fetching user's task data" });
      return;
    }

    // Send the task data back as the response
    res.json(results);
  });
});





