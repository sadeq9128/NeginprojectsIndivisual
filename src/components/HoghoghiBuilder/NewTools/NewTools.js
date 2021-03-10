import React,{ useState, useEffect } from "react";
import NewToolsForm from "./NewToolsForm";
import {Spin,Alert} from "antd";
import classes from "./NewTools.module.css";
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const NewTools=()=>{
    const [sending,setSending]=useState(false);

    const formHandler=(status)=> {
        this.setState({sending:status});
    }
        let form=<NewToolsForm status={sending} sending={(status)=>formHandler(status)}/>;
        if (sending){
            form=<div className={classes.div}>
                <LinearProgress className={classes.progress}/>
                <h3>در حال ارسال اطلاعات...</h3>
            </div>
        }
        return (
            <div className={classes.div}>
                {form}
            </div>
        );
}

export default NewTools;