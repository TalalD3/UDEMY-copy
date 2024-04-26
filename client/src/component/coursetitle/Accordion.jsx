import React, { useState } from 'react';
import './Accordion.css';
import arrow from '../../assets/icons/arrow.png'

const Accordion = ({ chapters, setPlayVideoUrl, showModal }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const WatchFreeChapters = (lesson, chapter) => {
        if (!chapter.isFree) {
            return;
        }
        // console.log(lesson);
        setPlayVideoUrl(lesson.videoUrl);
        showModal();
    }

    return (

        <div className="accordion">

            {chapters.map((chapter, index) => (
                <div className="panel" key={index}>
                    <div className="panel-heading" onClick={() => toggleAccordion(index)}>
                        <h4 className="panel-title">chapter {index + 1} : {chapter.title}</h4><div className='arrow'><img src={arrow} /></div>
                    </div>
                    {activeIndex === index && (
                        <div className="panel-content">
                            {chapter.lessons.map((lesson, lessonIndex) => (
                                <p onClick={() => WatchFreeChapters(lesson, chapter)} className={`${chapter.isFree && 'green cursor'}`} key={lessonIndex} >{lesson.title}</p>
                            ))}
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
};

export default Accordion;
