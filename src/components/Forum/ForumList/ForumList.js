import React, { useState,useEffect } from 'react';
import { Table, Input, Form, message,Button} from 'antd';
import "./ForumList.css";
import axios from "../../../axios";
import {
  EditTwoTone,SettingTwoTone
} from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import useForum from "../../../hooks/useForum";
const { Search } = Input;


let originData = [];
let oldWord='';
var highlight;var search;

const ForumList = (props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [change,setChange] = useState(null);
  const [showForm,setShowForm]=useState(false);
  const [select, setSelect] = useState({
    selectedRowKeys: [],
  });
  const [searchText,setSearchText]=useState('');
  const [searchedColumn,setSearchedColumn]=useState('');
  const [searching,setSearching]=useState(false);
  const {response, isLoading} = useForum({
   url: "https://baje724.ir/api/survey/",
   data:"150",
  });

  useEffect(() => {
    axios.get("https://baje724.ir/api/survey/150")
      .then( response => {
          originData=[response.data.survey];
          console.log(response.data);
          setData(originData);
      } )
      .catch( error => {
          message.error("نتیجه ای یافت نشد.");
          console.log(error,"error");
      } );
  },[change])

  useEffect(() => {
    if (response !== null) {
      // do more stuff if you wish
    }
  }, [response]);
  
  const { selectedRowKeys } = select.selectedRowKeys;

  const edit = (record,op) => {
    console.log(record.id);
    axios.get("/admin/incident/"+record.id)
      .then( response => {
          props.formHandler(true,response.data);
      } )
      .catch( error => {
          message.error("نتیجه ای یافت نشد.");
      } );
  };

  const AccidenCreate = () => {
    props.formHandler(true,null);
  };

  const deleteItems=()=>{
    let value={data:{"id" : select.selectedRowKeys}};
    console.log(value);
    axios.delete("/admin/incident/",value)
      .then( response => {
        message.success("حذف انجام نشد.");
        setChange(!change);setSelect({
          selectedRowKeys: [],
        });
      } )
      .catch( error => {
          message.error("حذف انجام نشد.");
          console.log(error);
      } );
  }
  
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
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
          placeholder={`جستجوی وضعیت`}
          value={selectedKeys[0]}
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
    },500);
  };


  const columns = [
    {
      title: 'عنوان',
      dataIndex: 'title',
      key: 'title',
      width: '15%',
      ...getColumnSearchProps('عنوان'),
    },
    {
      title: 'نوع مشارکت',
      dataIndex: 'participate_type',
      key: 'participate_type',
      width: '7%',
    },
    {
      title: 'نوع پیشنهاد',
      dataIndex: 'type',
      width: '5%',
      key: 'type',
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      width: '20%',
      key: 'status',
      ...getColumnSearchProps('category_name'),
    },
    {
      title: 'ابزارها',
      width: '6%',
      key:'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <span>
            {/* <Typography.Link style={{marginLeft:"5px"}} disabled={editingKey !== ''} onClick={() => edit(record,1)}>
              ویرایش  
            </Typography.Link> */}
            <EditTwoTone style={{marginLeft:"5px", fontSize: '18px'}}  onClick={() => edit(record,1)}/>
            <SettingTwoTone style={{marginRight:"5px", fontSize: '16px'}} />
          </span>
        );
      },
    },
  ];
  
  
  return (
    <Form form={form} component={false}>
    <Button disabled={select.selectedRowKeys.length===0} onClick={deleteItems} className={"submitButton"} type="primary">
        حذف
    </Button>
    <Button  onClick={AccidenCreate} className={"submitButton"} type="primary">
        ایجاد
    </Button>
      <Table className={"listform"}
        bordered
        dataSource={data}
        rowSelection={rowSelection}
        rowKey={(record)=>record.id}
        columns={columns}
      />
      {response}
    </Form>
  );

};

export default ForumList;