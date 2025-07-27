import { useState } from "react";
import Btn from "./SubmitButton";

function TaskCard({ task, update, deleteTask }) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  async function handleDelete() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${task.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        deleteTask(task.id);
      } else {
        console.error("could not delete task");
      }
    } catch (error) {
      console.error("server error", error);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${task.id}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: title,
            description: description,
            status: task.status,
          }),
        }
      );

      if (response.ok) {
        update();
        setEdit(false);
      } else {
        console.error("Could not upate task");
      }
    } catch (error) {
      console.error("server error", error);
    }
  }

  function handleDragStart(event) {
    //stores data to be transferred during drag and drop
    event.dataTransfer.setData("application/json", JSON.stringify(task));
    //set the allowed drop effect
    event.dataTransfer.effectAllowed = "move";
  }

  let content;

  if (edit) {
    content = (
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={title}
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          value={description}
          placeholder="description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <Btn type="submit" name="save" />
      </form>
    );
  } else {
    content = (
      <div draggable="true" onDragStart={handleDragStart}>
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <button className="edit-btn" onClick={() => setEdit(true)}>
          Edit
        </button>
        <button className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
    );
  }

  return <div className="task-card">{content}</div>;
}

export default TaskCard;
