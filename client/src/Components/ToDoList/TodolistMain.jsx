import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../App.css';

const TodolistMain = () => {
  const [newTaskName, setNewTaskName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userFetched, setUserFetched] = useState(false);

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const response = await axios.get('http://localhost:3002/dashboard', { withCredentials: true });
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
    if (!newTaskName.trim()) return;

    try {
      const response = await axios.post('http://localhost:3002/todolistMain', {
        task_name: newTaskName,
        task_level: 'normal',
        status: 'todo',
        task_creator_id: userId,
      });
      setTasks([...tasks, response.data]);
      setNewTaskName('');
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
    <div>
      <form onSubmit={handleSubmit} className="new_item_form">
        <div className="form-row">
          <label htmlFor="task">New Task</label>
          <input value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} type="text" id="task" />
              </div>
            
        <button className="btn">Add</button>
      </form>

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
            <button onClick={() => deleteTask(task.task_id)} className="btn btn-danger">
              Delete
            </button>
          </li>
        ))}
      </ul>
      <a href="/dashboard">Return</a>
    </div>
  );
};

export default TodolistMain;
