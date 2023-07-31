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

  if (!userFetched) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page_container">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="new-item-form">
          <h2>New Task</h2>
          <div className="form-row">
            <span>
              <input value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} type="text" id="task" />
            </span>
          </div>
          <div className="btnFormContainer">
            <button className="levelSbtn" onClick={() => setSelectedLevel('small')}>
              Small
            </button>
            <button className="levelMbtn" onClick={() => setSelectedLevel('medium')}>
              Medium
            </button>
            <button className="levelLbtn" onClick={() => setSelectedLevel('large')}>
              Large
            </button>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button className="add-btn">Add</button>
        </form>
      </div>

      <div className="list-container">
        <h1 className="header">Task List</h1>
        <ul className="list">
          {tasks.length === 0 && <div>No Tasks</div>}
          {tasks.map((task) => (
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
  );
};

export default TodolistMain;
