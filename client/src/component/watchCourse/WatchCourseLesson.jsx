import { Rating } from '@mui/material';
import { Button, Flex, message, Rate } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import { Flex, Rate } from 'antd';
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

import ronald from './../../assets/images/ronald.png'
import axios from 'axios';
import { ShopContext } from '../../Context/ShopContext';
import LinearProgressWithLabel from '../LinearWithValueLabel';

const WatchCourseLesson = ({ course, activeLesson, setActiveLesson, user, fullComment, progress, setProgress }) => {



    const [value, setValue] = useState(fullComment?.rating);
    const [comment, setComment] = useState(fullComment?.comment);
    const [answers, setAnswers] = useState([]);
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
    const [disable, setDisable] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const fetchComment = () => {
            if (fullComment) {
                setComment(fullComment.comment);
                setValue(fullComment.rating);
            }
        }

        fetchComment();
    }, [fullComment])


    const submitComment = async () => {
        setDisable(true);
        const fullDataComment = {
            user: user._id,
            course: course._id,
            comment,
            rating: value
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/addComment`, fullDataComment);
            if (response.data.success)
                message.success('comment added successfully');
        } catch (err) {
            message.warning('Error wihle submitting comment');
            console.log(err);
        } finally {
            setDisable(false)
        }
    }


    const nextLesson = () => {
        if (activeLesson.lessonIndex === -1) {
            if (activeLesson.chapterIndex < course.chapters.length - 1) {
                setActiveLesson({ ...activeLesson, chapterIndex: activeLesson.chapterIndex + 1, lessonIndex: 0 })
            } else {
                setActiveLesson({ chapterIndex: -1, lessonIndex: -1 })
            }
        } else

            if (activeLesson.lessonIndex < course.chapters[activeLesson.chapterIndex].lessons.length - 1) {
                setActiveLesson({ ...activeLesson, lessonIndex: activeLesson.lessonIndex + 1 })
            } else {
                if (course.chapters[activeLesson.chapterIndex].quiz.questions.length > 0) {
                    setActiveLesson({ ...activeLesson, lessonIndex: -1 })
                } else {
                    if (activeLesson.chapterIndex < course.chapters.length - 1) {
                        setActiveLesson({ ...activeLesson, chapterIndex: activeLesson.chapterIndex + 1, lessonIndex: 0 })
                    } else {
                        setActiveLesson({ chapterIndex: -1, lessonIndex: -1 })
                        message.success('congratulations, you are completed all course chapters')
                    }
                }
            }
    }

    const handleCheckOptionChange = (e, questionIndex, optionIndex) => {
        const isChecked = e.target.checked;
        setAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            if (isChecked) {
                if (!newAnswers[questionIndex]) {
                    newAnswers[questionIndex] = [optionIndex];
                } else {
                    newAnswers[questionIndex] = [...newAnswers[questionIndex], optionIndex];
                }
            } else {
                if (newAnswers[questionIndex]) {
                    newAnswers[questionIndex] = newAnswers[questionIndex].filter(index => index !== optionIndex);
                    if (newAnswers[questionIndex].length === 0) {
                        newAnswers[questionIndex] = null;
                    }
                }
            }
            return newAnswers;
        });
    }
    const handleResetOption = () => {
        setShowCorrectAnswers(false);
        setAnswers([]);
    }

    const handleCheck = () => {
        if (!course.chapters[activeLesson?.chapterIndex] || !course.chapters[activeLesson?.chapterIndex].quiz) return;
        const totalQuestions = course.chapters[activeLesson?.chapterIndex].quiz.questions.length;
        let newScore = 0; // Calculate score locally
        for (let i = 0; i < totalQuestions; i++) {
            const selectedOptionIndexes = answers[i];
            if (selectedOptionIndexes && selectedOptionIndexes.length > 0) {
                const correctOptionIndexes = course.chapters[activeLesson?.chapterIndex].quiz.questions[i].options
                    .map((option, index) => option.isCorrect ? index : null)
                    .filter(index => index !== null);
                const isAllCorrect = selectedOptionIndexes.every(index => correctOptionIndexes.includes(index));
                if (isAllCorrect && selectedOptionIndexes.length === correctOptionIndexes.length) {
                    newScore++;
                }
            }
        }
        setScore(newScore); // Update score state
    }

    const handleShowAnswers = () => {
        setShowCorrectAnswers(true);
    }

    const endLessons = async (chapterId, lessonId) => {
        // console.log(chapterId, lessonId)
        try {
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/progress/user/${user._id}/course/${course._id}/chapters/${chapterId}/lessons/${lessonId}`);
            setProgress(response.data.progress)

        } catch (error) {
            console.error('Error updating progress:', error);
            return null;
        }
    };


    return (
        <div className='hoho'>
            <div className='watch-progress'>
                <LinearProgressWithLabel progress={progress?.progress ? progress?.progress : 0} />
            </div>
            {
                (activeLesson?.lessonIndex >= 0 && activeLesson?.chapterIndex >= 0) ? (
                    <div className='watch-lesson'>
                        <div className='watchCourse-info-btn'>
                            <div className='watchCourse-info'>
                                <p className='chapter-title'>{course.chapters[activeLesson?.chapterIndex].title} </p>
                                <p className='lesson-title'>{activeLesson?.lessonIndex} - {course.chapters[activeLesson?.chapterIndex].lessons[activeLesson?.lessonIndex].title}</p>
                            </div>
                            <div className="watch-btn">
                                <button className='quis-btn read-btn' onClick={() => endLessons(activeLesson?.chapterIndex, activeLesson?.lessonIndex)}>
                                    {
                                        progress?.chapterProgress?.map(chapter => {
                                            if (chapter.chapter === activeLesson?.chapterIndex) {
                                                return chapter.lessonProgress?.map(lesson => {
                                                    if (lesson.lesson === activeLesson?.lessonIndex && lesson.isCompleted) {

                                                        return (
                                                            <i key={lesson.lesson} className='bx bx-check-circle check-icon'></i>
                                                        )
                                                    }
                                                    return null;
                                                });
                                            }
                                            return null;
                                        })
                                    }
                                    Read
                                    {
                                        progress?.chapterProgress?.map(chapter => {
                                            if (chapter.chapter === activeLesson?.chapterIndex) {
                                                return chapter.lessonProgress?.map(lesson => {
                                                    if (lesson.lesson === activeLesson?.lessonIndex && lesson.isCompleted) {
                                                        return (
                                                            'ed'
                                                        )
                                                    }
                                                    return null;
                                                });
                                            }
                                            return null;
                                        })
                                    }
                                </button>
                                <button className='next-lesson-btn' onClick={nextLesson}>Next Lesson</button>
                            </div>

                        </div>
                        <video
                            className='lesson-video'
                            controls
                            controlsList="nodownload"
                            onEnded={() => endLessons(activeLesson?.chapterIndex, activeLesson?.lessonIndex)}
                            src={course.chapters[activeLesson?.chapterIndex].lessons[activeLesson?.lessonIndex].videoUrl}
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

                            <div className='comment-div'>
                                <div className='comment-Up'>
                                    <div className="userInfo">
                                        {/* <img src={course.user.avatar} alt='avatar' /> */}
                                        <img src={user.picture} alt="" className='comment-avatar' />
                                        <p>{user.username}</p>
                                    </div>
                                    <Rate tooltips={desc} onChange={setValue} value={value} />
                                </div>
                                <div>
                                    <textarea name='comment' placeholder='write here ...' className='commnet-input' onChange={(e) => setComment(e.target.value)} value={comment} />
                                </div>
                                <div className='button-div'>
                                    <div></div>
                                    {/* <button disabled={false} onClick={submitComment} className='send-comment'>Submit</button> */}
                                    <Button onClick={submitComment} type='primary' disabled={disable} >Submit</Button>
                                </div>
                            </div>

                        </div>
                    ) : (activeLesson?.lessonIndex === -1 && activeLesson?.chapterIndex >= 0) ? (

                        <div style={{ marginTop: '30px' }}>

                            <button className='next-lesson-btn quiz-next-btn' onClick={nextLesson}>Next Lesson</button>



                            {course.chapters[activeLesson?.chapterIndex]?.quiz?.questions?.length
                                ?
                                <div className="quiz-div">
                                    <div className="flex">
                                        <p >Answer the <span className='green' style={{ fontWeight: '600' }}>quiz questions</span> and get your <span style={{ color: 'blue', fontWeight: '600' }}>result</span></p>
                                        <p className={`${(score === (course.chapters[activeLesson?.chapterIndex]?.quiz?.questions.length)) ? 'quis-submit-btn' : (score < (course.chapters[activeLesson?.chapterIndex]?.quiz?.questions.length) / 2) ? 'quis-score-faild' : 'quis-btn'}`}>Score {score}</p>
                                    </div>
                                    {course.chapters[activeLesson?.chapterIndex]?.quiz?.questions.map((question, index) => (
                                        <div key={index} className='addQuis-questions mt'>
                                            <p>{index}</p>
                                            <div>
                                                <div className="addQuis-question">
                                                    <p>{question.question}</p>
                                                    <p>{question.hint}</p>
                                                </div>
                                                <div className='addQuis-options'>
                                                    {question.options?.map((option, optionIndex) => (
                                                        <div
                                                            key={optionIndex}
                                                            className={`addQuis-option ${showCorrectAnswers && option.isCorrect ? 'correct-answer' : ''}`}
                                                        >
                                                            <input
                                                                className='addQuis-option-checkbox'
                                                                name={`option_${index}_${optionIndex}`}
                                                                type="checkbox"
                                                                checked={answers[index] && answers[index].includes(optionIndex)}
                                                                onChange={(e) => handleCheckOptionChange(e, index, optionIndex)}
                                                                disabled={showCorrectAnswers}
                                                            />
                                                            <p>{option.option}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className='flex'>
                                        <button className='quis-submit-btn' onClick={handleCheck}>Submit</button>
                                        <div className="flex">
                                            <button className='quis-btn ' onClick={handleResetOption}>reset</button>
                                            <button className='quis-btn ml' onClick={handleShowAnswers}>Show Answers</button>
                                        </div>
                                    </div>
                                </div> :
                                <p>no quiz</p>
                            }

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

export default WatchCourseLesson;