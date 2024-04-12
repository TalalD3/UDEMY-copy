import React from 'react'
import { useMotionValue, Reorder } from "framer-motion";
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// import { useRaisedShadow } from "./use-raised-shadow";

const ChaptreFormDisplay = ({ courseChaptre, index, deleteChapter }) => {
    const y = useMotionValue(0);
    // const boxShadow = useRaisedShadow(y);

    return (
        <Reorder.Item value={courseChaptre} style={{ y }}>
            <div className='dispaly-chaptre'>
                <div className='flex'>
                    <p className='chaptre-title'> {index + 1} -  {courseChaptre.title}</p>
                    {/* <DeleteOutlineIcon /> */}
                    <div className="delet-chapter" onClick={()=>deleteChapter(index)}>
                        <IconButton aria-label="delete" size="medium" color='inherit'>
                            <DeleteIcon fontSize="inherit"  />
                        </IconButton>
                    </div>
                </div>
                <video
                    className='videoChaptre'
                    controls
                    src={courseChaptre.videoUrl}
                    height={'275px'}
                    width={'100%'}
                ></video>
            </div>
        </Reorder.Item>
    )
}

export default ChaptreFormDisplay