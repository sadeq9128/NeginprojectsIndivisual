import React,{ useState } from "react";
import TaminForm from "./Tamin/TaminForm";
import classes from "./TaminBuilder.module.css";


const TaminBuilder=()=>{
    const [sending]=useState(false);

    const formHandler=(status)=> {
        this.setState({sending:status});
    }
        let form=<TaminForm status={sending} sending={(status)=>formHandler(status)}/>;
        return (
            <div className={classes.div}>
                {form}
            </div>
        );
}

export default TaminBuilder;