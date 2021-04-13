import React,{ useState,useEffect } from "react";
import { Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {Row} from 'antd';
import axios from "../../../axios";
import classes from "./Authenticate.module.css";


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

    const onFinish = (values) => {
        values["id"]=id;
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
                console.log("خطایی رخ داد");
            } );
    };
    const user = {
        fullName: 'Mostafa Jafari',
        avatar: "https://avatars2.githubusercontent.com/u/6865268?s=460&v=4",
}
    let resendCode=null;
    if(minutes === 0 && seconds===0){
        resendCode=(<a onClick={sendCode}>ارسال مجدد کد تایید</a>);
    }else{
        resendCode=
        (<div>
        { minutes === 0 && seconds === 0
            ? null
            : <h3>ارسال کد جدید تا  {minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</h3> 
        }
        </div>);
    }

    return (
        <div className={classes.cntr}>
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
            <div className={classes.sectionForm}>
            <Row>
                <Form.Item
                    name="code"
                    label="کد تایید"
                    rules={[
                        {
                            required: true,
                            message: 'کد تایید را وارد کنید',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="کد تایید" />
                </Form.Item>
            </Row>
                
            <Form.Item {...tailLayout}>
                {resendCode}
                <Button loading={sendingStatus} className={classes.submitButton} type="primary" htmlType="submit">
                    ثبت
                </Button>
            </Form.Item>
        </div>
            
        </Form>
        </div>
    );

}

export default Authenticate;
