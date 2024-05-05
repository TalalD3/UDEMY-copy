import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import WatchCourseSidebar from '../component/watchCourse/WatchCourseSidebar';

import './css/watchCourse.css'
import WatchCourseLesson from '../component/watchCourse/WatchCourseLesson';
import { ShopContext } from '../Context/ShopContext';

const WatchCourse = () => {
    const { getUserData, getComments } = useContext(ShopContext);

    const { courseId } = useParams();
    const [course, setCourse] = useState({});
    const [user, setUser] = useState({});
    const [comment, setComment] = useState({
        comment: '',
        rating: 4,
    });
    const [activeLesson, setActiveLesson] = useState({})



    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const user = await getUserData();
                setUser(user);
            } catch (error) {
                console.log('error while gettin user data', error);
            }
        }

        fetchUserData();

        async function fetchData() {
            let responceData;
            if (courseId) {
                await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/courses/${courseId}`)
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

        const fetchComments = async () => {
            try {
                const fetchingcomments = await getComments(courseId);
                // setPrevComment(fetchingcomments.comments)
                console.log(fetchingcomments);
                console.log(fetchingcomments.comments[0]);
                setComment(fetchingcomments.comments[0]);

            } catch (error) {
                console.log(error);
            }
        }

        fetchComments();

    }, [courseId]);

    return (
        <section className="section1">
            <div className="container watchCourse">

                <WatchCourseSidebar course={course} activeLesson={activeLesson} setActiveLesson={setActiveLesson} />
                <WatchCourseLesson course={course} activeLesson={activeLesson} setActiveLesson={setActiveLesson} user={user} fullComment={comment} setComment={setComment} />

            </div>
        </section>
    )
}

export default WatchCourse