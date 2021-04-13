import React,{ useState } from "react";
import Auxx from "../../hoc/Auxx/Auxx";
import Login from "./Login/Login";
import Authenticate from "./Authenticate/Authenticate";
import classes from "./LoginBuilder.module.css";
import {useHistory,Route,Redirect } from "react-router-dom";
import UserContext from '../../Context/Context';


const LoginBuilder=()=>{
    
    const [id,setId]=useState();
    const [authKey,setAuthKey]=useState(null);
    const context = React.useContext(UserContext);

    let frame=null;

    const getIdFromServer=(idFromServer)=>{
        setId(idFromServer);
    }

    const getAuthKeyFromServer=(authKeyFromServer)=>{
        setAuthKey(authKeyFromServer);
        context.addUserData(authKeyFromServer);
        localStorage.setItem("token",authKeyFromServer["token"]);
    }

    frame=(<Login getId={(id)=>getIdFromServer(id)}/>);
    if(id)
        frame=(<Authenticate getAuthKey={(authKey=>getAuthKeyFromServer(authKey))} id={id}/>);
    
    if(authKey!==null){
        frame=
            <Route
            exact
            path="/"
            render={() => {
                return (
                    <Redirect to="/dashboard/hoghoghi" /> 
                )
            }}
        />
    }

    return(
        <Auxx>
                {frame}
        </Auxx>
    );
}

export default LoginBuilder;