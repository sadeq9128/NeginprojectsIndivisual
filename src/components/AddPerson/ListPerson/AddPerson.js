import React, { useState,useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, message,Button, Select } from 'antd';
import "./AddPerson.css";
import DatePick from "./customDatePicker/DatePick";
import {Row,Col} from 'antd';
import axios from "../../../axios";
import {useLocation,useHistory,Route,Redirect } from "react-router-dom";
import {
  EditTwoTone,CheckCircleTwoTone,CloseCircleTwoTone,DeleteTwoTone
} from '@ant-design/icons';
import classes from "./Form.module.css";
import validator from 'validator';
import MaskedInput from "antd-mask-input";


const layout = {
  labelCol: {
      span: 10,
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


let originData = [];

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  
  var inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  if(inputType === 'select'){
    inputNode=
    <Select initialValues="">
        <Select.Option value="تایید نهایی - ارسال در مهلت قانونی از طریق سایت">
        تایید نهایی - ارسال در مهلت قانونی از طریق سایت
        </Select.Option>
        <Select.Option value="تایید نهایی - ارسال در مهلت قانونی از طریق شعبه">
        تایید نهایی - ارسال در مهلت قانونی از طریق شعبه
        </Select.Option>
        <Select.Option value="تایید نهایی - ارسال لیست به صورت معوق">
        تایید نهایی - ارسال لیست به صورت معوق
        </Select.Option>
        <Select.Option value="تایید نهایی - ارسال نشده">
        تایید نهایی - ارسال نشده
        </Select.Option>
        <Select.Option value="عدم تایید">
        عدم تایید
        </Select.Option>
    </Select>
  }
  
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `را وارد کنید ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [formAddPerson] = Form.useForm();
  const [sendingStatus,setSendingStatus]=useState(false);
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const [change,setChange] = useState(null);
  const [saveP,setSaveOP] = useState(0);
  const [select, setSelect] = useState({
    selectedRowKeys: [],
  });
  const [year]=useState(location.state.year);
  const [month]=useState(location.state.month);
  const [insuranceId]=useState(location.state.insurance_id);
  const [person,setPerson]=useState("نامشخص");
  const [startDate,setStartDate]=useState();
  const [totalWorkDay,setTWD]=useState();
  const [personnelId,setPersonel]=useState();
  const [setting,setSetting]=useState();
  const [sdate,setSDATE]=useState();
  const [edate,setEDATE]=useState();
  const [changeForm,setChangeForm]=useState(false);
  const [minDailySalary,setMinDailySalary]=useState(0);
  const [maxDailySalary,setMaxDailySalary]=useState(1);

  axios.defaults.headers.common = {'Authorization':localStorage.getItem("token")};

  useEffect(() => {
    
    axios.get("/insurance/tamin/persons/"+insuranceId)
            .then( response => {
                originData=[...response.data];
                setData(originData);
                console.log(originData);
                console.log("با موفقیت انجام شد");
            } )
            .catch( error => {
                message.error("نتیجه ای یافت نشد.");
                console.log(error);
            } );
    console.log(!changeForm)
    if(changeForm) return;
    axios.get("/admin/hr/variables/annual")
      .then( response => {
          setSetting(response.data[response.data.length-1]);
          setMinDailySalary(response.data[response.data.length-1]['min_daily_salary']);
          setMaxDailySalary(response.data[response.data.length-1]['max_daily_salary']);
          setChangeForm(true);
          console.log(response.data);
          console.log("تنظیمات گرفته شد");
      } )
      .catch( error => {
          message.error("نتیجه ای یافت نشد.");
          console.log(error);
      } );

            
  },[change, changeForm])

  const isEditing = (record) => record.id === editingKey;
  
  const { selectedRowKeys } = select.selectedRowKeys;

  const edit = (record,op) => {
    setSaveOP(op);
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.id);
  };

  
  const DeletePerson = (record) => {
    
    let value={data:{"ids" : record.id}}
    console.log(value);
    axios.delete("/insurance/tamin/person",value)
    .then( response => {
        originData=originData.filter((obj)=>{
          return obj.id!==record.id;
        });
        setData(originData);
        console.log(originData);
        console.log("با موفقیت انجام شد");
    } )
    .catch( error => {
        message.error("حذف انجام نشد.");
        console.log(error);
    } );
    return;
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      console.log(key);
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item});
        setData(newData);
        setEditingKey('');
      } else {
        setData(newData);
        setEditingKey('');
      }

    let value={
      "insurance_id" : insuranceId,
      "personnel_id" : newData[index]['personnel_id_fk'],
      "start_date" : newData[index]['start_date'],
      "end_date" : newData[index]['end_date'],
      "total_work_day" : newData[index]['total_work_day'],
      "daily_salary": form.getFieldValue("daily_salary"),
      "monthly_salary" : newData[index]['monthly_salary'],
      "include_benefit" : newData[index]['include_benefit'],
      "salary_benefit_include" : form.getFieldValue("salary_benefit_include"),
      "salary_benefit_include_notinclude": form.getFieldValue("salary_benefit_include_notinclude"),
      "insured_share" : 0,
      "employer_share" : 0,
      "jobless_share" : 0,
      "hard_job_share" : 0,
      "total_share" : newData[index]['total_share'],
      "job_id_fk" : form.getFieldValue("job_id_fk"),
      "desscription": "Updated"
    };
    newData[index]['job_id_fk']=value['job_id_fk'];
    newData[index]['salary_benefit_include']=value['salary_benefit_include'];
    newData[index]['salary_benefit_include_notinclude']=value['salary_benefit_include_notinclude'];
    newData[index]['daily_salary']=value['daily_salary'];

    axios.put(`/insurance/tamin/person/${key}`,value)
    .then( response => {
        console.log(originData);
        console.log(newData);
        originData=[...newData];
        setData(newData);
        console.log("با موفقیت انجام شد");
    } )
    .catch( error => {
        message.error("نتیجه ای یافت نشد.");
        console.log(error);
    } );

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  
  const fetchCode=(e)=>{
    axios.get( '/admin/personnel/lookup/'+e.target.value )
        .then( response => {
            console.log(response);
            setPersonel(response.data.id);
            setSendingStatus(false);
            setPerson(response.data.first_name+" "+response.data.last_name)
            message.success("شخص مورد نظر یافت شد");
            console.log("شخص مورد نظر یافت شد");
        } )
        .catch( error => {
            setSendingStatus(true);
            message.error("خطا در دریافت شخص");
            console.log("خطا در دریافت شخص");
        } );
  }
  
  const fetchJob=(e)=>{
    axios.get( '/jobtitle/'+e.target.value )
        .then( response => {
            console.log(response.data);
            message.success("کد شغل موجود است");
            console.log("کد شغل موجود است");
        } )
        .catch( error => {
          formAddPerson.setFields([
              {
                  name: "job_id_fk",
                  errors: ["کد شغل نامعتبر است"]
              }
          ]);
            message.error("کد شغل موجود نیست");
            console.log("کد شغل موجود نیست");
        } );
  }

  const addPersonToList=(values) => {
    values['insurance_id']=insuranceId;
    values['personnel_id']=2;
    values['start_date']=sdate;
    values['end_date']=edate;
    values['personnel_id']=personnelId;
    console.log(values);
    if(values['description']===undefined)values['description']="";
    console.log(values);
    setSendingStatus(true);
    axios.post( '/insurance/tamin/person',values )
        .then( response => {
            setSendingStatus(false);
            setChange(1);
            message.success("با موفقیت انجام شد");
            console.log("با موفقیت انجام شد");
        } )
        .catch( error => {
            setSendingStatus(false);
            message.error("خطایی رخ داد");
            console.log("خطایی رخ داد");
        } );
  }

  // const deleteItems=()=>{
    
  //   let value={data:{"ids" : select.selectedRowKeys}}
  //   axios.delete("/insurance/tamin/person",value)
  //   .then( response => { 
  //       originData=originData.filter((obj)=>{
  //       return obj.id!==record.id;
  //       });
  //       setData(originData);
  //       console.log(originData);
  //       console.log("با موفقیت انجام شد");
  //   } )
  //   .catch( error => {
  //       message.error("حذف انجام نشد.");
  //       console.log(error);
  //   } );
  //   return;
  // }

  let history = useHistory();
  const createItem=()=>{
    history.push('/dashboard/tamin');
  }

  const onResetSearch = () => {
    formAddPerson.resetFields();
  };
  

  const dateValidation=(e)=>{
    console.log(validator.isDate(e.target.value));
    if (!validator.isDate(e.target.value)) {
        formAddPerson.setFields([
            {
                name: "start_date",
                errors: ["تاریخ معتبر نیست"]
            }
        ]);
    }
  }

  const calcuteForm=()=>{
    console.log("event called");
    let monthlySalary=formAddPerson.getFieldValue('total_work_day')*formAddPerson.getFieldValue('daily_salary');
    let includeBenefit=parseInt(setting['bonus'])+parseInt(setting['housing']);
    //daily_salary
    formAddPerson.setFieldsValue({daily_salary:minDailySalary});
    //monthly_salary
    formAddPerson.setFieldsValue({monthly_salary:monthlySalary});
    //include_benefit
    formAddPerson.setFieldsValue({include_benefit:includeBenefit});
    //salary_benefit_include
    formAddPerson.setFieldsValue({salary_benefit_include:monthlySalary+includeBenefit});
    //salary_benefit_include_notinclude
    formAddPerson.setFieldsValue({salary_benefit_include_notinclude:monthlySalary+includeBenefit});
    //insured_share
    formAddPerson.setFieldsValue({insured_share:(monthlySalary+includeBenefit)*7});
    //employer_share
    formAddPerson.setFieldsValue({employer_share:(monthlySalary+includeBenefit)*20});
    //jobless_share
    formAddPerson.setFieldsValue({jobless_share:(monthlySalary+includeBenefit)*3});
    //hard_job_share
    formAddPerson.setFieldsValue({hard_job_share:(monthlySalary+includeBenefit)*4});
    //total_share
    formAddPerson.setFieldsValue({total_share:
      monthlySalary+includeBenefit+
      (monthlySalary+includeBenefit)*4+
      (monthlySalary+includeBenefit)*7+
      (monthlySalary+includeBenefit)*20+
      (monthlySalary+includeBenefit)*3
    });

  }
  

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      setSelect({
        ...select,
        selectedRowKeys: selectedRowKeys,
      });
    },
  };

  const columns = [
    {
      title: 'شماره بیمه',
      dataIndex: 'insurance_number',
      key: 'insurance_number',
      width: '7%',
      editable: true,
    },
    {
      title: 'نام',
      dataIndex: 'first_name',
      key: 'first_name',
      width: '7%',
      editable: true,
    },
    {
      title: 'نام خانوادگی',
      dataIndex: 'last_name',
      key: 'last_name',
      width: '10%',
      editable: true,
    },
    {
      title: 'روز کارکرد',
      dataIndex: 'total_work_day',
      width: '5%',
      editable: true,
      key: 'total_work_day',
    },
    {
      title: 'دستمزد روزانه',
      dataIndex: 'daily_salary',
      width: '8%',
      editable: true,
      key: 'daily_salary',
      render: (_,record) => { try{
        if (record.daily_salary===null)
          return "";
        return (
        <span>{record.daily_salary.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
         )
      }catch(errInfo){return record.salary_benefit_include_notinclude}
    }
    },
    {
      title: 'مزایای مشمول',
      dataIndex: 'include_benefit',
      width: '8%',
      editable: true,
      key: 'include_benefit',
      render: (_,record) => { try{
        if (record.include_benefit===null)
          return "";
        return (
        <span>{record.include_benefit.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
         )
      }catch(errInfo){return record.salary_benefit_include_notinclude}
    }
    },
    {
      title: 'دستمزد مشمول',
      dataIndex: 'salary_benefit_include',
      width: '10%',
      editable: true,
      key: 'salary_benefit_include',
      render: (_,record) => { try{
        if (record.salary_benefit_include===null)
          return "";
        return (
        <span>{record.salary_benefit_include.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
         )
      }catch(errInfo){return record.salary_benefit_include_notinclude}
    }
    },
    {
      title: 'مشمول و نامشمول',
      dataIndex: 'salary_benefit_include_notinclude',
      key:'salary_benefit_include_notinclude',
      width: '15%',
      editable: true,
      render: (_,record) => { try{
        if (record.salary_benefit_include_notinclude===null)
          return "";
        return (
        <span>{record.salary_benefit_include_notinclude.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
         )
      }catch(errInfo){return record.salary_benefit_include_notinclude}
    }
    },
    {
      title: 'شغل',
      dataIndex: 'job_id_fk',
      width: '10%',
      editable: true,
      key: 'job_id_fk',
    },
    {
      title: 'ابزارها',
      width: '6%',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <CheckCircleTwoTone
              twoToneColor="#52c41a" 
              style={{fontSize: '18px'}}
              href="javascript:;"
              onClick={() => save(record.id)}
            >
               اعمال 
            </CheckCircleTwoTone>
            <Popconfirm okText="بله" cancelText="خیر" title="لغو شود؟" onConfirm={cancel}>
            <CloseCircleTwoTone twoToneColor="#eb2f96" style={{marginRight:"10px", fontSize: '18px'}}> لغو </CloseCircleTwoTone>
            </Popconfirm>
          </span>
        ) : (
          <span>
            {/* <Typography.Link style={{marginLeft:"5px"}} disabled={editingKey !== ''} onClick={() => edit(record,1)}>
              ویرایش  
            </Typography.Link> */}
            <EditTwoTone style={{marginLeft:"5px", fontSize: '18px'}} disabled={editingKey !== ''} onClick={() => edit(record,1)}/>
            <DeleteTwoTone style={{marginRight:"5px", fontSize: '16px'}} disabled={editingKey !== ''} onClick={() => DeletePerson(record)}/>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    if(saveP===2) return col;

    return {
      ...col,
      onCell: (record) => {
        let type="number";
        switch (col.dataIndex){
          case 'status': type="select"; break;
          default : type = "number";
        }
        return {
        record,
        inputType: type,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }},
    };
  });
  
  
  return (
    <div>
      
      <Form {...layout} form={formAddPerson} name="control-hooks" onFinish={addPersonToList} className={classes.sectionForm}>

        <h3>تاریخ بیمه: <span>{year}/{month}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>
          نام و نام خانوادگی: {person}
        </span>
        </h3>

        <Row>
          
        <Col span={8}>
              <Form.Item
                  name="personnel_id"
                  label="کد ملی"
                  rules={[
                      {
                          required: true,
                          message: "کدملی را وارد کنید!",
                      },
                      {
                          pattern: /^(?:\d*)$/,
                          message: "فقط عدد وارد کنید.",
                      }
                  ]}
              >
                  <InputNumber 
                      style={{width:"100%"}}
                      onBlur={(e)=>{fetchCode(e)}}
                      />
              </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={10}>
            <div className={classes.dateItems}>
                <Form.Item
                    label="تاریخ شروع به کار"
                    name="start_date"
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
                      formAddPerson.setFieldsValue({start_date:""});
                    }else if(parseInt(value["$jM"]+1)!==parseInt(month) 
                      && parseInt(value["$jy"])!==parseInt(year)){
                      formAddPerson.setFieldsValue({start_date:""});
                      formAddPerson.setFields([
                        {
                        name: "start_date",
                        errors: ["نباید خارج از تاریخ لیست باشد"]
                        }
                      ]);
                      return;
                    }else{
                        if(value["$jD"]<10) value["$jD"]="0"+value["$jD"];
                        if(value["$jM"]+1<10) value["$jM"]="0"+(value["$jM"]+1);
                        let date=value["$jy"]+"/"+value["$jM"]+"/"+value["$jD"];
                        let r=date.replace("/","");
                        let d=r.replace("/","");
                        console.log(d);
                        let dateandhour=date+" "+value["$H"]+":"+value["$m"]+":"+value["$s"];
                        setSDATE(dateandhour);
                        setStartDate(parseInt(d));
                        formAddPerson.setFieldsValue({start_date:date});
                    }
                    }}/>
            </div>
          </Col>
          <Col span={10}>
            <div className={classes.dateItems}>
              <Form.Item
                  label="تاریخ پایان کار"
                  name="end_date"
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
                      formAddPerson.setFieldsValue({end_date:""});return;
                  }
                  if(value["$jD"]<10) value["$jD"]="0"+value["$jD"];
                  if(value["$jM"]+1<10) value["$jM"]="0"+(value["$jM"]+1);
                  let date=value["$jy"]+"/"+value["$jM"]+"/"+value["$jD"];
                  let r=date.replace("/","");
                  let d=r.replace("/","");
                  console.log(parseInt(d)<=startDate);
                  if(parseInt(d)<=startDate){
                    formAddPerson.setFieldsValue({end_date:""});
                    formAddPerson.setFields([
                      {
                      name: "end_date",
                      errors: ["نباید کمتر مساوی شروع باشد"]
                      }
                    ]);
                    return;
                  }
                  let dateandhour=date+" "+value["$H"]+":"+value["$m"]+":"+value["$s"];
                  setEDATE(dateandhour);
                  formAddPerson.setFieldsValue({end_date:date});
                  
                  }}/>
          </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
              <Form.Item
                  name="total_work_day"
                  label="روز کارکرد"
                  initialValue={0}
                  rules={[
                      {
                          required: true,
                          message: "روز را وارد کنید!",
                      },
                      {
                          pattern: /^(?:\d*)$/,
                          message: "فقط عدد وارد کنید.",
                      }
                  ]}
              >
                  <InputNumber 
                      style={{width:"100%"}}
                      disabled={sendingStatus}
                      min={0}
                      max={31}
                      onBlur={()=>calcuteForm()}
                      />
              </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
                name="daily_salary"
                label="دستمزد روزانه"
                initialValue={minDailySalary}
                rules={[
                    {
                      required: true,
                      message: "مقدار را وارد کنید!",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "فقط عدد وارد کنید.",
                    }
                ]}
            >
                <InputNumber style={{width:"100%"}} disabled={sendingStatus} 
                      min={minDailySalary}
                      max={maxDailySalary}
                      onBlur={()=>calcuteForm()}
                      onChange={()=>calcuteForm()}
                      />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
                name="monthly_salary"
                label="دستمزد ماهانه"
                initialValue={formAddPerson.getFieldValue("daily_salary")*totalWorkDay}
                rules={[
                    {
                      required: true,
                      message: "مقدار را وارد کنید!",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "فقط عدد وارد کنید.",
                    }
                ]}
            >
                <InputNumber style={{width:"100%"}} disabled={true}/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
                name="include_benefit"
                label="مزایای مشمول"
                initialValue={0}
                rules={[
                    {
                      required: true,
                      message: "مقدار را وارد کنید!",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "فقط عدد وارد کنید.",
                    }
                ]}
            >
                <InputNumber style={{width:"100%"}} disabled={sendingStatus} 
                onFocus={()=>calcuteForm()} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
                name="salary_benefit_include"
                label="دستمزد و مزایای مشمول"
                initialValue={0}
                rules={[
                    {
                      required: true,
                      message: "مقدار را وارد کنید!",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "فقط عدد وارد کنید.",
                    }
                ]}
            >
                <InputNumber style={{width:"100%"}} disabled={true} 
                  onFocus={()=>calcuteForm()}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
                name="salary_benefit_include_notinclude"
                label="دستمزد و مزایای مشمول و غیرمشمول"
                initialValue={0}
                rules={[
                    {
                      required: true,
                      message: "مقدار را وارد کنید!",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "فقط عدد وارد کنید.",
                    }
                ]}
            >
                <InputNumber style={{width:"100%"}} 
                  disabled={sendingStatus} 
                  min={formAddPerson.getFieldValue('salary_benefit_include')}
                  onFocus={()=>calcuteForm()}
                  />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
                name="insured_share"
                label="سهم بیمه شده"
                initialValue={0}
                rules={[
                    {
                      required: true,
                      message: "مقدار را وارد کنید!",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "فقط عدد وارد کنید.",
                    }
                ]}
            >
                <InputNumber style={{width:"100%"}} disabled={sendingStatus} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
                name="employer_share"
                label="سهم کارفرما"
                initialValue={0}
                rules={[
                    {
                      required: true,
                      message: "مقدار را وارد کنید!",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "فقط عدد وارد کنید.",
                    }
                ]}
            >
                <InputNumber style={{width:"100%"}} disabled={sendingStatus} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
                name="jobless_share"
                label="سهم بیمه بیکاری"
                initialValue={0}
                rules={[
                    {
                      required: true,
                      message: "مقدار را وارد کنید!",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "فقط عدد وارد کنید.",
                    }
                ]}
            >
                <InputNumber style={{width:"100%"}} disabled={sendingStatus} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
                name="hard_job_share"
                label="سهم مشاغل سخت"
                initialValue={0}
                rules={[
                    {
                      required: true,
                      message: "مقدار را وارد کنید!",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "فقط عدد وارد کنید.",
                    }
                ]}
            >
                <InputNumber style={{width:"100%"}} disabled={sendingStatus} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
                name="total_share"
                label="جمع حق بیمه"
                initialValue={0}
                rules={[
                    {
                      required: true,
                      message: "مقدار را وارد کنید!",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "فقط عدد وارد کنید.",
                    }
                ]}
            >
                <InputNumber style={{width:"100%"}} disabled={true} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
                name="job_id_fk"
                label="کد شغل"
                initialValue={200}
                rules={[
                    {
                      required: true,
                      message: "مقدار را وارد کنید!",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "فقط عدد وارد کنید.",
                    }
                ]}
            >
                <InputNumber style={{width:"100%"}} disabled={sendingStatus} onBlur={(e)=>{fetchJob(e)}}/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <Form.Item
              name="description"
              label="توضیحات">
              <Input.TextArea disabled={sendingStatus}/>
            </Form.Item>
          </Col>
        </Row>
            <Form.Item {...tailLayout}>                 
                <Button disabled={sendingStatus} loading={sendingStatus} className={classes.submitButton} type="primary" htmlType="submit">
                    ثبت
                </Button>
                <Button disabled={sendingStatus} htmlType="button" onClick={onResetSearch}>
                    بازنشانی
                </Button>
            </Form.Item>
      </Form>
      
      <Form form={form} component={false}>
        {/* <Button disabled={select.selectedRowKeys.length===0} onClick={deleteItems} className={"submitButton"} type="primary">
            حذف
        </Button> */}
        {/* <Button  onClick={createItem} className={"submitButton"} type="primary">
            ایجاد
        </Button> */}
          <Table className={"listform"}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            rowSelection={rowSelection}
            rowKey={(record)=>record.id}
            columns={mergedColumns}
            pagination={{
              onChange: cancel,
            }}
          />
      </Form>

    </div>

  );

};

export default EditableTable;