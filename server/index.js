/* Dependencies */
const express = require( 'express' )
const app = express()
const mysql = require( 'mysql' )
const cors = require( 'cors' )
app.use( express.json() )
app.use (cors()) 
//run the server
app.listen( 3002, () =>
{
    console.log('server is running on port 3002')
} )

//create database
const db = mysql.createConnection( {
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'TreetQuest',
} );

// setup a route to the server that will register a user
app.post( '/register', (req, res) =>
{
    //variable
    const sentEmail = req.body.Email
    const sentUsername = req.body.UserName
    const sentPassword = req.body.Password

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
            res.send( results )
        } else
        {
            res.send({message: 'Credentials Don not match!'})
        }

   
    } )
})
