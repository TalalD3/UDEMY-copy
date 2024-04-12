import React from 'react'
import { Reorder } from "framer-motion";
import ChaptreFormDisplay from './ChaptreFormDisplay';

const ChaptresFormDisplay = ({ courseChaptres, setCourseChaptres, deleteChapter }) => {

    return (
        <div className='dispaly-chaptres'>
            <Reorder.Group axis="y" values={courseChaptres} onReorder={setCourseChaptres}>
                {
                    courseChaptres.map((courseChaptre, index) => (
                        <ChaptreFormDisplay courseChaptre={courseChaptre} deleteChapter={deleteChapter} index={index} key={courseChaptre.title} />
                    )) 
                }
            </Reorder.Group>
        </div>
    )
}

export default ChaptresFormDisplay