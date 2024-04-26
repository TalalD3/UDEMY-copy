import React, { useState } from 'react'

const WatchCourseSidebar = ({ course, activeLesson, setActiveLesson }) => {
    const [openChapter, setOpenChapter] = useState(null)
    // console.log(course);

    return (
        <div className='watchCourse-sidebar'>
            <p className='course-title'>{course.title}</p>
            <div className='chapters'>
                {course.chapters &&
                    course.chapters.map((chapter, chapterIndex) => (
                        <div className='chapter' key={chapterIndex}>
                            <div className='chapter-title-info' onClick={() => setOpenChapter(chapterIndex)}>
                                <i class={`bx bx-play-circle play-icon`}></i>
                                <p >{chapterIndex}- {chapter.title}</p>
                            </div>
                            {
                                (openChapter === chapterIndex || activeLesson?.chapterIndex === chapterIndex ) &&
                                <div className='chapter-lessons'>
                                    {
                                        chapter.lessons.map((lesson, lessonIndex) => (
                                            <div
                                                key={lessonIndex}
                                                className={`chapter-lesson ${(activeLesson?.lessonIndex === lessonIndex && activeLesson?.chapterIndex === chapterIndex ) && 'chapter-playLesson'}`}
                                                onClick={() => setActiveLesson({chapterIndex,lessonIndex})}
                                            >
                                                <p >{lesson.title}</p>
                                            </div>
                                        ))
                                    }
                                </div>}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default WatchCourseSidebar