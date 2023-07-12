//rafce
import { useEffect, useState } from "react"
const RewardMain = () =>
{
    const [ newItem, setNewItem ] = useState("");// new state variable and new function. can not directly update state variable, inmutable, call the set function,and rerender the entire component. 
    const [ reward, setRewards ] = useState(() => {
    const localValue = localStorage.getItem("ITEMS")
    if (localValue == null) return []
    return JSON.parse(localValue)
    } ); //if local storage is empty return empty array, else return what's inside the local storage
    // ps can not render hooks conditionally 
    
    //local storage
    useEffect( () =>
    {
        localStorage.setItem( "ITEMS", JSON.stringify( reward ) )
    }, [ reward ] ) //every time reward is changed call that function. 
   
    function handleSubmit ( e )
    {
        e.preventDefault();
         // set the state variable to a brand new array, add a new variable at
         // the end.
         
        // passing a function
        setRewards( currentreward => {
            return [
                ...currentreward,
                { id: crypto.randomUUID(), title: newItem, completed: false },
            ]
        } )
        setNewItem("")
    }
   
    // for check funtion 
    function togglereward ( id, completed )
    {
        setRewards( currentreward =>
        {
            return currentreward.map( reward =>
            {
                if ( reward.id === id )
                {
                    return {...reward, completed}
                }
                return reward
            })
        })
    }
   
    // for delete funciton
    function deleteReward ( id )
    {
        setRewards( currentreward =>
        {
            return currentreward.filter(reward => reward.id !== id)
        })
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="new_item_form">
                <div className="form-row">
                    <label htmlFor="item">New Reward</label>
                    <input value={ newItem }
                        // this function makes the type possible, update the new
                        // state variabl, rerender the entire component. 
                        onChange={ e => setNewItem( e.target.value ) }
                        type="text"
                        id="item" />
                </div>
                <button className="btn">Add</button>
            </form>
            <h1 className="header">Reward List</h1>
            <ul className="list">
                {reward.length === 0 && "No Rewards"}
                { reward.map( reward =>
                {
                    return <li key={reward.id}>
                            <label>
                            <input type="checkbox" checked={ reward.completed} onChange={e => togglereward(reward.id,e.target.checked)}/>{reward.title}      
                            </label>
                        <button onClick={()=> deleteReward(reward.id) } className="btn btn-danger">Delete</button>
                    </li>
                })}
            </ul>
             <a href="/">Log Out</a>
        </div>
    )
}

export default RewardMain
