import { Navigate } from "react-router-dom";

function Btn({type, name}){
    return(
        <button type = {type} onClick= {() => alert('Please Check you Email for confirmation')}>{name}</button>
    );
}

export default Btn; 