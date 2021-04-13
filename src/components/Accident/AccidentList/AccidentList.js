import React, { useState,useEffect } from 'react';
import { Table, Input, Form, message,Button} from 'antd';
import "./AccidentList.css";
import axios from "../../../axios";
import {
  EditTwoTone,CheckCircleTwoTone,CloseCircleTwoTone,SettingTwoTone
} from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
const { Search } = Input;


let originData = [];
let oldWord='';
var highlight;var search;

const AccidentList = (props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [change,setChange] = useState(null);
  const [select, setSelect] = useState({
    selectedRowKeys: [],
  });
  const [searchText,setSearchText]=useState('');
  const [searchedColumn,setSearchedColumn]=useState('');
  const [searching,setSearching]=useState(false);

  useEffect(() => {
    axios.get("/admin/incident/")
      .then( response => {
          originData=[...response.data];
          setData(originData);
          console.log(response.data);
      } )
      .catch( error => {
          message.error("نتیجه ای یافت نشد.");
      } );
  },[change])
  
  const { selectedRowKeys } = select.selectedRowKeys;

  const edit = (record,op) => {
  };

  const AccidenCreate = () => {
    props.formHandler(true);
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
      console.log("*");
    },500);
  };


  const columns = [
    {
      title: 'نوع حادثه',
      dataIndex: 'type',
      key: 'type',
      width: '7%',
      ...getColumnSearchProps('type'),
    },
    {
      title: 'محل وقوع حادثه',
      dataIndex: 'location',
      key: 'location',
      width: '10%',
    },
    {
      title: 'زمان',
      dataIndex: 'date',
      width: '20%',
      key: 'date',
    },
    {
      title: 'علت حادثه',
      dataIndex: 'reason',
      width: '20%',
      key: 'reason',
    },
    {
      title: 'ابزارها',
      width: '6%',
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
    </Form>
  );

};

export default AccidentList;