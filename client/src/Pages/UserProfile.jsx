import React, { useEffect, useState } from 'react';
import "./css/profile.css";
// import dfi from "./../assets/images/profile-picture.webp"

import ImgCrop from 'antd-img-crop';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';


const UserProfile = ({userData}) => {
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [previousBio, setPreviousBio] = useState('');
    const [previouspic, setPreviousPic] = useState('');
    const [previousUsername, setPreviousUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('https://jalshobaki.com/img/default_profile_image.png');

    useEffect(()=>{
        const setUserData = () => {
            setUsername(userData.username);
            setBio(userData.bio);
            setProfilePicture(userData.picture);
        }
    
        setUserData();
    },[userData]) ;

    const handleEditProfile = () => {
        setEditing(true);
        setPreviousBio(bio);
        setPreviousPic(profilePicture);
        setPreviousUsername(username);
    };

    const handleSaveProfile = async() => {
        setEditing(false);
        try {
            const profile = {
                id:userData._id,
                username,
                bio,
                picture: profilePicture
            }
            const res = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/user/update`, profile);
            if (res.data.success) {
                message.success('profile updated successfully');
            }
            else {
                message.error('profile update failed');
            }
        } catch (error) {
            message.error('profile update failed');
        }
    };

    const handleCancelEdit = () => {
        setUsername(previousUsername);
        setProfilePicture(previouspic);
        setBio(previousBio);
        setEditing(false);
    };

    const MAX_BIO_LENGTH = 300;

    const handleBioChange = (e) => {
        const newBio = e.target.value;
        if (newBio.length <= MAX_BIO_LENGTH) {
            setBio(newBio);
        }
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            // Extract URL from the response and set it as the image URL
            const uploadedImageUrl = info.file.response.url; // Assuming the response contains the URL of the uploaded image
            setProfilePicture(uploadedImageUrl);
        }
    };

    return (
        <div className="user-profile">
            <div className="profile-picture">
                <img src={profilePicture} alt="Profile" />
            </div>

            <div className="profile-info">
                <h2>{username}</h2>
                {editing ? (
                    <div className='editing'>
                        <div className='UN'>
                            <p>Username </p>
                            <div className='un_input'>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                />
                            </div>
                        </div>

                        <div className='Bio'>
                            <p>Bio </p>
                            <div className='bio_text'>
                                <textarea
                                    value={bio}
                                    onChange={handleBioChange}
                                    placeholder="Bio"
                                />
                            </div>
                            {bio?.length === MAX_BIO_LENGTH && <p className="message">** Maximum number of characters reached</p>}
                        </div>

                        <div className='Ppic'>
                            <p>Profile picture </p>
                            <ImgCrop rotationSlider cropShape='round' >
                                <Upload
                                    name="logo"
                                    action="http://localhost:5000/upload/video"
                                    listType="text"
                                    maxCount={1}
                                    // onChange={(e) => setProfilePicture(URL.createObjectURL(e.target.files[0]))}
                                    onChange={handleChange} // Handle change event to get the uploaded image URL
                                >
                                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                                </Upload>
                            </ImgCrop>
                            {/* <input type="file" accept="image/*" onChange={(e) => setProfilePicture(URL.createObjectURL(e.target.files[0]))} /> */}
                        </div>
                        <div className='buttons'>
                            <button className='save' onClick={handleSaveProfile}>Save</button>
                            <button className='cancel' onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className='default_page'>
                        <div className='bio'><p>{bio}</p></div>
                        <div className='buttons2'>
                            <button className='edit' onClick={handleEditProfile}>Edit Profile</button>
                            <button className='logout' onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }} >Logout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
