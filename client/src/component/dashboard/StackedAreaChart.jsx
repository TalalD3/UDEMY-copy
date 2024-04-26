import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const montharray = [
    "Jan",
    "Fev",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
// const data = [
//   {
//     name: "Jan",
//     Orders: 4000,
//     users: 2400,
//     courses: 2400
//   },
//   {
//     name: "Fev",
//     Orders: 3000,
//     users: 1398,
//     courses: 2210
//   },
//   {
//     name: "Mar",
//     Orders: 2000,
//     users: 4800,
//     courses: 2290
//   },
//   {
//     name: "Apr",
//     Orders: 2780,
//     users: 3908,
//     courses: 2000
//   },
//   {
//     name: "May",
//     Orders: 1890,
//     users: 4800,
//     courses: 2181
//   },
//   {
//     name: "Jun",
//     Orders: 2390,
//     users: 3800,
//     courses: 2500
//   },
//   {
//     name: "Jul",
//     Orders: 3490,
//     users: 4300,
//     courses: 2100
//   },
//   {
//     name: "Aug",
//     Orders: 3490,
//     users: 4300,
//     courses: 2100
//   },
//   {
//     name: "Sep",
//     Orders: 3490,
//     users: 4300,
//     courses: 2100
//   },
//   {
//     name: "Oct",
//     Orders: 3490,
//     users: 4300,
//     courses: 2100
//   },
//   {
//     name: "Nov",
//     Orders: 3490,
//     users: 4300,
//     courses: 2100
//   },
//   {
//     name: "Dec",
//     Orders: 3490,
//     users: 4300,
//     courses: 2100
//   },
// ];

export default function StackedAreaChart({userData, orderData, courseData}) {
  // const [data, setData] = useState([])

  const transformData = (userData, orderData, courseData) => {
    const result = [];

    // Combine the data into a single array
    const combinedData = [...userData, ...orderData, ...courseData];

    // Group the combined data by month and year
    const groupedData = combinedData.reduce((acc, curr) => {
      const { month, year } = curr._id;
      const key = `${month}-${year}`;
      // const key = montharray[month];
      if (!acc[key]) {
        acc[key] = { month, year, totalUsers: 0, totalOrders: 0, totalCourses: 0 };
      }
      acc[key] = { ...acc[key], ...curr };
      return acc;
    }, {});

    // Convert the grouped data to the desired format
    for (let key in groupedData) {
      const { month, year, totalUsers, totalOrders, totalCourses } = groupedData[key];
      result.push({ name: montharray[month-1], Orders: totalOrders, users: totalUsers, courses: totalCourses });
    }

    return result;
  };

  const data = transformData(userData, orderData, courseData);

  // setData();


  return (
    <LineChart
      width={770}
      height={400}
      data={data}
      margin={{
        top: 20,
        right: 0,
        left: 0,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="Orders"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
      <Line type="monotone" dataKey="users" stroke="#82ca9d" />
      <Line type="monotone" dataKey="courses" stroke="#252525" />
    </LineChart>
  );
}
