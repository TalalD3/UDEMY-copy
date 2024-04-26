import { Button, Form, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { DisplayChapter } from './DisplayChapter'
import { Reorder } from 'framer-motion'
import { useParams } from 'react-router-dom'
import axios from 'axios'


const AddChapters = ({ chapters, setChapters,saveCourse }) => {
    const { courseId } = useParams();
    const [form] = Form.useForm();


    const onFinish = async (values) => {
        // console.log('Received values:', values.title);
        if (!localStorage.getItem('auth-token')) {
            message.info("please login first");
            navigate('/')
        }
        try {
            fetch('http://localhost:5000/api/addchapter', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'title': values.title, courseId })
            })
                .then(resp => resp.json())
                .then(data => {
                    const course = data.course;
                    // console.log(course);
                    // course.chapters.forEach(chapter => {
                    //     console.log(chapter.title);
                    // });
                    setChapters(course.chapters);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            message.success("Chapter created");
            form.resetFields();
        } catch (error) {
            console.log(error);
            message.error("Something went wrong");
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <div className="add-chapter-input">
                <Form
                    form={form}
                    layout="inline"
                    style={{ justifyContent: "start", gap: '5%' }}
                    // onValuesChange={handleChaptersFormChange}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        style={{ width: "75%", height: 20, marginBottom: 10, marginRight: 0, marginLeft: 0 }}
                        name='title'
                        rules={[{ required: true, message: 'Please input the chapter title' }]}
                    >
                        <Input placeholder="chapter title" />
                    </Form.Item>

                    <Form.Item
                        style={{ width: "20%", marginRight: 0, marginLeft: 0 }}
                    >
                        <Button type="primary" htmlType="submit" block >
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <div className="display-chapters">
                {chapters && (
                    <Reorder.Group axis="y" onReorder={setChapters} values={chapters}>
                        {chapters?.map((chaptre, index) => (
                            <DisplayChapter key={chaptre._id} chaptre={chaptre} index={index} saveCourse={saveCourse} />
                        ))}
                    </Reorder.Group>
                )}
            </div>
        </div>
    )
}

export default AddChapters