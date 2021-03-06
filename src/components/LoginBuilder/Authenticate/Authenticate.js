import React,{ useState,useEffect } from "react";
import { Form, Input, Button, Steps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {Row} from 'antd';
import axios from "../../../axios";
import classes from "./Authenticate.module.css";
import "./Authenticate.css";
import logo from "../../../assets/Logo.png";
import holes from "../../../assets/Holes.png";
import smsPhone from "../../../assets/SmsPhone.png";
import logoCompany from "../../../assets/LogoBime.png";
import { SizeContextProvider } from "antd/lib/config-provider/SizeContext";


const { Step } = Steps;
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 15,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 6,
        span: 18,
    },
};

const Authenticate=(props)=>{

    const [form] = Form.useForm();
    const [sendingStatus,setSendingStatus]=useState(props.status);
    const [authKey,setAuthKey]=useState(null);
    const [id]=useState(props.id);
    const {initialMinute = 0,initialSeconds = 59} = props;
    const [ minutes, setMinutes ] = useState(initialMinute);
    const [seconds, setSeconds ] =  useState(initialSeconds);
    const [resend,setResend]=useState(true);
    
    useEffect(()=>{
        let myInterval;
        if(resend){
            myInterval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds((seconds)=>seconds - 1);
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        setResend(false);
                    } else {
                        setMinutes((minutes)=>minutes - 1);
                        setSeconds(59);
                    }
                } 
            }, 1000)
        }
        return ()=> {
            clearInterval(myInterval);
        };
    },[resend,seconds]);

    const sendCode=()=>{
        setResend(true);
        setSeconds(59);
        setMinutes(0);
    }

    const submitForm = () => {
        let values=form.getFieldsValue();
        values["id"]=id;
        values["code"]=code;
        console.log(values);
        console.log(values);
        setSendingStatus(true);
        axios.post( '/login/verify',values )
            .then( response => {
                setSendingStatus(false);
                setResend(false);
                setSeconds(0);
                setMinutes(0);
                setAuthKey(response.data);
                props.getAuthKey(response.data);
            } )
            .catch( error => {
                setSendingStatus(false);
                console.log("?????????? ???? ??????");
            } );
    };
    let code=0;
    const setCode=(e)=>{
        code=e.target.value;
    }

    const user = {
        fullName: 'Mostafa Jafari',
        avatar: "https://avatars2.githubusercontent.com/u/6865268?s=460&v=4",
}
    let resendCode=null;
    if(minutes === 0 && seconds===0){
        resendCode=(<a onClick={sendCode}>?????????? ???????? ???? ??????????</a>);
    }else{
        resendCode=
        (<div>
        { minutes === 0 && seconds === 0
            ? null
            : <h4>?????????? ???? ???????? ????  {minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</h4> 
        }
        </div>);
    }

    return (
        <div className={classes.cntr}>

            <div className={classes.lefthand}>
                <h3>?????? ??????</h3>
                <Steps className={classes.antSteps} size="small" current={2}>
                    <Step className={classes.antSteps} title="?????????????? ??????????" />
                    <Step className={classes.antSteps} title="?????????? ??????????????" />
                    <Step className={classes.antSteps} title="???????????? ????????" />
                    <Step className={classes.antSteps} title="?????????? ?????? ??????" />
                </Steps>
                <img src={smsPhone} className={classes.smsPhone}/>
                <h5>???? ?????????? ?????? ???? ?????????? 09133959128 ???? ???????? ????????</h5>
                <Form form={form} name="control-hooks" onFinish={submitForm}>
                    <div className={classes.sectionForm}>
                        <Form.Item
                            name="code"
                            label="???? ??????????"
                            rules={[
                                {
                                    required: true,
                                    message: '???? ?????????? ???? ???????? ????????',
                                },
                            ]}
                        >
                            <Input onChange={(e)=>setCode(e)} placeholder="???? ??????????" />
                            <h3><a>?????????? ??????????</a></h3>
                        </Form.Item>
                    </div>
                </Form>
                {resendCode}
                <div>
                    <Button className={classes.submitButton} htmlType="submit">
                        ????????????
                    </Button>
                    <Button className={classes.submitButton} type="primary" onClick={submitForm}>
                        ??????
                    </Button>
                </div>

            </div>

            <div className={classes.righthand}>
                <img src={holes} className={classes.holes}/>
                <img src={holes} className={classes.holesSecond}/>
                <img src={logo} className={classes.logo}/>
                <h3 className={classes.hthree}>???? ?????????? ?????????????? ?????? ???????? ?????? ??????????</h3>
                <h2 className={classes.htwo}>???????? ?????? <a href=""><u>?????????? ??????????????</u></a> ?????? ?????? ????????</h2>
                <div className={classes.info}>
                    <span>?????????? ?? ???????? ???????? ???????? ???????? ???????? ?????? ????????- ???????????? 99<img src={logoCompany} className={classes.logoCompany}/></span>
                </div>
            </div>
        
        </div>
    );

}

export default Authenticate;
