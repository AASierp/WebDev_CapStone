import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Btn from "../components/SubmitButton";


function Login(){
    //setting state variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const submission = async (element) => {
        element.preventDefault();
        setError('')

        try{
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json'
                },
                body: JSON.stringify({email: email, password: password})
            });

            if(response.ok){
                navigate('/dashboard');
            }
            else{
                const data = await response.text();
                setError(data);
            }


        }catch(error){
            setError("An account with those credentials does not exist.");
        }
    };


    return(

        <div className = "container-login">
            <h2>Login</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={submission}>
                <div>
                    <label>Email</label>
                    <input type = "email" required value = {email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type = "password" required value = {password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <Btn type="submit" name="Login" />
            </form>

            <p>Please click <Link to="/register">HERE</Link> to create an account</p>
        </div>

    );
}

export default Login;