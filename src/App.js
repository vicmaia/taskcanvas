import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import "./App.css";

const BASE_URL = "http://localhost:4000";

function App() {
   // State to store tasks grouped by status
  const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });
  const [newTaskText, setNewTaskText] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");

  // Fetch tasks on component mount
  useEffect(() => {
    axios.get(`${BASE_URL}/tasks`).then((res) => {
      const grouped = { todo: [], doing: [], done: [] };
      res.data.forEach((task) => {
        grouped[task.status].push(task);
      });
      setTasks(grouped);
    });
  }, []);

  // Handle drag and drop between columns
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = Array.from(tasks[source.droppableId]);
    const [movedTask] = sourceList.splice(source.index, 1);
    const destList = Array.from(tasks[destination.droppableId]);
    movedTask.status = destination.droppableId;
    destList.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList
    });

    // Persist status change to backend
    axios.patch(`${BASE_URL}/tasks/${movedTask._id}`, {
      status: movedTask.status
    });
  };

  // Add new task to "todo" column
  const addTask = () => {
    if (!newTaskText.trim()) return;
    axios
      .post(`${BASE_URL}/tasks`, {
        text: newTaskText.trim(),
        status: "todo"
      })
      .then((res) => {
        setTasks((prev) => ({
          ...prev,
          todo: [...prev.todo, res.data]
        }));
        setNewTaskText("");
      });
  };

  // Delete task by ID and remove from local state
  const deleteTask = (taskId, status) => {
    axios.delete(`${BASE_URL}/tasks/${taskId}`).then(() => {
      setTasks((prev) => ({
        ...prev,
        [status]: prev[status].filter((t) => t._id !== taskId)
      }));
    });
  };

  // Get AI suggestion
  const getAiSuggestion = () => {
    const allTasks = [...tasks.todo, ...tasks.doing, ...tasks.done];
    axios
      .post(`${BASE_URL}/ai/suggest`, { tasks: allTasks })
      .then((res) => setAiSuggestion(res.data.suggestion))
      .catch(() => setAiSuggestion("Could not fetch suggestion right now."));
  };

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress" },
    { id: "done", title: "Completed" }
  ];

  return (
    <div className="App">
      <h1>TaskCanvas</h1>

      <div className="add-task">
        <input
          type="text"
          placeholder="New task"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
        <button className="suggest-btn" onClick={getAiSuggestion}>🤖 Suggest Task</button>
        {aiSuggestion && (
          <div className="ai-suggestion">
            <p>{aiSuggestion}</p>
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {columns.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2>{column.title}</h2>
                  {tasks[column.id].map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(provided) => (
                        <div
                          className="task"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span>{task.text}</span>
                          <button
                            className="delete-btn"
                            onClick={() => deleteTask(task._id, column.id)}
                            title="Delete task"
                          >
                            ❌
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;