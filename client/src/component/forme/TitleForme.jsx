import React, { useEffect, useRef } from 'react';

import { useState } from 'react';

import AddChapter from './AddChapter';

import './titleforme.css'
import CourseForm from './CourseForm';
import UploadImageForm from './UploadImageForm';
import { Button, Form, message, Modal } from 'antd';
import axios from 'axios';
import AddChapters from './AddChapters';
import { useNavigate, useParams } from 'react-router-dom';


const TitleForme = ({ course, what }) => {

    const { courseId } = useParams();
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);


    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
                const { data } = response;
                // setCourse(data.course);

                // Extract chapters from the course object and update the chapters state
                if (data.course && data.course.chapters) {
                    setChapters(data.course.chapters);
                }
            } catch (error) {
                console.error('Error fetching course:', error);
                // Handle error if needed
            }
        };

        fetchCourse();

        return () => {
            // Cleanup logic if needed
        };
    }, [courseId]);

    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null); // State to store the image URL

    const handleSubmit = (values) => {
        console.log('Form submitted with values:', values);
    };

    const handleFinishFailed = (errorInfo) => {
        console.error('Form submission failed:', errorInfo);
    };

    const publishCourse = async () => {
        try {
            // Validate the form
            await form.validateFields();

            // Check if at least one chapter is saved
            if (chapters.length < 1) {
                message.error('At least one chapter must be Added');
                return;
            }

            let isError = false;
            chapters.forEach(chapter => {
                if (chapter.lessons.length < 1) {
                    message.error('At least one lesson must be Added on chapter');
                    isError = true; // Set isError flag to true if an error is encountered
                    return;
                }
            });
            if (isError) {
                return; // Exit the function if an error is encountered
            }

            // Get form values
            const values = await form.getFieldsValue();

            // Add the image URL to the form values
            values.image = imageUrl ? imageUrl : course?.image;

            // values.title = values.title ? values.title : courseChaptres.title

            // Construct the course object
            const course = { ...values, chapters, isPublish:true };

            // Submit the form  http://localhost:5000/api/addcourse
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/addcoursedetails/${courseId}`, course);

            const { data } = response;

            if (data.success) {
                message.success('course added successfully');
                navigate(`/`);
                window.location.reload();
            } else {
                message.error('course added failed');
            }

            // Reset form state if necessary
            //   form.resetFields();

            // Display success message
            // message.success('Course added successfully');
        } catch (error) {
            // Handle form validation or submission errors
            console.error('Error:', error);
            // message.error('Failed to add course. Please try again.');
        }
    };

    const saveCourse = async () => {
        try {

            await form.validateFields(['title']);
            
            // Get form values
            const values = await form.getFieldsValue();
            // console.log(values);

            // Add the image URL to the form values
            values.image = imageUrl ? imageUrl : values.image ? values.image : null;
    
            // values.title = values.title ? values.title : courseChaptres.title

            // Construct the course object
            const course = { ...values, chapters };
            // console.log(course);

            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/addcoursedetails/${courseId}`, course);

            const { data } = response;

            if (data.success) {
                message.success('course saved successfully');
                // navigate(`/`);
            } else {
                message.error('course saved failed');
            }

        } catch (error) {
            // Handle form validation or submission errors
            console.error('Error:', error);
            // message.error('Failed to add course. Please try again.');
        }
    };


    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        setIsModalOpen(false);
        try {
            const response = await axios.delete(`http://localhost:5000/api/courses/${courseId}`);
            const { data } = response;

            if (data.success) {
                message.success('course deleted successfully');
                navigate(`/`);
            }
        } catch (error) {
            message.error('course deleted failed');
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <div className='container addCourse'>
            <div className="flex">
                <div>
                    <h1 className='addcourse-title'>Course setup</h1>
                    <p className='addcourse-paragraph'>complete all feilds</p>
                </div>
                <div className='btn-container'>

                    <Button className='ml' type='text' onClick={showModal} >
                        Delete
                    </Button>

                    <Modal title="Are you sure to delete this chapter ?" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <p>this chapter will be permanently deleted along with its lessons</p>
                    </Modal>

                    <Button type="default" onClick={saveCourse}>
                        save
                    </Button>

                    <Button type="primary" onClick={publishCourse}>
                        Publish
                    </Button>
                    {/* <Button type="primary" onClick={publishCourse}>
                        {what} Course
                    </Button> */}
                </div>
            </div>

            <div className='grid'>

                <div className='card'>
                    <h2 className='addcourse-subtitle'>Customize your course</h2>

                    <Form form={form} onFinish={handleSubmit} onFinishFailed={handleFinishFailed}>
                        {/* <FormComponent /> */}
                        <CourseForm form={form} imageUrl={imageUrl} setImageUrl={setImageUrl} course={course} />
                    </Form>
                    
                    <img className='course-image-create' src={imageUrl ? imageUrl : course.image} alt="" />

                    {/* <UploadImageForm /> */}
                </div>

                <div className='card'>
                    <h2 className='addcourse-subtitle'>Customize your chapters</h2>
                    <AddChapters chapters={chapters} setChapters={setChapters} saveCourse={saveCourse} />
                    {/* <AddChapter courseChaptres={courseChaptres} setCourseChaptres={setCourseChaptres} /> */}
                </div>
            </div>
        </div>
    );
}

export default TitleForme;
