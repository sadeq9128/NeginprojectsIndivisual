import React,{ useState } from "react";
import AccidentList from "./AccidentList/AccidentList";
import AccidentCreate from "./AccidentCreate/AccidentCreate";
import classes from "./AccidentBuilder.module.css";
import UserContext from '../../Context/Context';


const AccidentBuilder=()=>{
    const [createItem,setCreateItem]=useState(false);
    const [data,setData]=useState(null);
    const formHandler=(status,data)=> {
        setCreateItem(status);
        setData(data);
    }
    let page=<AccidentList status={createItem} formHandler={formHandler}/>;
    if(createItem){
        //setCreateItem(false);
        page=
            <UserContext.Consumer>
            {
                (userData)=>{
                    return (
                        <AccidentCreate data={data} userData={userData} status={createItem} formHandler={formHandler}/>
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