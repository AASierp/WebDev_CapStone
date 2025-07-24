import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Btn from "../components/SubmitButton";
import logo from "../images/logo_welcome.png";

function Register() {
  //useState 'Hooks' (All 'Hooks' can only be used inside function components, not class components);
  //hooks cannot be nested, they need to be called at the top of the function and execute in the order that they
  //are called. const [currentState, Function that updates currentState] = useState(can pass initial state here, or a fn);
  //the variables are set via destructuring here.

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  //a function for the submission of the form data
  const submission = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    //regex validation for username
    function validateUserName(username) {
      const rxPattern = /^[a-zA-Z0-9]{5,15}$/;
      return rxPattern.test(username);
    }

    if (!validateUserName(username)) {
      return setError(
        "User Name must consist of only letters and numbers and be between 5-15 characters in length (inclusive)"
      );
    }

    //if password and confirmation are not the same, set error and return
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      //making a post req to send data to backend - once data recieved, it will be processed and saved to db.
      //password will be hashed prior to being stored, user will be assigned an id.
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          username: username,
        }),
      });

      if (response.ok) {
        console.log("Registration Complete");
        navigate("/");
      } else {
        const data = await response.text();
        setError(data);
      }
    } catch (error) {
      console.log("Something has gone amiss");
      setError("Error, please retry at a later time");
    }
  };

  return (
    //simple form that takes email/password/password confirmation
    <>
      <img src={logo} alt="Dark Logo" className="logo-img" />
      <div className="container-register">
        <h2>Registation Form</h2>

        {/*THIS IS AN AI GENERATED ERROR DISPLAY - example of shortcircuiting(if(Truthy/Falsey) 'error' has value then display X)*/}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={submission}>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>User Name</label>
            <input
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="confirm password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Btn type="submit" name="Register" />
        </form>
      </div>
    </>
  );
}

export default Register;
