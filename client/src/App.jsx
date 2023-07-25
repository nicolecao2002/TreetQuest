import { useState } from 'react'
import "./App.css"
import Dashboard from './Components/Dashboard/Dashboard'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import TodolistMain from './Components/ToDoList/TodolistMain'
import RewardMain from './Components/RewardList/RewardMain'
//import Avatar from './Components/Avatar/Avatar'

import {
    createBrowserRouter,
    RouterProvider  
} from 'react-router-dom'

/* create router*/
const router = createBrowserRouter( [
    {
        path: '/',
        element: <div> <Login /></div>
    },

    {
        path: '/register',
        element: <div>  <Register /></div>
    },


    {
    path: '/dashboard',
    element: <div> <Dashboard/></div>
    },
    
    {
        path: '/todolistMain',
        element: <div> <TodolistMain /></div>
    },
    {
        path: '/rewardMain',
        element: <div> <RewardMain /></div>
    },
    
]);

function App() {

  return (
    <div>
        <RouterProvider router={router}/>
    </div>
  )
}

export default App //a capitalize letter indicate it's a component 
