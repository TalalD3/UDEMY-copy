import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ThreeDots } from 'react-loader-spinner'
import ChaptresFormDisplay from '../chaptre-form-display/ChaptresFormDisplay';
import LinearWithValueLabel from '../LinearWithValueLabel';

const AddChapter = ({ courseChaptres, setCourseChaptres }) => {

    const [img, setImg] = useState(null);
    const [progress, setProgress] = useState(0);
    const [video, setVideo] = useState(null);
    // const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [canAded, setCanAded] = useState(false);
    const [chaptreDetails, setChaptreDetails] = useState({
        title: '',
        videoUrl: '',
    })
    const [videoSrc, setVideoSrc] = useState(null)
    const videoRef = useRef(null)

    const navigate = useNavigate();

    const changeChapterHandler = (e) => {
        setChaptreDetails({
            ...chaptreDetails,
            [e.target.name]: e.target.value
        })
    }

    const uploadFile = async (type) => {
        const data = new FormData();
        data.append("file", type === 'image' ? img : video);
        data.append("upload_preset", type === 'image' ? 'images_preset' : 'videos_preset');

        try {
            let cloudName = import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME;
            let resourceType = type === 'image' ? 'image' : 'video';
            let config = {
                onUploadProgress: (e) => {
                    const { loaded, total } = e
                    setProgress(Math.round((loaded / total) * 100))
                }
            }
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(api, data, config);
            const { secure_url } = res.data;
            console.log(secure_url);
            return secure_url;
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Upload video file
            const videoUrl = await uploadFile('video');
            // setVideoUrl(videoUrl);

            setChaptreDetails(prev => ({
                title: prev.title,
                videoUrl: videoUrl,
            }))


            // Send backend api request
            // await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/videos`, { imgUrl, videoUrl });

            // Reset states 
            // setVideo(null);

            console.log("File upload success!");
            setLoading(false);
            setCanAded(true);
            // navigate("/")
        } catch (error) {
            console.error(error);
        }
    }

    const addChapter = () => {
        setCourseChaptres(
            [
                ...courseChaptres,
                chaptreDetails
            ]
        )
    }

    const deleteChapter = (index) => {
        if (index > -1) {
            setCourseChaptres((prevChapter) =>
                prevChapter.filter((_, i) => i !== index)
            );
        }
    }



    useEffect(() => {
        const src = URL.createObjectURL(new Blob([video], { type: 'video/mp4' }))
        setVideoSrc(src)
    }, [video])

    return (
        <div>

            <div className="add-chapitre">
                <div className='flex'>
                    <p className='filed-title'>Chapitre title and video</p>
                    <div className='flex'>
                        <div className='btn-disable-div'>
                            {(loading || !!!video || !!!chaptreDetails.title) &&
                                <div className='btn-disable' />
                            }
                            <button className='add-chapitre-btn' type='button' onClick={handleSubmit}>Add</button>
                        </div>
                        <div className='ml btn-disable-div'>
                            {(!canAded || loading || !!!video) &&
                                <div className='btn-disable' />
                            }
                            <button className='add-chapitre-btn' type='button' onClick={addChapter}>Save</button>
                        </div>

                    </div>
                </div>
                <div className="addCourse-itemfield">
                    <LinearWithValueLabel progress={progress} />
                    <input value={chaptreDetails.title} onChange={changeChapterHandler} type="text" name='title' placeholder="e.g 'The Complete 2024 Web Development Bootcamp'" />
                    {/* {error.title && <p className='filed-error'>title is missing</p>} */}
                </div>

                <div className="image-input">
                    <input onChange={(e) => setVideo((prev) => e.target.files[0])} type="file" accept='video/*' name="video" id="video" />
                    <video
                        className='videoChaptre'
                        controls
                        ref={videoRef}
                        src={videoSrc}
                        width={'100%'}
                    ></video>
                </div>
            </div>

            <div className="line" />

            <p className='filed-title'>Uploaded Chapitres</p>

            <ChaptresFormDisplay courseChaptres={courseChaptres} setCourseChaptres={setCourseChaptres} deleteChapter={deleteChapter} />

        </div>


    )
}

export default AddChapter