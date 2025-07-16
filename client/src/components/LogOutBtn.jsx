import { useNavigate } from "react-router-dom";


function LogOutBtn(){
    const navigate = useNavigate();
    const logout = async () => {

        try{
            const response = await fetch("http://localhost:3000/api/logout", {
                method: 'POST',
                credentials: 'include'
            });

            if(response.ok){
                console.log('Logged Out')
                navigate('/');
            }
            else{
                console.log('logout failed')
            }
        }
        catch(error){
            console.log("error logging out");
        }
    };

    return (
        <button onClick = {logout}>Log Out</button>
    );
}

export default LogOutBtn;