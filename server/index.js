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
    password: 'Shen19760129!',
    database: 'TreetQuest',
} );

// setup a route to the server that will register a user
app.post( '/register', ( req, res ) =>
{
    const sentEmail = req.body.Email
    const sentUsername = req.body.Username
    const sentPassword = req.body.Password

    // sql statements to insert the user to the database
    const SQL = 'INSERT INTO users (email, username, password) VALUES (?,?,?)'
    // enter the value through variable
    const Values = [ sentEmail, sentUsername, sentPassword ]
    //Query to execute the sql statement stated above
    db.query( SQL, Values, ( err, results ) =>
    {
        if ( err )
        {
            console.log( 'sad' )
            res.send(err)
        } else
        {
            console.log( 'User inserted Successfully' )
            res.send({message: 'User added!'})
        }
    } )
    // at this point user hasn't been submitted yet, need to use express and cors
})