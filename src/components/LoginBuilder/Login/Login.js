import React,{ useState } from "react";
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Row,Col} from 'antd';
import axios from "../../../axios";
import classes from "./Login.module.css";


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
const Login=(props)=>{

    const [form] = Form.useForm();
    const [sendingStatus,setSendingStatus]=useState(props.status);
    const [id,setId]=useState();

    const onFinishFailed = (errorInfo) => {
        let errors=form.getFieldsError();
        console.log(errors);
    };

    const onFinish = (values) => {
        console.log(values);
        setSendingStatus(true);
        axios.post( '/login',values )
            .then( response => {
                setSendingStatus(false);
                let idFromServer=response.data;
                setId(idFromServer["id"]);
                props.getId(idFromServer["id"]);
                console.log(idFromServer["id"]);
            } )
            .catch( error => {
                setSendingStatus(false);
                console.log("خطایی رخ داد");
            } );
    };

    return (

        <div className={classes.cntr}>

        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <div className={classes.sectionForm}>
            <Row>
                <Form.Item
                    name="username"
                    label="نام کاربری"
                    rules={[
                        {
                            required: true,
                            message: 'نام کاربری را وارد کنید!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="نام کاربری" />
                </Form.Item>
            </Row>
            <Row>
                <Form.Item
                    name="password"
                    label="کلمه عبور"
                    rules={[
                        {
                            required: true,
                            message: 'کلمه عبور را وارد کنید!',
                        
                        },
                    ]}
                >
                    <Input 
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="کلمه عبور"/>
                </Form.Item>
            </Row>
            <Form.Item {...tailLayout}>
                <Button style={{marginLeft:"8px"}}  >
                    ثبت نام
                </Button>
                <Button loading={sendingStatus} className={classes.submitButton} type="primary" htmlType="submit">
                    ورود
                </Button>
            </Form.Item>
            </div>
            
        </Form>
   
        </div>

    );

}

export default Login;
