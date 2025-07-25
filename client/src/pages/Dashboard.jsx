import { useState, useEffect } from "react";
import LogOutBtn from "../components/LogOutBtn";
import TaskCard from "../components/TaskCard";
import AddTaskForm from "../components/TaskCardForm";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [backlogForm, setBacklogForm] = useState(false);
  const [inProgressForm, setInProgressForm] = useState(false);
  const [finishedForm, setFinishedForm] = useState(false);

  async function getTasks() {
    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.log("could not retieve task or task does not exist");
      }
    } catch (error) {
      console.error("Had an issue fetching tasks 8( ");
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  let backlogTasks = [];
  let inProgressTasks = [];
  let finishedTasks = [];

  if (tasks.length > 0) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].status === "backlog") {
        backlogTasks.push(tasks[i]);
      } else if (tasks[i].status === "in-progress") {
        inProgressTasks.push(tasks[i]);
      } else if (tasks[i].status === "finished") {
        finishedTasks.push(tasks[i]);
      }
    }
  }

  let backlogContent = [];
  if (backlogTasks.length === 0) {
    backlogContent = <p>No Tasks</p>;
  } else {
    for (let i = 0; i < backlogTasks.length; i++) {
      backlogContent.push(
        <TaskCard
          key={backlogTasks[i].id}
          task={backlogTasks[i]}
          update={getTasks}
          deleteTask={getTasks}
        />
      );
    }
  }

  let inProgressContent = [];
  if (inProgressTasks.length === 0) {
    inProgressContent = <p>No Tasks</p>;
  } else {
    inProgressContent = [];
    for (let i = 0; i < inProgressTasks.length; i++) {
      inProgressContent.push(
        <TaskCard
          key={inProgressTasks[i].id}
          task={inProgressTasks[i]}
          update={getTasks}
          deleteTask={getTasks}
        />
      );
    }
  }

  let finishedContent = [];
  if (finishedTasks.length === 0) {
    finishedContent = <p>No Tasks</p>;
  } else {
    for (let i = 0; i < finishedTasks.length; i++) {
      finishedContent.push(
        <TaskCard
          key={finishedTasks[i].id}
          task={finishedTasks[i]}
          update={getTasks}
          deleteTask={getTasks}
        />
      );
    }
  }

  let backlogFormContent = null;
  if (backlogForm) {
    backlogFormContent = (
      <div>
        <AddTaskForm status="backlog" onAdd={getTasks} />
        <button onClick={() => setBacklogForm(false)}>Cancel</button>
      </div>
    );
  }

  let inProgressFormContent = null;
  if (inProgressForm) {
    inProgressFormContent = (
      <div>
        <AddTaskForm status="in-progress" onAdd={getTasks} />
        <button onClick={() => setInProgressForm(false)}>Cancel</button>
      </div>
    );
  }

  let finishedFormContent = null;
  if (finishedForm) {
    finishedFormContent = (
      <div>
        <AddTaskForm status="finished" onAdd={getTasks} />
        <button onClick={() => setFinishedForm(false)}>Cancel</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="columns-container">
        <div className="column">
          <h3>Backlog</h3>
          <button onClick={() => setBacklogForm(true)}>Add Task</button>
          {backlogFormContent}
          {backlogContent}
        </div>

        <div className="column">
          <h3>In Progress</h3>
          <button onClick={() => setInProgressForm(true)}>Add Task</button>
          {inProgressFormContent}
          {inProgressContent}
        </div>

        <div className="column">
          <h3>Finished</h3>
          <button onClick={() => setFinishedForm(true)}>Add Task</button>
          {finishedFormContent}
          {finishedContent}
        </div>
      </div>

      <LogOutBtn />
    </div>
  );
}

export default Dashboard;
