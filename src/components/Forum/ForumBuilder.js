import React,{ useState } from "react";
import ForumList from "./ForumList/ForumList";
import ForumCreate from "./ForumCreate/ForumCreate";
import classes from "./ForumBuilder.module.css";
import UserContext from '../../Context/Context';


const ForumBuilder=()=>{
    const [createItem,setCreateItem]=useState(false);
    const [data,setData]=useState(null);
    const formHandler=(status,data)=> {
        setCreateItem(status);
        setData(data);
    }
    let page=<ForumList status={createItem} formHandler={formHandler}/>;
    if(createItem){
        //setCreateItem(false);
        page=
            <UserContext.Consumer>
            {
                (userData)=>{
                    return (
                        <ForumCreate data={data} userData={userData} status={createItem} formHandler={formHandler}/>
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

export default ForumBuilder;