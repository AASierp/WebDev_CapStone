import { Navigate } from "react-router-dom";

function Btn({type, name}){
    return(
        <button type = {type}>{name}</button>
    );
}

export default Btn; 