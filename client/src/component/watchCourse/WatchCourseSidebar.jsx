import React, { useState } from 'react'

const WatchCourseSidebar = ({ course, activeLesson, setActiveLesson }) => {
    const [openChapter, setOpenChapter] = useState(null)
    const [openMenu, setOpenMenu] = useState(true);
    // console.log(course);

    return (
        <div>
            <div className='menu-sideBar' onClick={() => setOpenMenu(!openMenu)}>
                <i class='bx bx-menu watchCourse-sidebar-menu'></i>
                <p>{openMenu ? 'close menu' : 'open menu'}</p>
            </div>
            {openMenu && <div className='watchCourse-sidebar'>
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
                                    (openChapter === chapterIndex || activeLesson?.chapterIndex === chapterIndex) &&
                                    <div className='chapter-lessons'>
                                        {
                                            chapter.lessons.map((lesson, lessonIndex) => (
                                                <div
                                                    key={lessonIndex}
                                                    className={`chapter-lesson ${(activeLesson?.lessonIndex === lessonIndex && activeLesson?.chapterIndex === chapterIndex) && 'chapter-playLesson'}`}
                                                    onClick={() => setActiveLesson({ chapterIndex, lessonIndex })}
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
            </div>}
        </div>
    )
}

export default WatchCourseSidebar