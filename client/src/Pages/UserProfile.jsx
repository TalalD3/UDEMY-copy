import React, { useState } from 'react';
import "./css/profile.css";
import dfi from "./../assets/images/profile-picture.webp"

const UserProfile = () => {
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState('BACKend Username');
    const [bio, setBio] = useState('');
    const [previousBio, setPreviousBio] = useState(''); 
    const [previouspic, setPreviousPic] = useState('');
    const [previousUsername, setPreviousUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(dfi);

    const handleEditProfile = () => {
        setEditing(true);
        setPreviousBio(bio);
        setPreviousPic(profilePicture);
        setPreviousUsername(username);
    };

    const handleSaveProfile = () => {
        setEditing(false);
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
                        {bio.length === MAX_BIO_LENGTH && <p className="message">** Maximum number of characters reached</p>}
                        </div>
                        
                        <div className='Ppic'>
                        <p>Profile picture </p>
                        <input type="file" accept="image/*" onChange={(e) => setProfilePicture(URL.createObjectURL(e.target.files[0]))} />
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
                        <button className='logout' >Logout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
