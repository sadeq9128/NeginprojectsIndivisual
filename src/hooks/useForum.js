import React, { useState,useEffect } from 'react';
import { Collapse, Input, Button, Form, message, Avatar, Tag } from 'antd';
import {Row,Col } from 'antd';
import {
  DislikeTwoTone,LikeTwoTone,DeleteTwoTone,EyeFilled
} from '@ant-design/icons';
import axios from "../axios";

const {TextArea} = Input;

const { Panel } = Collapse;
let layout=null;
let layoutAdv=null;
let layoutDisadv=null;

function useForum({url, data = null}) {
    const [form] = Form.useForm();
    const [formAdv] = Form.useForm();
    const [formDis] = Form.useForm();
    const [response, setResponse] = useState(null);
    const [showFormAdv,setShowFormAdv]=useState(false);
    const [showFormDis,setShowFormDis]=useState(false);
    const [apiCall,setApiCall]=useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [change, setChange] = useState(0);

    const addComment=(description,advdis_id,type) => {
        setIsLoading(true);
        let values={};
        values.adv_dis_id=advdis_id;
        values.type=type;
        values.description=description;

        axios.post("https://baje724.ir/api/survey/forum",values)
            .then( response => {
                console.log("دیدگاه شما ثبت شد.");
                message.success("دیدگاه شما ثبت شد");
                setIsLoading(false);
                setChange(change+1);
                form.resetFields();
            } )
            .catch( error => {
                message.error("خطا در ثبت دیدگاه");
                console.log(error);
                setIsLoading(false);
        } );
    }

    const addAdvDis=(values,type)=>{
        setIsLoading(true);
        values.type=type;
        values.survey_id=data;
        console.log(values);

        axios.post("https://baje724.ir/api/survey/advdis",values)
            .then( response => {
                console.log("دیدگاه شما ثبت شد.");
                message.success("دیدگاه شما ثبت شد");
                setIsLoading(false);
                if(type==="adv")
                setShowFormAdv(!showFormAdv);
                if(type==="dis")
                setShowFormDis(!showFormDis);
                setChange(change+1);
                formAdv.resetFields();
            } )
            .catch( error => {
                message.error("خطا در ثبت دیدگاه");
                console.log(error);
                setIsLoading(false);
        } );
    }

    const addLikeDislike=(type,reaction,id)=>{
        let url="https://baje724.ir/api/survey/reaction/advdis";
        if(type!=="disadv_id"){
            url="https://baje724.ir/api/survey/reaction/comment";
            
        }
        let values={};
        values[type]=id;
        values.reaction=reaction;
        console.log(values);

        axios.post(url,values)
            .then( response => {
                console.log("واکنش شما ثبت شد");
                message.success("واکنش شما ثبت شد");
                setChange(change+1);
            } )
            .catch( error => {
                message.error("خطا در ثبت واکنش");
                console.log(error);
        } );

    }

    const showFormAdvChange=()=>{
        setShowFormAdv(!showFormAdv);
        setApiCall(true);
        setChange(change+1);
    }

    const showFormDisChange=()=>{
        setShowFormDis(!showFormDis);
        setApiCall(true);
        setChange(change+1);
    }

    const deleteComment=(id)=>{
        setIsLoading(true);
        console.log(id);
        axios.delete("https://baje724.ir/api/survey/advdis/"+id)
            .then( response => {
                console.log("حذف شد");
                message.success("حذف شد");
                setIsLoading(false);
                setChange(change+1);
                setApiCall(false);
            } )
            .catch( error => {
                message.error("خطا به هنگام حذف");
                console.log(error);
                setIsLoading(false);
        } );
    }

    useEffect(() => {
      const fetchData = async () => {
         try {
            axios.get(url+data)
               .then((res) => {
                    let adv=res.data.advantages;
                    let disadv=res.data.disadvantages;
                    let comment=res.data.comments;
                    let title=null;
                    try{
                    if(!apiCall){
                        console.log("api call");
                        layoutAdv=adv.map((el)=>{
                            title=<div className={"commentheader"}>
                                    <span style={{fontSize:"16px"}}>{el.comment}&nbsp; &nbsp;<Tag icon={<EyeFilled />} color="rgb(154, 178, 189)">{
                                        comment.filter(elComment=>{
                                            if(elComment.disadv_id===el.id){
                                                return elComment;
                                            }
                                        }).length
                                    } </Tag>
                                    </span>
                                    <span>
                                        <span style={{color:"blue"}}><LikeTwoTone onClick={()=>addLikeDislike("disadv_id","like",el.id)}/> {el.likes}</span>
                                        <span>&nbsp; &nbsp;</span>
                                        <span style={{color:"red"}}><DislikeTwoTone twoToneColor="#eb2f96" onClick={()=>addLikeDislike("disadv_id","dislike",el.id)}/> {el.dislikes}</span>
                                        <span>&nbsp; &nbsp;</span>
                                        <span style={{color:"red"}}><DeleteTwoTone twoToneColor="#805101" onClick={()=>deleteComment(el.id)}/></span>
                                    </span>
                                </div>
                            return (
                                <div>
                                    <Collapse bordered={false} accordion>
                                        <Panel header={title} key={el.id}>
                                            {comment.map(elComment=>{
                                                if(elComment.disadv_id===el.id){
                                                    return (
                                                        <div className={"commentAdv"}>
                                                            <span className={"commentInfo"}>
                                                                <Avatar style={{marginBottom:"8px"}} size={25} src="https://avatars.githubusercontent.com/u/4776235?s=40&v=4" />&nbsp; &nbsp;
                                                                {elComment.first_name} {elComment.last_name} ---- {elComment.date}
                                                            </span>
                                                            <p style={{fontSize:"12px"}} key={elComment.id}>&nbsp; {elComment.description}</p>
                                                            <span>
                                                                <span style={{color:"blue"}}><LikeTwoTone onClick={()=>addLikeDislike("comment_id","like",elComment.id)}/> {elComment.likes}</span>
                                                                <span>&nbsp; &nbsp;</span>
                                                                <span style={{color:"red"}}><DislikeTwoTone twoToneColor="#eb2f96"  onClick={()=>addLikeDislike("comment_id","dislike",elComment.id)}/> {elComment.dislikes}</span>
                                                            </span>
                                                            <hr className="commentHr"/>
                                                        </div>
                                                    );
                                                }
                                            })}
                                            <Form  form={form} name={el.id} 
                                            onFinish={()=>addComment(form.getFieldValue("description"+el.id),el.id,"adv")}>
                                            <Form.Item
                                                name={"description"+el.id}
                                            > 
                                                <TextArea placeholder="دیدگاه خود را وارد کنید" className={""} showCount maxLength={500}/>
                                            </Form.Item>
                                            <div style={{textAlign:"left"}}>
                                            <Button loading={isLoading} className={""} type="primary" htmlType="submit">
                                            درج دیدگاه
                                            </Button>
                                            </div>
                                            </Form>
                                        </Panel>
                                    </Collapse>
                                </div>
                            );
                        });
                        // -------------------------------------------------------------------------------------------
                        // -------------------------------------------------------------------------------------------
                        layoutDisadv=disadv.map((el)=>{
                            title=<div className={"commentheader"}>
                                    <span style={{fontSize:"16px"}}>{el.comment}&nbsp; &nbsp;<Tag icon={<EyeFilled />} color="rgb(154, 178, 189)">{
                                        comment.filter(elComment=>{
                                            if(elComment.disadv_id===el.id){
                                                return elComment;
                                            }
                                        }).length
                                    } </Tag>
                                    </span>
                                    <span>
                                        <span style={{color:"blue"}}><LikeTwoTone onClick={()=>addLikeDislike("disadv_id","like",el.id)}/> {el.likes}</span>
                                        <span>&nbsp; &nbsp;</span>
                                        <span style={{color:"red"}}><DislikeTwoTone twoToneColor="#eb2f96"  onClick={()=>addLikeDislike("disadv_id","dislike",el.id)}/> {el.dislikes}</span>
                                        <span>&nbsp; &nbsp;</span>
                                        <span style={{color:"red"}}><DeleteTwoTone twoToneColor="#805101" onClick={()=>deleteComment(el.id)}/></span>
                                    </span>
                                </div>
                            return (
                                <div>
                                    <Collapse bordered={false} accordion>
                                        <Panel header={title} key={el.id}>
                                            {comment.map(elComment=>{
                                                if(elComment.disadv_id===el.id){
                                                    return (
                                                        <div className={"commentDisadv"}>
                                                            <span className={"commentInfo"}>
                                                                <Avatar style={{marginBottom:"8px"}} size={25} src="https://avatars.githubusercontent.com/u/4776235?s=40&v=4" />&nbsp; &nbsp;
                                                                {elComment.first_name} {elComment.last_name} ---- {elComment.date}</span>
                                                            <p style={{fontSize:"12px"}} key={elComment.id}>&nbsp; {elComment.description}</p>
                                                            <span>
                                                                <span style={{color:"blue"}}><LikeTwoTone onClick={()=>addLikeDislike("comment_id","like",elComment.id)}/> {elComment.likes}</span>
                                                                <span>&nbsp; &nbsp;</span>
                                                                <span style={{color:"red"}}><DislikeTwoTone twoToneColor="#eb2f96"  onClick={()=>addLikeDislike("comment_id","dislike",elComment.id)}/> {elComment.dislikes}</span>
                                                            </span>
                                                            <hr className="commentHr"/>
                                                        </div>
                                                    );
                                                }
                                            })}
                                            <Form form={form} name="control-hooks" 
                                            onFinish={()=>addComment(form.getFieldValue("description"+el.id),el.id,"dis")}>
                                            <Form.Item
                                                name={"description"+el.id}
                                            > 
                                                <TextArea placeholder="دیدگاه خود را وارد کنید" className={""} showCount maxLength={500}/>
                                            </Form.Item>
                                            <div style={{textAlign:"left"}}>
                                            <Button loading={isLoading} className={""} type="primary" htmlType="submit">
                                            درج دیدگاه
                                            </Button>
                                            </div>
                                            </Form>
                                        </Panel>
                                    </Collapse>
                                </div>
                            );
                        });
                    }
                        setApiCall(false);
                        layout=<div className={"comments"}>
                            <div className={"commentsTitleAdvDis"}>
                                <h4>مزایا:</h4>
                                <Button onClick={showFormAdvChange}>افزودن</Button>
                            </div>
                            {showFormAdv && <Form form={formAdv} name={"advForm"}
                             onFinish={()=>addAdvDis(formAdv.getFieldsValue(),"adv")}>
                                <Row>
                                    <Col flex={5}>
                                        <Form.Item
                                            style={{margin:"0px 15px 5px 15px"}}
                                            name="comment"> 
                                            <TextArea placeholder="نظر خود را وارد کنید"/>
                                        </Form.Item>
                                    </Col>
                                    <Col flex={2}>
                                        <Row>
                                        <Button loading={isLoading} type="primary" htmlType="submit">درج مزیت</Button>
                                        </Row>
                                        <Row>
                                        <Button style={{marginTop:"5px"}}  onClick={showFormAdvChange}> انصراف</Button>
                                        </Row>
                                    </Col>
                                </Row>
                            </Form>}
                            {layoutAdv}
                            {/* ----------------------------------------------------------------------------------- */}
                            {/* ----------------------------------------------------------------------------------- */}
                            <p></p>
                            <div className={"commentsTitleAdvDis"}>
                                <h4>معایب:</h4>
                                <Button onClick={showFormDisChange}>افزودن</Button>
                            </div>
                            {showFormDis && <Form form={formDis} name={"disForm"}
                             onFinish={()=>addAdvDis(formDis.getFieldsValue(),"dis")}>
                             <Row>
                                 <Col flex={5}>
                                     <Form.Item
                                         style={{margin:"0px 15px 5px 15px"}}
                                         name="comment"> 
                                         <TextArea placeholder="نظر خود را وارد کنید"/>
                                     </Form.Item>
                                 </Col>
                                 <Col flex={2}>
                                     <Row>
                                     <Button loading={isLoading} type="primary" htmlType="submit">درج عیب</Button>
                                     </Row>
                                     <Row>
                                     <Button style={{marginTop:"5px"}} onClick={showFormDisChange}> انصراف</Button>
                                     </Row>
                                 </Col>
                             </Row>
                            </Form>}
                            {layoutDisadv}
                        </div>
                    
                    }catch(e){
                        console.log(e);
                    }
                    setResponse(layout);
               })
               .finally(() => {
                  setIsLoading(false);
               });
         } catch (err) {
            setError(err);
         }
      };

      fetchData();
   }, [url, data,change]);

   return { response, error, isLoading };
}

export default useForum;