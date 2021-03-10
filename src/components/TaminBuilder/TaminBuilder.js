import React,{ useState, useEffect } from "react";
import TaminForm from "./Tamin/TaminForm";
import classes from "./TaminBuilder.module.css";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const TaminBuilder=()=>{
    const [sending,setSending]=useState(false);

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