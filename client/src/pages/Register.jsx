
import { Navigate } from "react-router-dom";
import { useState } from 'react';
import Btn from "../components/Button";


function Register() {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [error, setError] = useState('')

const submission =  async (e) => {
  e.preventDefault();
  setError('')
}

  return (
   <div className = "container-register">
      <h2>Registation Form</h2>
    <form onSubmit={submission}>
      <div>
        <label>Email</label>
        <input type = 'email' required value = {email} onChange = {(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type = "password" required value = {password} onChange = {(e) => setPassword(e.target.vlaue)} />
      </div>
      <div>
        <label>Confirm Password</label>
        <input type = "confirmPassword" required value = {confirmPassword} onChange = {(e) => setConfirmPassword(e.target.value)} />
      </div>
      <Btn type="submit" name ="Register"/>
    </form>
   </div>
    
  );
}

export default Register;