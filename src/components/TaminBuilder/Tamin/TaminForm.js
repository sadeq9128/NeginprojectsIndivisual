import React,{ useState } from "react";
import { Form, Input, InputNumber, Button, message  } from 'antd';
import MaskedInput from "antd-mask-input";
import 'moment/locale/fa';
import {Row,Col} from 'antd';
import axios from "../../../axios";
import classes from "./TaminForm.module.css";

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

const NewToolsForm=(props)=>{

    const [formSearch] = Form.useForm();
    const [formList] = Form.useForm();
    const [sendingStatus,setSendingStatus]=useState(props.status);
    const [result,setResult]=useState(false);
    const [contractId,setContractId]=useState(null);
    const [year,setYear]=useState(null);
    const [month,setMonth]=useState(null);

    
    axios.defaults.headers.common = {'Authorization':localStorage.getItem("token")};

    // useEffect(() => {
    // },[props.sending]);

    const onSearch = (values) => {
        setSendingStatus(true);
        setResult(false);
        axios.get(`/admin/contract/find/${values.workShopCode}/${values.rowCode}`)
            .then( response => {
                console.log(response.data);
                setContractId(response.data.item.contractor_id);
                setYear(response.data.insurance.year);
                setMonth(parseInt(response.data.insurance.month));
                setSendingStatus(false);
                setResult(true);
                console.log("با موفقیت انجام شد");
            } )
            .catch( error => {
                setSendingStatus(false);
                setResult(false);
                message.error("نتیجه ای یافت نشد.");
                console.log("خطایی رخ داد");
            } );
    };

    const onFinish = (values) => {
        if(contractId===null) {
            message.error("کد قرار دادی یافت نشده است.");
            return;
        }
        values.contract_id=contractId;
        setSendingStatus(true);
        axios.post("/insurance/tamin",values)
            .then( response => {
                message.success("ثبت با موفقیت انجام شد");
                setSendingStatus(false);
                console.log(response.data);
                console.log("با موفقیت انجام شد");
            } )
            .catch( error => {
                setSendingStatus(false);
                message.error("ارسال با مشکل مواجه شد.");
            } );
    };

    const onResetSearch = () => {
        formSearch.resetFields();
    };

    const onResetList = () => {
        formList.resetFields();
    };

    const monthControler=(e)=>{
        let m=e;
        if (m<10) m="0"+m;
        console.log(m);
        formList.setFieldsValue({month:m});
    }


    let ListCreatorForm=null;
    if(result){
        ListCreatorForm=(

            <Form {...layout} form={formList} name="control-hooks" onFinish={onFinish}>
                <Row className={classes.sectionForm}>
                    <Col span={12}>
                        <Form.Item
                            name="year"
                            label="سال"
                            initialValue={year}
                            rules={[
                                {
                                    required: true,
                                    message: "سال را وارد کنید!",
                                },
                                {
                                    pattern: /^(?:\d*)$/,
                                    message: "فقط عدد وارد کنید.",
                                },
                                {
                                    len:4,
                                    message: "سال باید 4 رقم باشد."
                                }
                            ]}
                        >
                            <InputNumber 
                                style={{width:"100%"}}
                                disabled={sendingStatus}
                                min={1320}
                                max={2300}
                                // onChange={}
                                />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="month"
                            label="ماه"
                            initialValue={month<10 ? "0"+(month+1) : ( month===12 ? "01" : month+1)}
                            rules={[
                                {
                                    required: true,
                                    message: "ماه را وارد کنید!",
                                },
                                {
                                    pattern: /^(?:\d*)$/,
                                    message: "فقط عدد وارد کنید.",
                                }
                            ]}
                        >
                        <InputNumber style={{width:"100%"}}
                            disabled={sendingStatus}
                            
                            min={1}
                            max={12}
                            onChange={e=>monthControler(e)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="list_number"
                            label="شماره لیست"
                            initialValue="001"
                            rules={[
                                {
                                    required: true,
                                    message: "شماره لیست را وارد کنید!",
                                },
                                {
                                    pattern: /^(?:\d*)$/,
                                    message: "فقط عدد وارد کنید.",
                                },
                                {
                                    len:3,
                                    message: "شماره لیست باید 3 رقم باشد."
                                }
                            ]}
                        >
                              <MaskedInput style={{width:"100%"}}
                                disabled={sendingStatus} 
                                placeholder="000" 
                                mask="111" />
{/*                                 
                        <InputNumber disabled={sendingStatus}
                            initialValues={"001"}
                            min={1}
                            // onChange={}
                            /> */}
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
                </Row>
                <Form.Item {...tailLayout}>                 
                    <Button loading={sendingStatus} className={classes.submitButton} type="primary" htmlType="submit">
                        ثبت
                    </Button>
                    <Button disabled={sendingStatus} htmlType="button" onClick={onResetList}>
                        بازنشانی
                    </Button>
                </Form.Item>

            </Form>

        );
    }

    return (

        <div>

        <Form {...layout} form={formSearch} name="control-hooks" onFinish={onSearch}>
            
        <p>لطفا برای جستجوی شماره قرار داد فرم زیر را پر کنید:</p>
            <Row className={classes.sectionForm}>
            <Col span={12}>
                <Form.Item
                    name="workShopCode"
                    label="کد کارگاهی"
                    rules={[
                        {
                            required: true,
                            message: "کدکارگاهی را وارد کنید!",
                        },
                        {
                            pattern: /^(?:\d*)$/,
                            message: "فقط عدد وارد کنید.",
                        }
                    ]}
                >
                <Input disabled={sendingStatus} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="rowCode"
                    label="ردیف پیمان"
                    rules={[
                        {
                            required: true,
                            message: "ردیف پیمان را وارد کنید!",
                        },
                        {
                            pattern: /^(?:\d*)$/,
                            message: "فقط عدد وارد کنید.",
                        }
                    ]}
                >
                <Input disabled={sendingStatus}/>
                </Form.Item>
            </Col>
            </Row>
            <Form.Item {...tailLayout}>                 
                <Button loading={sendingStatus} className={classes.submitButton} type="primary" htmlType="submit">
                    جستجو
                </Button>
                <Button disabled={sendingStatus} htmlType="button" onClick={onResetSearch}>
                    بازنشانی
                </Button>
            </Form.Item>

        </Form>

        {ListCreatorForm}

        </div>
    );

}

export default NewToolsForm;
