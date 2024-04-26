import React, { useState } from 'react'
import TitleForme from '../component/forme/TitleForme'
import { Button, Form, Input, message } from 'antd'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import './css/course.css'

const AddCourse = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    // console.log('Received values:', values.title);
    if (!localStorage.getItem('auth-token')) {
      message.info("please login first");
      navigate('/')
    }
    let response;
    try {
      fetch('http://localhost:5000/api/addcourse', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'title': values.title })
      }).then(resp => resp.json()).then(data => data.course).then((course)=>{
        navigate(`/teacher/addCourse/${course._id}`);
      });
      // console.log(course._id);
      // const response = await axios.post("/api/courses", values);
      // navigate(`/`);
      // message.success("Course created");
      message.info("Complete all entry fields");
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <div className='container'>

      <div className='addCourse'>
        {/* <TitleForme /> */}
        <p className='big-title'>Name your course</p>
        <p className='description'>What would you like to name your course? Don't worry, you can always change this later.</p>
        <p className='input-title'>course title</p>
        <Form
          layout="inline"
          style={{ justifyContent: "start", gap: '5%' }}
          // initialValues={chaptreDetails}
          // onValuesChange={handleChaptersFormChange}
          // form={form}
          onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        >
          <Form.Item
            style={{ width: 350, marginBottom: 20, marginRight: 0, marginLeft: 0 }}
            name='title'
            rules={[{ required: true, message: 'Please input the course title' }]}
          >
            <Input placeholder="chapter title" />
          </Form.Item>

          <Form.Item
            style={{ marginRight: 0, marginLeft: 0 }}
          >

            <Link to='/'>
              <Button type="link" htmlType="submit" style={{ color: '#000' }} >
                Cancel
              </Button>
            </Link>

            <Button type="primary" htmlType="submit" style={{ color: '#fff', background: '#000' }} >
              Add
            </Button>

          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default AddCourse