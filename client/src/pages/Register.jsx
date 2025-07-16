import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Btn from "../components/SubmitButton";


function Register() {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [error, setError] = useState('')
const [message, setMessage] = useState('');
const navigate = useNavigate();

const submission =  async (e) => {
  e.preventDefault();
  setError('')
  setMessage('')

  if(password !== confirmPassword){
    setError('Passwords do not match');
    return;
  }

  try{
    const response = await fetch("http://localhost:3000/api/register", {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({email: email, password: password})
    });

    if(response.ok){
      console.log('Registration Complete');
      navigate('/dashboard');
    }
    else{
      const data = await response.text();
      setError(data);
    }

  }
  catch(error){
    console.log("Something has gone amiss");
    setError("Error, please retry at a later time");
  }

}

  return (
   <div className = "container-register">
      <h2>Registation Form</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      
    <form onSubmit={submission}>
      <div>
        <label>Email</label>
        <input type = 'email' placeholder="email" required value = {email} onChange = {(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type = "password" placeholder="password" required value = {password} onChange = {(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Confirm Password</label>
        <input type = "password" placeholder="confirm password" required value = {confirmPassword} onChange = {(e) => setConfirmPassword(e.target.value)} />
      </div>
      <Btn type="submit" name ="Register" />
    </form>
   </div>
    
  );
}

export default Register;