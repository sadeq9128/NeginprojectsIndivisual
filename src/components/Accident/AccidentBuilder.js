import React,{ useState } from "react";
import AccidentList from "./AccidentList/AccidentList";
import AccidentCreate from "./AccidentCreate/AccidentCreate";
import classes from "./AccidentBuilder.module.css";
import UserContext from '../../Context/Context';


const AccidentBuilder=()=>{
    const [createItem,setCreateItem]=useState(false);
    const formHandler=(status)=> {
        setCreateItem(status);
    }
    let page=<AccidentList status={createItem} formHandler={formHandler}/>;
    if(createItem){
        //setCreateItem(false);
        page=
            <UserContext.Consumer>
            {
                (userData)=>{
                    return (
                        <AccidentCreate userData={userData} status={createItem} formHandler={formHandler}/>
                    )
                }
            }
            </UserContext.Consumer>

    }
    return (
        <div className={classes.div}>
            {page}
        </div>
    );
}

export default AccidentBuilder;