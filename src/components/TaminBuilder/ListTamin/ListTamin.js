import React, { useState,useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, message,Button, Select, Space } from 'antd';
import "./ListTamin.css";
import axios from "../../../axios";
import {useHistory,Route,Redirect } from "react-router-dom";
import {
  EditTwoTone,CheckCircleTwoTone,CloseCircleTwoTone,SettingTwoTone
} from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
const { Search } = Input;


let originData = [];
let oldWord='';
var highlight;var search;
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
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const [change] = useState(null);
  const [saveP,setSaveOP] = useState(0);
  const [select, setSelect] = useState({
    selectedRowKeys: [],
  });
  const [searchText,setSearchText]=useState('');
  const [searchedColumn,setSearchedColumn]=useState('');
  const [searching,setSearching]=useState(false);
  

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

  
  const AddPerson = (record) => {
    console.log(record.month);
      history.push({ 
        pathname: '/dashboard/addperson',
        state: { month: record.month,  year: record.year,  insurance_id: record.id }
    });
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

  const deleteItems=()=>{
    
    let value={data:{"ids" : select.selectedRowKeys}}
    axios.delete("/insurance/tamin",value)
    .then( response => {
        console.log(originData);
        console.log("با موفقیت انجام شد");
    } )
    .catch( error => {
        message.error("حذف انجام نشد.");
        console.log(error);
    } );
    return;
  }

  let history = useHistory();
  const createItem=()=>{
    history.push('/dashboard/tamin');
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


 const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Search
          ref={node => {
            //this.searchInput = node;
          }}
          placeholder={`جستجوی وضعیت`}
          value={selectedKeys[0]}
          //onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onChange={e => handleSearch(setSelectedKeys,selectedKeys,e, ()=>confirm({ closeDropdown: false }), dataIndex,clearFilters)}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          loading={searching}

        />
        
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        //setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const handleSearch = (setSelectedKeys,selectedKeys,e, confirm, dataIndex,clearFilters) => {
  
    clearTimeout(highlight);
    clearTimeout(search);
    const allRows = document.getElementsByClassName("ant-table-row");
    for (let tr of allRows) {
      tr.classList.add("removing");
    }
    if(e.target===undefined)return;
    oldWord=e.target.value;
    setSearching(true);
    setSelectedKeys([e.target.value]);
    
    highlight=setTimeout(()=>{
      setSearchText(e.target.value);
      setSearchedColumn(dataIndex);
    },500);
    search=setTimeout(() => {    
      if(oldWord.length===1){
        confirm();
      }else if(oldWord===e.target.value){
        confirm();
        setSelectedKeys(e.target.value ? [e.target.value] : []);
      }
      else{
        clearFilters();
      }
      const allRows = document.getElementsByClassName("ant-table-row");
      for (let tr of allRows) {
        tr.classList.add("removing");
      }
      setSearching(false);
      console.log("*");
    },500);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
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
      ...getColumnSearchProps('list_number'),
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
      render: (_,record) => { 
        if (record.total_insured===null)
          return "";
        return (
        <span>{record.total_insured.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
         )
      }
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      width: '25%',
      editable: true,
      key: 'status',
      ...getColumnSearchProps('status'),
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
            <SettingTwoTone style={{marginRight:"5px", fontSize: '16px'}} disabled={editingKey !== ''} onClick={() => AddPerson(record)}/>
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
    <Button disabled={select.selectedRowKeys.length===0} onClick={deleteItems} className={"submitButton"} type="primary">
        حذف
    </Button>
    <Button  onClick={createItem} className={"submitButton"} type="primary">
        ایجاد
    </Button>
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
  );

};

export default EditableTable;