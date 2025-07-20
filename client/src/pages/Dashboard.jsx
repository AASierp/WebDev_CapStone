import { useState, useEffect } from "react";
import LogOutBtn from "../components/LogOutBtn";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function getTasks() {
      try {
        const response = await fetch("http://localhost:3000/api/tasks", {
          credentials: "include",
        });
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Had an issue fetching tasks");
      }
    }

    getTasks();
  }, []);

  let backLogTasks = [];
  let inProgressTasks = [];
  let finishedTasks = [];

  if (tasks.lenght > 0) {
    backLogTasks = tasks.filter((task) => task.status === "backlog");
    inProgressTasks = tasks.filter((task) => task.status === "in-progress");
    finishedTasks = tasks.filter((task) => task.status === "finished");
  }

  let backlogContent;
  let inProgressContent;
  let finishedContent;

  if (backlogTasks.lenght === 0) {
    backlogContent = <p>No Tasks</p>;
  } else {
    backlogContent = [];
    for (let i = 0; i < backlogTasks.length; i++) {
      backlogContent.push(
        <TaskCard key={backLogTasks[i].id} task={backlogTasks[i]} />
      );
    }
  }

  if (inProgressTasks === 0) {
    inProgressContent = <p>No Tasks</p>;
  } else {
    inProgressContent = [];
    for (let i = 0; i < inProgressTasks.length; i++) {
      inProgressContent.push(
        <TaskCard key={inProgressTasks[i].id} task={inProgressTasks[i]} />
      );
    }
  }

  if (finishedTasks.lenght === 0) {
    finishedContent = <p>No Tasks</p>;
  } else {
    for (let i = 0; i < finishedTasks.length; i++) {
      finishedContent.push(
        <TaskCard key={finishedTasks[i].id} task={finishedTasks[i]} />
      );
    }
  }

  return (
    <div className="main-container">
      <h2>Dashboard</h2>

      <div className="columns-container">
        <div className="column">
          <h3>Backlog</h3>
          {backlogContent}
        </div>
        <div className="column">
          <h3>In Progress</h3>
          {inProgressContent}
        </div>
        <div className="column">
          <h3>Finished</h3>
          {finishedContent}
        </div>
      </div>

      <LogOutBtn />
    </div>
  );
}

export default Dashboard;
