import { Rating } from '@mui/material';
import { Flex, message, Rate } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// import { Flex, Rate } from 'antd';
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

const WatchCourseLesson = ({ course, activeLesson, setActiveLesson }) => {

    const [value, setValue] = useState(3);

    // if (course.chapters) {
    //     console.log(course?.chapters[0].title)
    //     console.log(course?.chapters[0].lessons[0].title)
    // }

    const nextLesson = () => {
        if (activeLesson.lessonIndex < course.chapters[activeLesson.chapterIndex].lessons.length - 1) {
            setActiveLesson({ ...activeLesson, lessonIndex: activeLesson.lessonIndex + 1 })
        } else {
            if (activeLesson.chapterIndex < course.chapters.length - 1) {
                setActiveLesson({ ...activeLesson, chapterIndex: activeLesson.chapterIndex + 1, lessonIndex: 0 })
            } else {
                setActiveLesson({ chapterIndex: -1, lessonIndex: -1 })
                message.success('congratulations, you are completed all course chapters')
            }
        }
    }

    return (
        <div className='hoho'>
            {
                (activeLesson?.lessonIndex >= 0 && activeLesson?.chapterIndex >= 0) ? (
                    <div className='watch-lesson'>
                        <div className='watchCourse-info-btn'>
                            <div className='watchCourse-info'>
                                <p className='chapter-title'>{course.chapters[activeLesson?.chapterIndex].title} </p>
                                <p className='lesson-title'>{activeLesson?.lessonIndex} - {course.chapters[activeLesson?.chapterIndex].lessons[activeLesson?.lessonIndex].title}</p>
                            </div>
                            <button className='next-lesson-btn' onClick={nextLesson}>Next Lesson</button>
                        </div>
                        <video
                            className='lesson-video'
                            controls
                            // ref={videoRef}
                            src={course.chapters[activeLesson?.chapterIndex].lessons[activeLesson?.lessonIndex].videoUrl}
                            // width={'100%'}
                            height={'400px'}
                        ></video>


                    </div>
                ) : (
                    (activeLesson?.lessonIndex < 0 && activeLesson?.chapterIndex < 0) ? (
                        <div className='watch-koko'>
                            <Link to={'/'}>
                                back to home
                            </Link>
                            <p>
                                congratulations, you completed all course chapters
                            </p>

                            <div className='rating-input'>
                                <Flex gap="middle" vertical>
                                    <Rate tooltips={desc} onChange={setValue} value={value} />
                                    {value ? <span>{desc[value - 1]}</span> : null}
                                </Flex>
                            </div>

                        </div>
                    ) : (
                        <div className='watch-koko'>
                            <p>
                                please select the first Lesson
                            </p>
                        </div>
                    )
                )
            }

        </div>
    )
}

export default WatchCourseLesson