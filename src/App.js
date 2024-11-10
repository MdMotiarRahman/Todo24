import React, { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import Row from './components/Row';

const url = "http://localhost:3001"

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

    // Fetch tasks from backend when the component mounts
    useEffect(() => {
      axios.get(url).then(
        response => {
          setTasks(response.data)
        }).catch(error =>{
          alert(error.response.data.error ? error.response.data.error : error)
        })
      
    }, []);

    // Add new task to backend
    const addTask = () => {
        axios.post(url+'/create', {
           description: task 
        }).then(response =>{
            setTasks([...tasks, {id: response.data.id, description: task}]);
            setTask('')
        }).catch (error => {
          alert(error.response.data.error ? error.response.data.error : error)
        })
    };

    // Delete task from backend
    const deleteTask = async (id) => {
        axios.delete(url+'/delete/'+id).then(response =>{
          const withoutRemoved = tasks.filter((item) => item.id !== id)
          setTasks(withoutRemoved)
        }).catch (error => {
          alert(error.response.data.error ? error.response.data.error : error)
        })
    };



    return (
        <div>
            <h1>Task List</h1>
            <form>
              <input
                type="text"
                value={task}
                onChange= {e => setTask(e.target.value)}
                onKeyDown={e => {
                  if(e.key === "Enter"){
                    e.preventDefault()
                    addTask()
                  }
                }}
                placeholder="Add a new task"
              />
            </form>

            <ul>
                {
                  tasks.map(item => (
                      <Row key={item.id} item={item} deleteTask={deleteTask} />
                  ))
                }
            </ul>
        </div>
    );
}

export default App;