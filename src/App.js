import { useState } from 'react';
import './App.css';
import useFetch from './useFetch';


function App() {


  const url = "http://localhost:8000/tasks/"
  const { data, isPending, error, isDataUpdated, setIsDataUpdated } = useFetch(url);

  const handleDelete = (id) => {
    fetch(url + id, { method: "DELETE" })
      .then(()=>{
        setIsDataUpdated(!isDataUpdated);
      }
    );
  }
  // Handle when checkbox is ticked
  const handleStatusUpdate = (task) => {
    fetch(url + task.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !task.status })
    }).then(() => {
      setIsDataUpdated(!isDataUpdated);
    })
  }


  const [editId, setEditId] = useState(0);
  const [editContent, setEditContent] = useState();
  const [editDeadline, setEditDeadline] = useState();
  
  const enterEditMode = (task) => {
    setEditId(task.id);
    setEditContent(task.content);
    setEditDeadline(task.deadline);
    // Trying to convert the div inside to a text area and then updating the shit out of it
  }

  const exitEditMode = (task) =>{
    fetch(url + task.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent, deadline: editDeadline })
    }).then(() => {
      setEditId(-1);
      setIsDataUpdated(!isDataUpdated);
    })
  }

  const addNewTask = ()=>{
    const task = {status:0, content: "enter content", deadline: "enter deadline"};
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    }).then((response) => {
      if(!response.ok){
        console.log("Error in posting data");
      }
      return response.json();
    }).then((newTask)=>{
      setIsDataUpdated(!isDataUpdated);
      enterEditMode(newTask);
    })
  }

  return (
    <ul className='list'>
      {isPending && <div>Loading...</div>}
      {error && <div hidden={true}>Error: {error}</div>}
      {data && data.map(task => (
        <li key={task.id}>
          <div className="status">
            <input
              type="checkbox"
              id="stat"
              checked={task.status}
              onChange={(e) => { handleStatusUpdate(task); }}
              disabled={editId === task.id || task.id === 1}
            />
          </div>

          {editId !== task.id && <div className="content" style={task.status ? { textDecoration: "line-through" } : {}}>
            {task.content}
          </div>}
          { editId === task.id && <input 
            className="content" 
            style={task.status ? { textDecoration: "line-through" } : {} }
            value = {editContent}
            onChange={(e)=>{setEditContent(e.target.value);}}
          />}

          {editId !== task.id && <div className="time" style={task.status ? { textDecoration: "line-through" } : {}}>
            {task.deadline}
          </div>}
          { editId === task.id && <input 
            className="time" 
            style={task.status ? { textDecoration: "line-through" } : {} }
            value = {editDeadline}
            onChange={(e)=>{setEditDeadline(e.target.value);}}
          />}
          
          <button 
            className="edit" 
            onClick={editId !== task.id ? () => { enterEditMode(task) } : ()=>{exitEditMode(task)}}
            disabled={task.id===1}>
              {editId === task.id ? "Done" : "Edit"}
            </button>
          <button className="delete" onClick={() => handleDelete(task.id)}  disabled={task.id===1}>Del</button>
        </li>
      ))}
      <li><button id='addTask' onClick={addNewTask}>ADD TASK</button></li>

    </ul>
  );
}

export default App;
