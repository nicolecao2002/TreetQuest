//rafce
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Components/ToDoList/ToDoList.css'

const RewardMain = () =>
{
  const [newRewardName, setnewRewardName] = useState('');
  const [Rewards, setRewards] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userFetched, setUserFetched] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [ filterLevel, setFilterLevel ] = useState( null );

    useEffect( () =>
    {
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const response = await axios.get('http://localhost:3002/dashboard', {
        withCredentials: true,
      });
      setUserId(response.data.userId);
      console.log('User ID:', response.data.userId);
      setUserFetched(true);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  useEffect(() => {
    if (userId && userFetched) {
      fetchRewards(userId);
    }
  }, [userId, userFetched]);

  async function fetchRewards(userId) {
    try {
      console.log('Fetching Rewards for user ID:', userId);
      const response = await axios.get(`http://localhost:3002/rewardMain?userId=${userId}`, {
        withCredentials: true,
      });
      setRewards(response.data);
    } catch (error) {
      console.error('Error fetching Rewards:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newRewardName.trim()) {
      setErrorMessage('reward name cannot be empty.');
      return;
    }

    if (!selectedLevel) {
      setErrorMessage('Please select a reward level.');
      return;
    }

      try
      {
      console.log( userId );
      const response = await axios.post('http://localhost:3002/rewardMain', {
        reward_name: newRewardName,
        reward_level: selectedLevel,
        reward_creator_id: userId,
      });
      setRewards([...Rewards, response.data]);
      setnewRewardName('');
      // Clear the error message if there was no error
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding reward:', error);
    }
  }


  async function deleteReward(id) {
    try {
      await axios.delete(`http://localhost:3002/rewardMain/${id}`);
      setRewards((currentRewards) => currentRewards.filter((reward) => reward.reward_id !== id));
    } catch (error) {
      console.error('Error deleting reward:', error);
    }
  }

  const filterRewardsByLevel = (level) => {
    if (level === filterLevel) {
      setFilterLevel(null);
    } else {
      setFilterLevel(level);
    }
  };

  const filteredRewards = filterLevel ? Rewards.filter((reward) => reward.reward_level === filterLevel) : Rewards;

  if (!userFetched) {
    return <div>Loading...</div>;
  }    

    
 return (
      <div className="page_container">
          <div className='two_container'>
            <div className="form-container">
                <form onSubmit={handleSubmit} className="new-item-form">
                <h2>New reward</h2>
                <div className="form-row">
                    <span>
                    <input value={newRewardName} onChange={(e) => setnewRewardName(e.target.value)} type="text" id="reward" />
                    </span>
                </div>
                <div className="btnFormContainer">
                    <button type='button'
                    className={`levelSbtn ${selectedLevel === 'small' ? 'active-filter' : ''}`}
                    onClick={() => setSelectedLevel('small')}
                    >
                    Small
                    </button>
                    <button type='button'
                    className={`levelMbtn ${selectedLevel === 'medium' ? 'active-filter' : ''}`}
                    onClick={() => setSelectedLevel('medium')}
                    >
                    Medium
                    </button>
                    <button type='button'
                    className={`levelLbtn ${selectedLevel === 'large' ? 'active-filter' : ''}`}
                    onClick={() => setSelectedLevel('large')}
                    >
                    Large
                    </button>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button className="add-btn">Add</button>
                 </form>
                 <div className='instruction_con_form'>
                        <h4>How to Navigate To-Do List:</h4>
                        <ul>
                         <li>⌨️ Type the reward in the input box</li>
                         <li>🎁 Choose a reward's level based on the effort required. The rewards created later will have the same level until you choose a different level. </li>
                         <li>➡️ On the right, click the buttons to sort the reward, if you click twice the same button, it will show all rewards.</li>
                         <li>❌ If a reward is no longer needed, just hit the delete button.</li>
                           <li>🔙 Click the link under the Task list to return to the dashboard.</li>
                        </ul>
                       
                    </div> 
            </div>

            <div className="list-container">
                
                {/* reward List */}
                    <h1 className="header">reward List</h1>
                    <div className="filter-buttons">
                        <button
                            className={filterLevel === 'small' ? 'active-filter' : ''}
                            onClick={() => filterRewardsByLevel('small')}
                        >
                            Small
                        </button>
                        <button
                            className={filterLevel === 'medium' ? 'active-filter' : ''}
                            onClick={() => filterRewardsByLevel('medium')}
                        >
                            Medium
                        </button>
                        <button
                            className={filterLevel === 'large' ? 'active-filter' : ''}
                            onClick={() => filterRewardsByLevel('large')}
                        >
                            Large
                        </button>
                </div>
                <ul className="list">
                {filteredRewards.length === 0 && <div>No Rewards</div>}
                {filteredRewards.map((reward) => (
                <li key={reward.reward_id}>
                    <label>{reward.reward_name}</label>
                    <button onClick={() => deleteReward(reward.reward_id)} className="delete-btn">
                        Delete
                    </button>
                </li>

                ))}
                </ul>
                <a href="/dashboard" className="return-link">
                Return
                </a>
            </div>
        </div>
    </div>
  );
}

export default RewardMain
