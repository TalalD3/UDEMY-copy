import { Button, Form, Input, InputNumber, Radio, Select, Space, Upload } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';

import UploadImage from './UploadImage';
import upload_area from "../../assets/icons/cloud-upload-regular-240.png"
import ImgCrop from 'antd-img-crop';
import UploadImage1 from './UploadImageForm';
import UploadImageForm from './UploadImageForm';
import { ShopContext } from '../../Context/ShopContext';


const CourseForm = ({ form, imageUrl, setImageUrl, course }) => {

    const { getCategories } = useContext(ShopContext);

    const category = getCategories();

    const { Option } = Select;

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            // Extract URL from the response and set it as the image URL
            const uploadedImageUrl = info.file.response.url; // Assuming the response contains the URL of the uploaded image
            setImageUrl(uploadedImageUrl);
        }
    };

    const onFinish = (values) => {
        values.image = imageUrl
    };


    return (
        <>
            {course.title &&
                <Form
                    initialValues={course}
                    layout="inline"
                    style={{ justifyContent: "start" }}
                    form={form}
                    onFinish={onFinish}
                >

                    <p className='filed-title mt'>Course title</p>
                    <Form.Item
                        style={{ width: "100%", height: 20, marginBottom: 10, marginRight: 0, marginTop: -25 }}
                        name='title'
                        rules={[{ required: true, message: 'Please input the title course' }]} >
                        <Input placeholder="e.g 'web developer'" />
                    </Form.Item>

                    <span className='filed-title'>Course price</span><br />
                    <Form.Item
                        style={{ width: "100%", height: 20, marginBottom: 10, marginRight: 0, marginTop: -25 }}
                        name='price'
                        rules={[{ required: true, message: 'Please input the price course' }]} >
                        <InputNumber placeholder="e.g '599'" style={{ width: '100%' }} addonAfter="DA" />
                    </Form.Item>

                    <span className='filed-title'>Course small description</span>
                    <Form.Item
                        name="small_description"
                        style={{ width: "100%", marginBottom: -12, marginRight: 0, marginTop: -25, }}
                        rules={[{ required: true, message: 'Please input the description course' }]}
                    >
                        <Input.TextArea style={{ height: 80, resize: 'none' }} showCount maxLength={200} />
                    </Form.Item>

                    <span className='filed-title'>Course description</span>
                    <Form.Item
                        name="description"
                        style={{ width: "100%", marginBottom: -12, marginRight: 0, marginTop: -25, }}
                        rules={[{ required: true, message: 'Please input the description course' }]}
                    >
                        <Input.TextArea style={{ height: 120, }} />
                    </Form.Item>

                    <span className='filed-title'>Course category</span>
                    <Form.Item
                        name="category"
                        // label="Select"
                        hasFeedback
                        style={{ width: "100%", height: 20, marginBottom: 10, marginRight: 0, marginTop: -25 }}
                        rules={[{ required: true, message: 'Please select the course category ' }]}
                    >
                        <Select placeholder="Please select a category">
                            {category.map(category => (
                                <Option key={category.name} value={category.name}>{category.name}</Option>
                            ))}
                            {/* <Option value="usa">U.S.A</Option> */}
                        </Select>
                    </Form.Item>

                    <span className='filed-title'>Course image</span>
                    <Form.Item
                        name="image"
                        rules={[{ required: true, message: 'Please upload an image!', }]}
                    >
                        <ImgCrop rotationSlider aspect={5 / 3}>
                            <Upload
                                name="logo"
                                action="http://localhost:5000/upload/video"
                                listType="text"
                                maxCount={1}
                                onChange={handleChange} // Handle change event to get the uploaded image URL
                            >
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                        </ImgCrop>
                    </Form.Item>

                </Form>
            }
        </>
    );
};
export default CourseForm;