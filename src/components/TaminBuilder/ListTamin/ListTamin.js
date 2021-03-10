import React, { useState,useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, message, Select } from 'antd';
import "./ListTamin.css";
import axios from "../../../axios";


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
    <Select defaultValue="">
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
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const [change] = useState(null);
  const [saveP,setSaveOP] = useState(0);
  const [select, setSelect] = useState({
    selectedRowKeys: [],
  });

  axios.defaults.headers.common = {'Authorization':localStorage.getItem("token")};

  useEffect(() => {
    axios.get("/insurance/tamin")
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
  },[change])

  const isEditing = (record) => record.id === editingKey;
  
  const { selectedRowKeys } = select.selectedRowKeys;

  const edit = (record,op) => {
    setSaveOP(op);
    form.setFieldsValue({
      workshop_code: '',
      row: '',
      year: '',
      month: '',
      list_number: '',
      personnel_count: '',
      total_insured: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    let value={data:{"ids" : select.selectedRowKeys}}
    if(saveP===2){
      axios.delete("/insurance/tamin",value)
      .then( response => {
          console.log(originData);
          console.log("با موفقیت انجام شد");
      } )
      .catch( error => {
          message.error("نتیجه ای یافت نشد.");
          console.log(error);
      } );
      return;
    }
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
      
      console.log(newData[index]);

      
    axios.put(`/insurance/tamin/${key}`,newData[index])
    .then( response => {
        console.log(originData);
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
      title: 'کد کارگاهی',
      dataIndex: 'workshop_code',
      key: 'workshop_code',
      width: '7%',
      editable: true,
    },
    {
      title: 'ردیف',
      dataIndex: 'row',
      key: 'row',
      width: '10%',
      editable: true,
    },
    {
      title: 'سال',
      dataIndex: 'year',
      width: '7%',
      editable: true,
      key: 'year',
    },
    {
      title: 'ماه',
      dataIndex: 'month',
      width: '5%',
      editable: true,
      key: 'month',
    },
    {
      title: 'شماره لیست',
      dataIndex: 'list_number',
      width: '8%',
      editable: true,
      key: 'list_number',
    },
    {
      title: 'تعداد نفرات',
      dataIndex: 'personnel_count',
      width: '7%',
      editable: true,
      key: 'personnel_count',
    },
    {
      title: 'جمع حق بیمه',
      dataIndex: 'total_insured',
      width: '10%',
      editable: true,
      key: 'total_insured',
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      width: '25%',
      editable: true,
      key: 'status',
    },
    {
      title: 'ابزارها',
      width: '8%',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.id)}
            >
               اعمال 
            </a>
            <Popconfirm okText="بله" cancelText="خیر" title="لغو شود؟" onConfirm={cancel}>
              <a> لغو </a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link style={{marginLeft:"5px"}} disabled={editingKey !== ''} onClick={() => edit(record,1)}>
              ویرایش  
            </Typography.Link>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record,2)}>
                حذف
            </Typography.Link>
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
    <Form form={form} component={false}>
      <Table
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
  );

};

export default EditableTable;