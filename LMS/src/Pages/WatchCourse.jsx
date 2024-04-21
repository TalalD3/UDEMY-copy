import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import WatchCourseSidebar from '../component/watchCourse/WatchCourseSidebar';

import './css/watchCourse.css'
import WatchCourseLesson from '../component/watchCourse/WatchCourseLesson';

const WatchCourse = () => {

    const { courseId } = useParams();
    const [course, setCourse] = useState({});
    const [activeLesson, setActiveLesson] = useState({})


    useEffect(() => {
        async function fetchData() {
            let responceData;
            if (courseId) {
                await fetch(`http://localhost:5000/api/courses/${courseId}`)
                    .then(resp => resp.json()).then(data => responceData = data)
                if (responceData.success) {
                    setCourse(responceData.course);
                }
                else {
                    window.location.replace('/');
                    message.error('course not found');
                }
            }
        }

        fetchData();

    }, [courseId]);

    return (
        <div className="watchCourse">
            
            <WatchCourseSidebar course={course} activeLesson={activeLesson} setActiveLesson={setActiveLesson} />
            <WatchCourseLesson course={course} activeLesson={activeLesson} setActiveLesson={setActiveLesson} />

        </div>
    )
}

export default WatchCourse