import React from 'react'
import { Reorder } from "framer-motion";
import ChaptreFormDisplay from './ChaptreFormDisplay';

const ChaptresFormDisplay = ({ lessons, setLessons, deleteLesson }) => {

    return (
        <div className='dispaly-chaptres'>
            {lessons && (
                <Reorder.Group axis="y" values={lessons} onReorder={setLessons}>
                    {
                        lessons.map((lesson, index) => (
                            <ChaptreFormDisplay lesson={lesson} deleteLesson={deleteLesson} index={index} key={lesson.title} />
                        ))
                    }
                </Reorder.Group>
            )}
        </div>
    )
}

export default ChaptresFormDisplay