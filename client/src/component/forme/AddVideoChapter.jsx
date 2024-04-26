// import './App.css';
import { useEffect, useState } from "react";
import { storage } from './../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import ChaptresFormDisplay from "../chaptre-form-display/ChaptresFormDisplay";

function AddVideoChapter() {
    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);
    const [courseChaptres, setCourseChaptres] = useState([]);
    const [chaptreDetails, setChaptreDetails] = useState({
        title: '',
        videoUrl: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const file = e.target[0]?.files[0]
        if (!file) return;
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgUrl(downloadURL);
                    setChaptreDetails(prev => ({
                        title: prev.title,
                        videoUrl: downloadURL,
                    }))
                    setCourseChaptres(
                        [
                            ...courseChaptres,
                            chaptreDetails
                        ]
                    )
                    // console.log(imgUrl);
                });
            }
        );
    }

    useEffect(()=>{
        setChaptreDetails(prev => ({
            title: prev.title,
            videoUrl: imgUrl,
        }))
        setCourseChaptres(
            [
               ...courseChaptres,
                chaptreDetails
            ]
        )
        console.log(chaptreDetails);
        console.log(courseChaptres);
    },[imgUrl])

    return (
        <div className="App">
            <form onSubmit={handleSubmit} className='form'>
                <input type='file' />
                <button type='submit'>Upload</button>
            </form>


            {
                !imgUrl &&
                <div className='outerbar'>
                    <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
                </div>
            }
            {
                imgUrl &&
                // <img src={imgUrl} alt='uploaded file' height={200} />
                <video
                    className='videoChaptre'
                    controls
                    src={imgUrl}
                    width={'300px'}
                    height={'200px'}
                ></video>
            }

            <ChaptresFormDisplay courseChaptres={courseChaptres} setCourseChaptres={setCourseChaptres} />

        </div>
    );
}
export default AddVideoChapter;