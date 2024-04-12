import React, { useEffect, useRef } from 'react';

import { useState } from 'react';

import AddChapter from './AddChapter';

import './titleforme.css'
import CourseForm from './CourseForm';
import UploadImageForm from './UploadImageForm';
import { Button, Form, message } from 'antd';
import axios from 'axios';


const TitleForme = () => {
    // const formRef = useRef(null); // Ref to the form

    const [courseChaptres, setCourseChaptres] = useState([]);
    const [form] = Form.useForm();
    // const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State to store the image URL
    ;

    const handleSubmit = (values) => {
        console.log('Form submitted with values:', values);
        // You can handle form submission here
        // For now, navigate to another page
        //   history.push('/another-page');
    };

    const handleFinishFailed = (errorInfo) => {
        console.error('Form submission failed:', errorInfo);
        // You can handle form submission failure here
    };

    const handleButtonClick1 = async () => {
        form.validateFields().then(() => {
            form.submit(); // Submit the form when the button is clicked
            if (courseChaptres.length < 1) {
                message.error('At least one chapter must be saved');
                return;
            }
            const values = form.getFieldsValue();
            values.image = imageUrl
            const course = { ...values, courseChaptres }
            console.log('course values:', course);

            // try {
            //     await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/addcourse`, course);
            // } catch (error) {
            //     console.error(error);
            // }

            // console.log('Chapter:', courseChaptres);
            message.success('Course added successfully');
        }).catch((error) => {
            console.error('Form validation error:', error);
        });
    };

    const handleButtonClick = async () => {
        try {
          // Validate the form
          await form.validateFields();
          
          // Check if at least one chapter is saved
          if (courseChaptres.length < 1) {
            message.error('At least one chapter must be saved');
            return;
          }
      
          // Get form values
          const values = await form.getFieldsValue();
          
          // Add the image URL to the form values
          values.image = imageUrl;
      
          // Construct the course object
          const course = { ...values, courseChaptres };
      
          // Submit the form
          await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/addcourse`, course);
      
          // Reset form state if necessary
        //   form.resetFields();
      
          // Display success message
          message.success('Course added successfully');
        } catch (error) {
          // Handle form validation or submission errors
          console.error('Error:', error);
          message.error('Failed to add course. Please try again.');
        }
      };
      
      
    return (
        <div className='container addCourse'>
            <div className="flex">
                <div>
                    <h1 className='addcourse-title'>Course setup</h1>
                    <p className='addcourse-paragraph'>complete all feilds</p>
                </div>
                <Button type="primary" onClick={handleButtonClick}>
                    Add Course
                </Button>
            </div>

            <div className='grid'>

                <div className='card'>
                    <h2 className='addcourse-subtitle'>Customize your course</h2>

                    <Form form={form} onFinish={handleSubmit} onFinishFailed={handleFinishFailed}>
                        {/* <FormComponent /> */}
                        <CourseForm form={form} imageUrl={imageUrl} setImageUrl={setImageUrl} />
                    </Form>

                    {/* <UploadImageForm /> */}
                </div>

                <div className='card'>
                    <h2 className='addcourse-subtitle'>Customize your chapitres</h2>
                    <AddChapter courseChaptres={courseChaptres} setCourseChaptres={setCourseChaptres} />
                </div>
            </div>
        </div>
    );
}

export default TitleForme;
