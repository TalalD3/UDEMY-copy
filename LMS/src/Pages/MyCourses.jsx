import React, { useContext, useEffect, useState } from 'react'
import MyTabs from '../component/mycourse/Tabs'
import { ShopContext } from '../Context/ShopContext'

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
        <div className="container" style={{marginTop:"30px"}}>
            <MyTabs userData={userData} />
        </div>
    )
}

export default MyCourses