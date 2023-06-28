/* Dependencies */
const express = require( 'express' )
const app = express()
const mysql = require( 'mysql' )
const cors = require( 'cors' )

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