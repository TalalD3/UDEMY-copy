import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import AddChapter from '../forme/AddChapter';
import axios from 'axios';

const AddChapterForm = () => {
  const { courseId, chapterId } = useParams();

  return (
    <section className='section'>
      <div className="container">
        <Link to={`/teacher/addCourse/${courseId}`}>Back to the Course</Link>
        <div>
          {/* <AddChapter courseChaptres={chapter} setCourseChaptres={setChapter} /> */}
          <AddChapter />
        </div>
      </div>
    </section>
  )
}

export default AddChapterForm