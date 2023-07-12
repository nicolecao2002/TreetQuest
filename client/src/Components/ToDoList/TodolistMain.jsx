import React from 'react'
import { useEffect, useState } from "react"

import '../../App.css'


const TodolistMain = () => {
    const [ newItem, setNewItem ] = useState("");
    const [ todos, setTodos ] = useState(() => {
    
    const localValue = localStorage.getItem( "ITEMS" )
    if (localValue == null) return []
    return JSON.parse(localValue)
    } ); 
   
    useEffect( () =>
    {
        localStorage.setItem( "ITEMS", JSON.stringify( todos ) )
    }, [ todos ] ) //every time todo is changed call that function. 
   
    function handleSubmit ( e )
    {
        e.preventDefault();

        setTodos( currentTodos => {
            return [
                ...currentTodos,
                { id: crypto.randomUUID(), title: newItem, completed: false },
            ]
        } )
        setNewItem("")
    }
   
    // for check funtion 
    function toggleTodo ( id, completed )
    {
        setTodos( currentTodos =>
        {
            return currentTodos.map( todo =>
            {
                if ( todo.id === id )
                {
                    return {...todo, completed}
                }
                return todo
            })
        })
    }
   
    // for delete funciton
    function deleteTodo ( id )
    {
        setTodos( currentTodos =>
        {
            return currentTodos.filter(todo => todo.id !== id)
        })
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="new_item_form">
                <div className="form-row">
                    <label htmlFor="item">New TODO</label>
                    <input value={ newItem }
                        // this function makes the type possible, update the new
                        // state variabl, rerender the entire component. 
                        onChange={ e => setNewItem( e.target.value ) }
                        type="text"
                        id="item" />
                </div>
                <button className="btn">Add</button>
            </form>
            <h1 className="header">Todo List</h1>
            <ul className="list">
                {todos.length === 0 && "No Rewards"}
                { todos.map( todo =>
                {
                    return <li key={todo.id}>
                            <label>
                            <input type="checkbox" checked={ todo.completed} onChange={e => toggleTodo(todo.id,e.target.checked)}/>{todo.title}      
                            </label>
                        <button onClick={()=> deleteTodo(todo.id) } className="btn btn-danger">Delete</button>
                    </li>
                })}
            </ul>
             <a href="/dashboard">Return</a>
        </div>
    )
}

export default TodolistMain
