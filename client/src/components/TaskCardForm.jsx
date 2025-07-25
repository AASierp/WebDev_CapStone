import { useState } from "react";
import Btn from "./SubmitButton";

function AddTaskForm({ onAdd, status }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title,
          description: description,
          status: status,
        }),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        onAdd();
      } else {
        console.error("can't add task");
      }
    } catch (error) {
      console.error("Server Error");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea className="description"
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Btn type="Submit" name="Add" />
    </form>
  );
}

export default AddTaskForm;
