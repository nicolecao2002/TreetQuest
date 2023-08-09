// TodolistMain.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ToDoList.css';

const TodolistMain = () => {
  const [newTaskName, setNewTaskName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userFetched, setUserFetched] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [ filterLevel, setFilterLevel ] = useState( null );
  const [taskLevelMessage, setTaskLevelMessage] = useState(''); 

  useEffect(() => {
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
      fetchTasks(userId);
    }
  }, [userId, userFetched]);

  async function fetchTasks(userId) {
    try {
      console.log('Fetching tasks for user ID:', userId);
      const response = await axios.get(`http://localhost:3002/todolistMain?userId=${userId}`, {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newTaskName.trim()) {
      setErrorMessage('Task name cannot be empty.');
      return;
    }

    if (!selectedLevel) {
      setErrorMessage('Please select a task level.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3002/todolistMain', {
        task_name: newTaskName,
        task_level: selectedLevel,
        status: 'todo',
        task_creator_id: userId,
      });
      setTasks([...tasks, response.data]);
      setNewTaskName('');
      // Clear the error message if there was no error
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  async function toggleTask(id, status) {
    try {
      const newStatus = status === 'todo' ? 'completed' : 'todo';
      await axios.put(`http://localhost:3002/todolistMain/${id}`, { status: newStatus });
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.task_id === id ? { ...task, status: newStatus } : task))
      );
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  }

  async function deleteTask(id) {
    try {
      await axios.delete(`http://localhost:3002/todolistMain/${id}`);
      setTasks((currentTasks) => currentTasks.filter((task) => task.task_id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  const filterTasksByLevel = (level) => {
    if (level === filterLevel) {
      setFilterLevel(null);
    } else {
      setFilterLevel(level);
    }
  };

  const filteredTasks = filterLevel ? tasks.filter((task) => task.task_level === filterLevel) : tasks;

  if (!userFetched) {
    return <div>Loading...</div>;
  }
 

  return (
      <div className="page_container">
          <div className='two_container'>
              <div className="form-container">
                 
                <form onSubmit={handleSubmit} className="new-item-form">
                <h2>New Task</h2>
                <div className="form-row">
                    <span>
                    <input value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} type="text" id="task" />
                    </span>
                </div>
                <div className="btnFormContainer">
                    <button
                    type="button"
                        className={`levelSbtn ${selectedLevel === 'small' ? 'active-filter' : ''}`}
                        onClick={() => setSelectedLevel('small')}
                        >
                        Small
                        </button>
                        <button
                        type="button"
                        className={`levelMbtn ${selectedLevel === 'medium' ? 'active-filter' : ''}`}
                        onClick={() => setSelectedLevel('medium')}
                        >
                        Medium
                        </button>
                        <button
                        type="button"
                        className={`levelLbtn ${selectedLevel === 'large' ? 'active-filter' : ''}`}
                        onClick={() => setSelectedLevel('large')}
                        >
                        Large
                          </button>
                          
                      </div>
                       <div className="selected_level">
                    {selectedLevel ? `Selected Level: ${selectedLevel}` : ''}
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                      <button className="add-btn">Add</button>
                 </form>
                  <div className='instruction_con_form'>
                        <h4>How to Navigate To-Do List:</h4>
                        <ul>
                        <li>⌨️ Type the task in the input box</li>
                          <li>📚 Choose the task's level based on the effort required. The tasks created later will have the same level until you choose a different level. </li>
                           <li>➡️ On the right, click the buttons to sort the tasks, if you click twice the same button, it will show all tasks.</li>
                         <li>✅ When you complete the task, click the check box.</li>
                         <li>❌ If a task is no longer needed, just hit the delete button.</li>
                           <li>🔙 Click the link under the Task list to return to the dashboard.</li>
                        </ul>
                       
                    </div> 
            </div>

            <div className="list-container">
                
                {/* Task List */}
                    <h1 className="header">Task List</h1>
                    <div className="filter-buttons">
                        <button
                            className={filterLevel === 'small' ? 'active-filter' : ''}
                            onClick={() => filterTasksByLevel('small')}
                        >
                            Small
                        </button>
                        <button
                            className={filterLevel === 'medium' ? 'active-filter' : ''}
                            onClick={() => filterTasksByLevel('medium')}
                        >
                            Medium
                        </button>
                        <button
                            className={filterLevel === 'large' ? 'active-filter' : ''}
                            onClick={() => filterTasksByLevel('large')}
                        >
                            Large
                        </button>
                </div>
                <ul className="list">
                {filteredTasks.length === 0 && <div>No Tasks</div>}
                {filteredTasks.map((task) => (
                    <li key={task.task_id}>
                    <label>
                        <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => toggleTask(task.task_id, task.status)}
                        />
                        {task.task_name}
                    </label>
                    <button onClick={() => deleteTask(task.task_id)} className="delete-btn">
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
};

export default TodolistMain;
