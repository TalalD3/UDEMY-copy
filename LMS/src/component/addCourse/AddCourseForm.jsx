import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TitleForme from '../forme/TitleForme';

const AddCourseForm = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});

  useEffect(() => {

    const getMyCourseById = async () => {
      if (localStorage.getItem('auth-token')) {
        await fetch('http://localhost:5000/api/getMyCourseById',  {
          method: 'POST',
          headers: {
              Accept: 'application/form-data',
              'auth-token': `${localStorage.getItem('auth-token')}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 'courseId': courseId })
        }).then(resp => resp.json()).then(data => data.course).then(course => { setCourse(course)})
      }
    }

    getMyCourseById();


  }, [courseId])

  return (
    <div>
      <TitleForme course={course} what={'create'} />
    </div>
  )
}

export default AddCourseForm