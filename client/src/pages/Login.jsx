import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Btn from "../components/Button";


function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submission = async (element) => {
        element.preventDefault();
        setError('')

        try{
           console.log(`${email} logged in`)
            navigate("/dashboard");
        }
        catch(error){
            setError("An account with those credentials does not exist.");
        }
    };


    return(

        <div className = "container-login">
            <h2>Login</h2>

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

            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>Please click <Link to="/register">HERE</Link> to create an account</p>
        </div>

    );
}

export default Login;