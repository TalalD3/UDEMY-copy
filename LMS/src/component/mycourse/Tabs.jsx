import React from 'react';
import { Tabs } from 'antd';

import { PlusCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Item from '../item/Item';

import './tabs.css'

const MyTabs = ({ userData }) => {

    const onChange = (key) => {
        // console.log(key);
    };
    const items = [
        {
            key: '1',
            label: 'Enrolled Courses',
            children:
                <div className='tabs-container'>
                    {
                        userData.coursesEnrolled?.length ?
                            (
                                userData.coursesEnrolled?.map((course, index) => {
                                    return (
                                        <Item key={index} course={course} />
                                    )
                                })
                            ) : (
                                <div>
                                    You have not enrolled in any course.
                                </div>
                            )
                    }
                </div>,
            icon: <PlayCircleOutlined />,
        },
        {
            key: '2',
            label: 'Created Courses',
            disabled: userData.role === 'user',
            children:
                <div className='tabs-container'>
                    {
                        userData.coursesCreated?.length ?
                            (
                                userData.coursesCreated.map((course, index) => {
                                    return (
                                        <Item key={index} course={course} />
                                    )
                                })
                            ) : (
                                userData?.role === 'user' ?
                                    <div>
                                        you must be teacher to see this courses
                                    </div> :
                                    <div>
                                        You did not create any course.
                                    </div>
                            )
                    }
                </div>,
            icon: <PlusCircleOutlined />,
        },
    ];

    return (
        <Tabs defaultActiveKey="1" items={items} size={'large'} onChange={onChange} />
    );
};
export default MyTabs;