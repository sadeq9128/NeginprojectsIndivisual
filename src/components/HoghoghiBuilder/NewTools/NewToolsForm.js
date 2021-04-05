import React,{ useState } from "react";
import { Form, Input, Button, Select, Switch, Upload,message  } from 'antd';
import { Typography } from 'antd';
import { Tabs } from 'antd';
import DatePick from "../customDatePicker/DatePick";
import { UploadOutlined } from '@ant-design/icons';
import 'moment/locale/fa';
import MaskedInput from "antd-mask-input";
import {Row,Col} from 'antd';
import axios from "../../../axios";
import classes from "./NewTools.module.css";
import validator from 'validator';


const { Text, Link } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 10,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 6,
        span: 10,
    },
};
const glue = {
    wrapperCol: {
        offset: 1,
        span: 5,
    },
};

const NewToolsForm=(props)=>{

    const [form] = Form.useForm();
    const [tabPosition]=useState('right');
    const [activeKey,setActiveKey]=useState("1");
    const [sendingStatus,setSendingStatus]=useState(props.status);
    const [nameCompany,setNameCompany]=useState("");
    const [id,setId]=useState();
    const [name,setName]=useState("نامشخص !!!");

    
    axios.defaults.headers.common = {'Authorization':localStorage.getItem("token")};
    console.log(localStorage.getItem("token"));

    // useEffect(() => {
    // },[props.sending]);

    const nextForm=()=>{
        setActiveKey("2");
    }

    const prevForm=()=>{
        setActiveKey("1");
    }

    const onChangeTab= activeKey => {
        setActiveKey(activeKey);
    };


    const onFinishFailed = (errorInfo) => {
        let errors=form.getFieldsError();
        console.log(errors);
        if (errors[0]['errors'].length!==0 || errors[1]['errors'].length!==0 || errors[2]['errors'].length!==0){
            setActiveKey("1");
        }
        else{
            setActiveKey("2");
        }
    };

    const onFinish = (values) => {
        values['user_id']=id;
        if(values['logo'])
        values['logo']=values['logo'][0]['originFileObj'];
        if(values['seal'])
        values['seal']=values['seal'][0]['originFileObj'];
        if(values['sign'])
        values['sign']=values['sign'][0]['originFileObj'];
        // console.log(values['seal'][0]['originFileObj']);
        console.log(values);
        setSendingStatus(true);
        axios.post( '/personnel/legal',values )
            .then( response => {
                setSendingStatus(false);
                console.log("با موفقیت انجام شد");
            } )
            .catch( error => {
                setSendingStatus(false);
                console.log("خطایی رخ داد");
            } );
    };

    const onReset = () => {
        form.resetFields();
    };

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
 
    const propsForUpload = {
        
        multiple: false,
        maxCount:1,
        beforeUpload: file => {
            const isLt80K = file.size <= 80*1024;
            if (!isLt80K) {
                message.error("حجم فایل نباید بیشتر از 80kb باشد");
                file.status="error"
                return false;
            }
            console.log(file.type + file.size)
            if (file.type !== 'image/png' && file.type !== 'image/jpg'&& file.type !== 'image/jpeg') {
                message.error(`${file.name} باید فرمت png/jpg داشته باشد`);
            }
            return file.type === 'image/png' || file.type === 'image/jpg'|| file.type !== 'image/jpeg';
        }
    };

    const nameOnChange=(e)=>{
        form.setFieldsValue({name:e.target.value.replace("شرکت","")});
    };

    const fetchManagerInf=(e)=>{

        axios.get(`/admin/personnel/lookup/${e.target.value}`).then(response=>{
            const code=response.data['id'];
            const name=response.data['first_name']+" "+response.data['last_name'];
            setId(code);
            setName(name);
            console.log(code);
        }
        ).catch(response=>{
            console.log("خطا در کد ملی مدیر");
            form.setFields([
                {
                name: "manager",
                errors: ["این کد ملی در سامانه ثبت نشده است"]
                }
            ]);
        });
    }

    const dateValidation=(e)=>{
        console.log(validator.isDate(e.target.value));
        if (!validator.isDate(e.target.value)) { 
            form.setFields([
                {
                    name: "register_date",
                    errors: ["تاریخ معتبر نیست"]
                }
            ]);
        }
    }

    const checkNationalId=(e)=>{
        
        if((e.target.value+"").length!==11) return;
        console.log(id);
        axios.get(`/admin/personnel/legal/check/nationalid/${e.target.value}`).then(response=>{
                const status=response.data;
                console.log(status);
                
            }
        ).catch(res=>(
            console.log("خطا در بررسی تکراری نبودن")
        ));
    }

    const checkFinancialCode=(e)=>{
        if(e.target.value+"".length!==12) return;
        axios.get(`/admin/personnel/legal/check/financecode/${e.target.value}`).then(response=>{
                const status=response.data;
                console.log(status);
            }
        ).catch(res=>(
            console.log("خطا در بررسی تکراری نبودن کد اقتصادی")
        ));
    }

    return (

        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} onFinishFailed={onFinishFailed}>
            
            <Text mark>نام و نام خانوادگی مدیر عامل: {name}</Text>
            <Tabs tabPosition={tabPosition} activeKey={activeKey} onChange={onChangeTab}>

                <TabPane tab="اطلاعات تماس" key="1">
                    <Row className={classes.sectionForm}>
                    <Col span={12}>
                        <Form.Item
                            name="phone"
                            label="شماره تلفن"
                            rules={[
                                {
                                    required: true,
                                    message: "شماره تلفن را وارد کنید!",
                                },
                                {
                                    pattern: /^(?:\d*)$/,
                                    message: "فقط عدد وارد کنید.",
                                },
                                {
                                    len:11,
                                    message: "شماره تلفن باید 11 رقم باشد."
                                }
                            ]}
                        >
                        <Input disabled={sendingStatus} placeholder="9123456789"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="postal_code"
                            label="کد پستی"
                            rules={[
                                {
                                    required: true,
                                    message: "کدپستی را وارد کنید!",
                                },
                                {
                                    pattern: /^(?:\d*)$/,
                                    message: "فقط عدد وارد کنید.",
                                },
                                {
                                    len:10,
                                    message: "شماره تلفن باید 11 رقم باشد."
                                }
                            ]}
                        >
                            <Input disabled={sendingStatus}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="ایمیل"
                            rules={[
                                {
                                    type:"email"
                                }
                            ]}
                        >
                            <Input disabled={sendingStatus}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="address"
                            label="آدرس"
                        >
                            <Input.TextArea disabled={sendingStatus}/>
                        </Form.Item>
                    </Col>
                    </Row>
                    <Form.Item {...tailLayout}>                 
                        <Button loading={sendingStatus} className={classes.submitButton} type="primary" htmlType="submit">
                            ثبت
                        </Button>
                        <Button disabled={sendingStatus} htmlType="button" onClick={onReset}>
                            بازنشانی
                        </Button>
                    </Form.Item>
                </TabPane>


                <TabPane tab="اطلاعات اولیه" key="2">
                    <Row className={classes.sectionForm}>
                    <Col span={12}>
                        <Form.Item
                            name="manager"
                            label="کدملی مدیرعامل"
                            rules={[
                                {
                                    required: true,
                                    message: "کدملی را وارد کنید!",
                                },
                                {
                                    pattern: /^(?:\d*)$/,
                                    message: "فقط عدد وارد کنید.",
                                },
                                {
                                    len:10,
                                    message: "کدملی باید 10 رقم باشد."
                                }
                            ]}
                        >
                            <Input disabled={sendingStatus} onBlur={(e)=>{fetchManagerInf(e)}}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="نام شرکت"
                            initialValue={nameCompany}
                            rules={[
                                {
                                    required: true,
                                    message: "نام شرکت را وارد کنید",
                                },
                            ]}
                        >
                            <Input disabled={sendingStatus} onChange={nameOnChange}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="national_id"
                            label="شناسه ملی یکتا"
                            rules={[
                                {
                                    required: true,
                                    message: "نام شرکت را وارد کنید",
                                },
                                {
                                    pattern: /^(?:\d*)$/,
                                    message: "فقط عدد وارد کنید.",
                                },
                                {
                                    len:11,
                                    message: "شناسه ملی باید 11 رقم باشد."
                                }
                            ]}
                        >
                            <Input disabled={sendingStatus} onBlur={(e)=>checkNationalId(e)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="finance_code"
                            label="کد اقتصادی یکتا"
                            rules={[
                                {
                                    required: true,
                                    message: "کداقتصادی را وارد کنید",
                                },
                                {
                                    pattern: /^(?:\d*)$/,
                                    message: "فقط عدد وارد کنید.",
                                },
                                {
                                    len:12,
                                    message: "کد اقتصادی باید 12 رقم باشد."
                                }
                            ]}
                        >
                            
                            <Input disabled={sendingStatus} onBlur={(e)=>checkFinancialCode(e)}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="register_number"
                            label="شماره ثبت"
                            rules={[
                                {
                                    required: true,
                                    message: "شماره ثبت را وارد کنید!",
                                },
                                {
                                    pattern: /^(?:\d*)$/,
                                    message: "فقط عدد وارد کنید.",
                                },
                            ]}
                        >
                            <Input disabled={sendingStatus}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="sign_owners"
                            label="صاحبان امضا"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input disabled={sendingStatus}/>
                        </Form.Item>
                    </Col>
                    <hr className={classes}/>
                    <Col span={12}>
                        <Form.Item
                            name="is_group"
                            label="عضو شرکت گروه"
                            rules={[
                                {
                                    type: "boolean",
                                },
                            ]}
                        >
                            <Switch  disabled={sendingStatus}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>      
                        <Form.Item
                            name="seal"
                            label="اسکن مهر شرکت"
                            getValueFromEvent={normFile}
                        >
                            <Upload {...propsForUpload} accept=".png,.jpg">
                            <Button disabled={sendingStatus} icon={<UploadOutlined />}>انتخاب فایل مهر</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="sign"
                            label="اسکن امضا"
                            getValueFromEvent={normFile}
                        >
                            <Upload {...propsForUpload} accept=".png,.jpg">
                            <Button disabled={sendingStatus} icon={<UploadOutlined />}>انتخاب فایل امضا</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="logo"
                            label="لوگو"
                            getValueFromEvent={normFile}
                        >
                            <Upload {...propsForUpload} accept=".png,.jpg">
                            <Button  disabled={sendingStatus} icon={<UploadOutlined />}>انتخاب فایل لوگو</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="description"
                            label="توضیحات"
                        >
                            <Input.TextArea disabled={sendingStatus}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                            <div className={classes.dateItems}>
                                <Form.Item
                                    label="تاریخ"
                                    name="register_date"
                                    rules={[
                                        {
                                            required: true,
                                            message: "تاریخ را وارد کنید!",
                                        },
                                    ]}
                                > 
                                    <MaskedInput disabled={sendingStatus} onBlur={(e)=>{dateValidation(e)}} className={classes.inputDate} placeholder="روز/ماه/سال" mask="1111/11/11" />
                                </Form.Item>
                                <DatePick disabled={sendingStatus} className={classes.dateButton} onChange={(value)=>{
                                    if(value===null){
                                        form.setFieldsValue({register_date:""});
                                    }else{
                                        console.log(value["$jD"]<10);
                                        console.log(value["$jD"]);
                                        if(value["$jD"]<10) value["$jD"]="0"+value["$jD"];
                                        let date=value["$jy"]+"/"+value["$jM"]+"/"+value["$jD"];
                                        form.setFieldsValue({register_date:date});
                                    }
                                    }}/>
                            </div>
                    </Col>
                    
                    </Row>
                    <Form.Item {...tailLayout}>
                        <Button  disabled={sendingStatus} style={{marginLeft:"10px"}} htmlType="button" onClick={prevForm}>
                            مرحله قبل
                        </Button>
                        <Button loading={sendingStatus} className={classes.submitButton} type="primary" htmlType="submit">
                            ثبت
                        </Button>
                        <Button disabled={sendingStatus} htmlType="button" onClick={onReset}>
                            بازنشانی
                        </Button>
                    </Form.Item>
                </TabPane>
            
            </Tabs>
            
        </Form>
    );

}

export default NewToolsForm;
