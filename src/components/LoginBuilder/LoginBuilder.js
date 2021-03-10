import React,{ useState } from "react";
import Auxx from "../../hoc/Auxx/Auxx";
import Login from "./Login/Login";
import Authenticate from "./Authenticate/Authenticate";
import classes from "./LoginBuilder.module.css";
import {useHistory,Route,Redirect } from "react-router-dom";

const LoginBuilder=()=>{
    
    const [id,setId]=useState();
    const [authKey,setAuthKey]=useState(null);

    let frame=null;

    const getIdFromServer=(idFromServer)=>{
        setId(idFromServer);
    }

    const getAuthKeyFromServer=(authKeyFromServer)=>{
        setAuthKey(authKeyFromServer);
        console.log(authKeyFromServer["token"]);
        localStorage.setItem("token",authKeyFromServer["token"]);
    }

    frame=(<Login getId={(id)=>getIdFromServer(id)}/>);
    if(id)
        frame=(<Authenticate getAuthKey={(authKey=>getAuthKeyFromServer(authKey))} id={id}/>);

    
    let history = useHistory();
    if(authKey!==null){
        //history.push('/dahsboard');
        frame=<Route
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