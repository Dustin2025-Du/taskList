'use client'
import styles from "./page.module.css";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { Divider, List, Typography,Select} from 'antd';
import { useEffect, useState } from "react";
/**
 * init localstorage data
 */
let data:any = window.localStorage.getItem("taskList");
if(data){
  data=JSON.parse(data)
}else{
  data=[]
}
export default function Home() {
  const [form] = Form.useForm();//form object
  const [tasks, setTasks] = useState(data);// origin data
  const [taskList, setTaskList] = useState(data);// show data
  const [fieldName,setFieldName]=useState('');//filter select
  const [fieldValue,setFieldValue]=useState('');//filter value
  let flag='add';//action flag
  let curIndex=0;//data index
  
  

  const saveDataLocalStorage=()=>{
      console.log(tasks,'new Data')
      window.localStorage.setItem('taskList',JSON.stringify(tasks))
 
  }
  const updateData=()=>{
    setTasks([...tasks ]);
    setTaskList([...tasks ])
  }
  const onTaskFinish=(index:number)=>{
    tasks[index].status=tasks[index].status?0:1;
    updateData()
    saveDataLocalStorage();
  }
  const onEdit=(index:number)=>{
    const curItem=taskList[index]
    form.setFieldsValue({title:curItem.title,describe:curItem.describe})
    flag='edit';
    curIndex=index;
  }
  const onFinish = (values: any) => {
    if(flag=='add'){
      tasks.push({title:values.title,describe:values.describe,status:0})
      setTasks(tasks);
      setTaskList(tasks);
    }else if(flag=='edit'){
        tasks[curIndex]={title:values.title,describe:values.describe,status:0}
    }
    flag='add';
    form.setFieldsValue({title:'',describe:''})
    setFieldName('');
    setFieldValue('');
    updateData()
    saveDataLocalStorage();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onDelete=(index:any)=>{
    tasks.splice(index,1);
    updateData()
    saveDataLocalStorage();
  }
  const onSearch=()=>{
    const newArr=tasks.filter(((item: { [x: string]: string | string[]; })=>{
      return item[fieldName].indexOf(fieldValue)!=-1
    }))
    setTaskList([...newArr])
  }
  return (
    <>
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 22 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="title"
        name="title"
        rules={[{ required: true, message: 'Please input your title!' }]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="describe"
        name="describe"
        rules={[{ required: true, message: 'Please input your describe!' }]}
      >
        <Input/>
      </Form.Item>

      

      <Form.Item wrapperCol={{ offset: 2, span: 22 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    <Divider orientation="left">Task List</Divider>
    <div>
      &nbsp;&nbsp;Field:
      <Select
        style={{ width: 120 }}
        onSelect={(value)=>{setFieldName(value)}}
        value={fieldName}
        options={[
          { value: 'title', label: 'title' },
          { value: 'describe', label: 'describe' },
        ]}
      />
      &nbsp;&nbsp;
      <Input value={fieldValue} style={{ width:200 }} onChange={(event:any)=>{setFieldValue(event.target.value) }}/>
      &nbsp;&nbsp;
      <Button onClick={()=>{onSearch()}} type="primary" shape="circle" icon={<SearchOutlined />} />
    </div>
    <br/>
    <List
      bordered
      dataSource={taskList}
      renderItem={(item:any,index) => (
        <List.Item
        style={{background:item.status?'#CCC':''}}
        actions={[
          <a onClick={()=>{onEdit(index)}} key="list-loadmore-edit">edit</a>, 
          <a onClick={()=>(onDelete(index))} key="list-loadmore-delete">delete</a>,
          <a onClick={()=>{onTaskFinish(index)}} key="list-loadmore-finish">{item.status?'finish':'unfinish'}</a>, 
        ]}

        >
          <Typography.Text mark>[{index+1}-{item.title}]</Typography.Text> {item.describe}
        </List.Item>
      )}
    />
</>
  );
  
}
