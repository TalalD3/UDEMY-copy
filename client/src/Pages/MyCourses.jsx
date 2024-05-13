import React, { useContext, useEffect, useState } from 'react'
import MyTabs from '../component/mycourse/Tabs'
import { ShopContext } from '../Context/ShopContext'
import Profile from './UserProfile';
import './css/profile.css'

const MyCourses = () => {
    const { getUserData } = useContext(ShopContext);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getUserData();
                setUserData(user);
            } catch (error) {
                console.log('Failed to fetch user data', error);
            }
        }
        fetchUserData();
    }, [getUserData]);




    return (
        <section className="section1">
            <div className='container'>

                <Profile userData={userData} />

                <div style={{ marginTop: "30px" , marginBottom:"80px"}}>
                    <MyTabs userData={userData} />
                </div>

            </div>
        </section>
    )
}

export default MyCourses