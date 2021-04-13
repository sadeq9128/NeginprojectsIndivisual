import React, { useState,useEffect } from 'react';
import { TimePicker, Input, Select, Radio, Form, Button, Checkbox, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import "./AccidentCreate.css";
import DatePick from "../../../Utils/customDatePicker/DatePick";
import {Row,Col} from 'antd';
import classes from "./Form.module.css";
import validator from 'validator';
import MaskedInput from "antd-mask-input";
import moment from 'moment';
import axios from "../../../axios";

const format = 'HH:mm';
const { Option } = Select;

const tailLayout = {
  wrapperCol: {
      offset: 6,
      span: 10,
  },
};

let machineInfo={code:""};
let address="";
let personnelInfo={code:"",id:"",relation:"پرسنل"};
const AccidentCreate = (props) => {
  const [form] = Form.useForm();
  const [sendingStatus,setSendingStatus]=useState(false);

  const onResetSearch = () => {
    form.resetFields();
  };

  const dateValidation=(e)=>{
    if (!validator.isDate(e.target.value)) {
        form.setFields([
            {
                name: "date",
                errors: ["تاریخ معتبر نیست"]
            }
        ]);
    }
  }

  const backToList=()=>{
    console.log(props.formHandler);
    props.formHandler(true);
  }

  let key=1;
  const getMachineInfo=(machineCode,vehicle,name)=>{
    message.destroy(key);
    axios.get( "/admin/vehicle/lookup/"+machineCode )
    .then( response => {
        message.success("ماشین"+" یافت شد");
        vehicle[name]["system"]=response.data.system;
        form.setFieldsValue({vehicles:vehicle});
    } )
    .catch( error => {
        message.error({ content: "ماشین"+" پیدا نشد", key });
    } );
  }

  const getPersonInfo=(perosnCode,personnel,name)=>{
    message.destroy(key);
    console.log(perosnCode);
    axios.get('/admin/personnel/lookup/'+perosnCode )
    .then( response => {
        message.success("شخص"+" یافت شد");
        personnel[name]["fullName"]=response.data.first_name+" "+response.data.last_name;
        personnel[name]["id"]=response.data.id;
        personnel[name]["relation"]="پرسنل";
        form.setFieldsValue({personnel:personnel});
    } )
    .catch( error => {
        message.error({ content: "شخص"+" پیدا نشد", key });
    } );
  }
  
  const finishForm=(values)=>{
    values['address']=address;
    values['time']=((values['time']['_d'])+"").split(" ")[4];
    console.log(values);
    axios.post( "/admin/incident",values )
    .then( response => {
        message.success("با موفقیت ثبت شد");
        window.location.reload();

    } )
    .catch( error => {
        message.error("خطا در ثبت حادثه");
    } );
  }

  let userData;
  if(props.userData.data===undefined){
    userData=JSON.parse(localStorage.getItem('userData'));
  }else{
    userData=props.userData.data;
  }

  let option=[];
  option=userData.user.contract.map((el)=>(
    <Option value={el.contract_id}>{el.subject}</Option>
  ));
  
  return (
    <div>
      <Form  form={form} name="control-hooks" className={classes.sectionForm} onFinish={finishForm}>
        <Col span={12}>
            <Form.Item
              name="project_id"
              label="پروژه"
              rules={[
                {
                    required: true,
                    message: "پروژه را وارد کنید!",
                },
              ]}
            >
            <Select
              placeholder="انتخاب کنید"
              optionFilterProp="children"
            >
              {option}
            </Select>
          </Form.Item>
        </Col>
        <Row gutter={18}>
          <Col xs={2} sm={4} md={6} lg={6} xl={8}>
              <Form.Item
                  name="accident_reason"
                  label="علت حادثه"
                  rules={[
                      {
                          required: true,
                          message: "علت جادثه مشخص نشده!",
                      }
                  ]}>
              <Input disabled={sendingStatus}/>
              </Form.Item>
          </Col>
          <Col xs={2} sm={4} md={6} lg={6} xl={8}>
            <div className={classes.dateItems}>
                <Form.Item
                    label="تاریخ وقوع حادثه"
                    name="date"
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
                    console.log(value["$H"]);
                    if(value===null){
                      form.setFieldsValue({date:""});
                    }else{
                        if(value["$jD"]<10) value["$jD"]="0"+value["$jD"];
                        if(value["$jM"]+1<10) value["$jM"]="0"+(value["$jM"]+1);
                        let date=value["$jy"]+"/"+value["$jM"]+"/"+value["$jD"];
                        form.setFieldsValue({date:date});
                    }
                    }}/>
            </div>
          </Col>
          <Col xs={2} sm={4} md={6} lg={6} xl={8}>
            <Form.Item
              name="time"
              initialValue={moment()}
              label="زمان وقوع حادثه"
              rules={[
                {
                    required: true,
                    message: "زمان را وارد کنید!",
                },
            ]}>
                <TimePicker format={format}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={18}>
          <Col xs={2} sm={4} md={6} lg={6} xl={8}>
            <Form.Item
              name="description"
              label="شرح واقعه">
              <Input.TextArea disabled={sendingStatus}/>
            </Form.Item>
          </Col>
          <Col xs={2} sm={4} md={6} lg={6} xl={8}>
            <Form.Item
                name="medicine"
                label="اقدامات درمانی"
            >
            <Input.TextArea disabled={sendingStatus}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={18}>
          <Col xs={2} sm={4} md={6} lg={6} xl={8}>
            <Form.Item label="نوع حادثه" name="type" 
              rules={[
                {
                    required: true,
                    message: "نوع حادثه را وارد کنید!",
                },
            ]}>
              <Radio.Group>
                <Radio value="جرحی">جرحی</Radio>
                <Radio value="مالی">مالی</Radio>
                <Radio value="فوتی">فوتی</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={2} sm={4} md={6} lg={6} xl={8}>
            <Form.Item label="محل حادثه" name="address_type"
              rules={[
                {
                    required: true,
                    message: "محل حادثه را وارد کنید!",
                },
            ]}>
              <Radio.Group>
                <Radio value="محل پروژه">محل پروژه</Radio>
                <Radio value="خارج از پروژه">خارج از پروژه</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={2} sm={4} md={6} lg={6} xl={8}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>{
                if(currentValues.address_type===undefined) return false;
                if(prevValues.address_type!==currentValues.address_type){
                    console.log(currentValues.address_type);return true;}
                return false;
                }
              }
            >
              {({ getFieldValue }) =>{
                let addressType=getFieldValue('address_type');
                return (addressType!==undefined &&
                  addressType==="خارج از پروژه") ? (
                    <Row gutter={6}>
                    <Col xs={2} sm={4} md={20} lg={20} xl={20}>
                      <Form.Item
                      name="address"
                      label="محل وقوع حادثه"
                      >
                        <Input disabled={sendingStatus}/>
                      </Form.Item>
                    </Col>
                    </Row>
                  ) : address=addressType;
              }
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={18}>
          <Col xs={2} sm={4} md={10} lg={10} xl={10}>
            <Form.Item label="علت حادثه" name="reason">
              <Checkbox.Group>
                <Row gutter={18}>
                  <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                    <Checkbox value="تصادف و تصادم" style={{ lineHeight: '12px' }}>
                      تصادف و تصادم
                    </Checkbox>
                  </Col>
                  <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                    <Checkbox value="سقوط از ارتفاع" style={{ lineHeight: '12px' }}>
                      سقوط از ارتفاع
                    </Checkbox>
                  </Col>
                  <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                    <Checkbox value="سقوط اجسام" style={{ lineHeight: '12px' }}>
                      سقوط اجسام
                    </Checkbox>
                  </Col>
                  <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                    <Checkbox value="ریزش آوار" style={{ lineHeight: '12px' }}>
                      ریزش آوار
                    </Checkbox>
                  </Col>
                  <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                    <Checkbox value="کار با ابزار" style={{ lineHeight: '12px' }}>
                      کار با ابزار
                    </Checkbox>
                  </Col>
                  <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                    <Checkbox value="برق گرفتگی" style={{ lineHeight: '12px' }}>
                      برق گرفتگی
                    </Checkbox>
                  </Col>
                  <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                    <Checkbox value="خفگی" style={{ lineHeight: '12px' }}>
                      خفگی
                    </Checkbox>
                  </Col>
                  <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                    <Checkbox value="نزاع و درگیری" style={{ lineHeight: '12px' }}>
                      نزاع و درگیری
                    </Checkbox>
                  </Col>
                  <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                    <Checkbox value="انفجار" style={{ lineHeight: '12px' }}>
                      انفجار
                    </Checkbox>
                  </Col>
                  <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                    <Checkbox value="سایر" style={{ lineHeight: '12px' }}>
                      سایر
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
          <Col xs={2} sm={4} md={6} lg={6} xl={8}>
              <Form.Item
                  name="reason_other"
                  label="سایر علت حادثه"
                  rules={[
                      {
                          required: true,
                          message: "علت جادثه مشخص نشده!",
                      }
                  ]}>
              <Input disabled={sendingStatus}/>
              </Form.Item>
          </Col>
        </Row>

        <hr className={classes}/>
        <div>
          <Form.List  name="vehicles">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row gutter={18}>
                    <Col xs={2} sm={6} md={6} lg={6} xl={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'machine_code']}
                      initialValue=""
                      fieldKey={[fieldKey, 'machine_code']}
                      rules={[{ required: true, message: 'کد ماشین را وارد کنید' }]}
                    >
                      <Input placeholder="کد ماشین"/>
                    </Form.Item>
                    </Col>
                    <Col xs={10} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>{
                        if(currentValues.vehicles[name]===undefined) return false;
                        if(prevValues.vehicles[name].machine_code!==currentValues.vehicles[name].machine_code)
                            return true;
                        return false;
                        }
                      }
                    >
                      {({ getFieldValue }) =>{
                        let machineCode=getFieldValue('vehicles')[name];
                        (machineCode!==undefined && machineInfo.code!==machineCode['machine_code'])
                          ?getMachineInfo(machineCode['machine_code'],getFieldValue('vehicles'),name) : key=key+0;
                        machineCode!==undefined?machineInfo.code=machineCode['machine_code']:key=key+0;
                        return (machineCode!==undefined &&
                          machineCode['machine_code']) ? (
                            <Row>
                              <Col xs={2} sm={8} md={10} lg={10} xl={10}>
                              <Form.Item
                                {...restField}
                                name={[name, 'system']}
                                fieldKey={[fieldKey, 'system']}
                                rules={[{ required: true, message: 'وارد نشده است' }]}
                              >
                                <Input placeholder="سیستم" />
                              </Form.Item>
                              </Col>
                              <Col xs={2} sm={8} md={10} lg={10} xl={10}>
                              <Form.Item
                                {...restField}
                                name={[name, 'damage']}
                                fieldKey={[fieldKey, 'damage']}
                                rules={[{ required: true, message: 'وارد نشده است' }]}
                              >
                                <Input placeholder="صدمات" />
                              </Form.Item>
                              </Col>
                              <MinusCircleOutlined onClick={() =>remove(name)} />
                            </Row>
                          ) : null
                      }
                      }
                    </Form.Item>
                    </Col>
                </Row>
                ))}
                <Row gutter={8}>
                  <Col xs={2} sm={6} md={6} lg={6} xl={6}>
                <Form.Item>
                  <Button type="dashed" onClick={() =>add()} block icon={<PlusOutlined />}>
                    Add field
                  </Button>
                </Form.Item>
                </Col>
                </Row>
              </>
            )}
          </Form.List>
        </div>  

        <hr className={classes}/>
        <div>
          <Form.List  name="personnel">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row gutter={24}>
                    <Col xs={2} sm={3} md={3} lg={3} xl={3}>
                    <Form.Item
                      {...restField}
                      name={[name, 'national_id']}
                      fieldKey={[fieldKey, 'national_id']}
                      rules={[{ required: true, message: 'کد ملی را وارد کنید' }]}
                    >
                      <Input placeholder="کد ملی"/>
                    </Form.Item>
                    </Col>
                    <Col xs={21} sm={21} md={21} lg={21} xl={21}>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>{
                        // console.log(prevValues.personnel[name]);
                        // console.log(currentValues.personnel[name]);
                        if(currentValues.personnel[name]===undefined) return false;
                        if(prevValues.personnel[name]===undefined) return false;
                        if(prevValues.personnel[name].national_id!==currentValues.personnel[name].national_id)
                            return true;
                        return false;
                        }
                      }
                    >
                      {({ getFieldValue }) =>{
                        let personneCode=getFieldValue('personnel')[name];
                        (personneCode!==undefined && personnelInfo.code!==personneCode['national_id'])
                          ?getPersonInfo(personneCode['national_id'],getFieldValue('personnel'),name) : key=key+0;
                        personneCode!==undefined?personnelInfo.code=personneCode['national_id']:key=key+0;
                        return (getFieldValue('personnel')[name]!==undefined &&
                          getFieldValue('personnel')[name]['national_id']) ? (
                            <Row>
                              <Col xs={2} sm={3} md={6} lg={3} xl={3}>
                              <Form.Item
                                {...restField}
                                name={[name, 'fullName']}
                                fieldKey={[fieldKey, 'fullName']}
                                rules={[{ required: true, message: 'وارد نشده است' }]}
                              >
                                <Input placeholder="نام" />
                              </Form.Item>
                              </Col>
                              <Col xs={2} sm={3} md={3} lg={4} xl={4}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'injury']}
                                  fieldKey={[fieldKey, 'injury']}>
                                  <Checkbox.Group>
                                    <Row gutter={18}>
                                      <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                                        <Checkbox value="سر" style={{ lineHeight: '12px' }}>
                                            سر
                                        </Checkbox>
                                      </Col>
                                      <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                                        <Checkbox value="گردن" style={{ lineHeight: '12px' }}>
                                          گردن
                                        </Checkbox>
                                      </Col>
                                      <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                                        <Checkbox value="دست" style={{ lineHeight: '12px' }}>
                                          دست
                                        </Checkbox>
                                      </Col>
                                      <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                                        <Checkbox value="کمر" style={{ lineHeight: '12px' }}>
                                          کمر
                                        </Checkbox>
                                      </Col>
                                      <Col xs={2} sm={4} md={10} lg={10} xl={10}>
                                        <Checkbox value="پا" style={{ lineHeight: '12px' }}>
                                          پا
                                        </Checkbox>
                                      </Col>
                                    </Row>
                                  </Checkbox.Group>
                                </Form.Item>
                              </Col>
                              <Col xs={2} sm={3} md={3} lg={4} xl={4}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'injury_other']}
                                  fieldKey={[fieldKey, 'injury_other']}
                                >
                                  <Input placeholder="سایر صدمات" />
                                </Form.Item>
                              </Col>
                              <Col xs={2} sm={3} md={3} lg={8} xl={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'injury_type']}
                                  fieldKey={[fieldKey, 'injury_type']}>
                                  <Checkbox.Group>
                                    <Row gutter={12}>
                                      <Col xs={2} sm={4} md={10} lg={6} xl={6}>
                                        <Checkbox value="قطع عضو" style={{ lineHeight: '12px' }}>
                                            قطع عضو
                                        </Checkbox>
                                      </Col>
                                      <Col xs={2} sm={4} md={10} lg={8} xl={8}>
                                        <Checkbox value="شکستگی" style={{ lineHeight: '12px' }}>
                                          شکستگی
                                        </Checkbox>
                                      </Col>
                                      <Col xs={2} sm={4} md={10} lg={8} xl={8}>
                                        <Checkbox value="له شدگی" style={{ lineHeight: '12px' }}>
                                          له شدگی
                                        </Checkbox>
                                      </Col>
                                    </Row>
                                  </Checkbox.Group>
                                </Form.Item>
                              </Col>
                              <Col xs={2} sm={3} md={3} lg={3} xl={3}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'injury_type_other']}
                                  fieldKey={[fieldKey, 'injury_type_other']}
                                >
                                  <Input placeholder="سایر انواع صدمات" />
                                </Form.Item>
                              </Col>
                              <Col style={{visibility:"collapse"}} xs={2} sm={3} md={3} lg={3} xl={3}>
                                <Form.Item 
                                  {...restField}
                                  name={[name, 'relation']}
                                  fieldKey={[fieldKey, 'relation']}
                                >
                                </Form.Item>
                              </Col>
                              <MinusCircleOutlined onClick={() =>remove(name)} />
                            </Row>
                          ) : null
                        }
                      }
                    </Form.Item>
                    </Col>
                </Row>
                ))}
                <Row gutter={8}>
                  <Col xs={2} sm={6} md={6} lg={6} xl={6}>
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add field
                  </Button>
                </Form.Item>
                </Col>
                </Row>
              </>
            )}
          </Form.List>
        </div> 

        <Form.Item {...tailLayout}>   
            <Button disabled={sendingStatus} htmlType="button" onClick={backToList}>
                بازگشت
            </Button>              
            <Button loading={sendingStatus} className={classes.submitButton} type="primary" htmlType="submit">
                ثبت
            </Button>
            <Button disabled={sendingStatus} htmlType="button" onClick={onResetSearch}>
                بازنشانی
            </Button>
        </Form.Item>
      
      </Form>

    </div>      
  )

};

export default AccidentCreate;