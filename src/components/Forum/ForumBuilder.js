import React,{ useState } from "react";
import ForumList from "./ForumList/ForumList";
import classes from "./ForumBuilder.module.css";


const ForumBuilder=()=>{
    const [createItem,setCreateItem]=useState(false);
    const formHandler=(status,data)=> {
        setCreateItem(status);
    }
    let page=<ForumList status={createItem} formHandler={formHandler}/>;
    return (
        <div className={classes.div}>
            {page}
        </div>
    );
}

export default ForumBuilder;