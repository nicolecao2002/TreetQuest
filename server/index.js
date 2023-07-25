/* Dependencies */
const sessionPaths = ['/login', '/dashboard'];
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
  methods: ['GET', 'POST'],
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
            console.log( 'Session ID:', sessionId );
            console.log( 'Retrieved user ID:', userId );
            console.log( 'Session object in login :', req.session );
            console.log( 'req.headers =', req.headers );
            const cookieName = 'ID';
            res.cookie( cookieName, userId,
                {
                    // Set other cookie options if needed, e.g., maxAge, secure, httpOnly, etc.
                    maxAge: 900000, // Cookie expires in 15 minutes (in milliseconds)
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


// TODO: 
app.get( '/dashboard', ( req, res ) =>
{  
  const sessionId = req.sessionID;
  console.log('Session ID:', sessionId);
    console.log( 'Session object in dash:', req.session );
    console.log( 'req.headers =', req.headers );

  if (req.session.userId) {
    const userId = req.session.userId;
    res.send({ userId });
  } else
  {
    console.log('pain');
    res.send({ message: 'User not authenticated' });
  }

} );

// TODO: manually insert the data into existing users table for old users. 
