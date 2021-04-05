import React,{ useState } from "react";
import AddPerson from "./ListPerson/AddPerson";
import classes from "./AddPersonBuilder.module.css";


const AddPersonBuilder=()=>{
    const [sending]=useState(false);

    const formHandler=(status)=> {
        this.setState({sending:status});
    }
        let form=<AddPerson status={sending} sending={(status)=>formHandler(status)}/>;
        return (
            <div className={classes.div}>
                {form}
            </div>
        );
}

export default AddPersonBuilder;