import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// const data = [
//   {
//     'category': "Progm",
//     'totalOrders': 50
//   },
//   {
//     'category': "Data ",
//     'totalOrders': 30
//   },
//   {
//     'category': "Web d",
//     'totalOrders': 25
//   },
//   {
//     'category': "Desig",
//     'totalOrders': 20
//   },
//   {
//     'category': "Busin",
//     'totalOrders': 15
//   }
// ];
// const data = [
//   {
//     name: "fadsf",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210
//   },
//   {
//     name: "Page C",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000
//   },
//   {
//     name: "Page E",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100
//   }
// ];

export default function SimpleBarChart({ordersPerCategory}) {
  const truncateCategoryNames = (data, maxLength) => {
    return data.map(item => ({
      category: item.category.length > maxLength ? item.category.substring(0, maxLength) + ' ' : item.category,
      totalOrders: item.totalOrders
    }));
  };
  
  // Usage example:
  const data = truncateCategoryNames(ordersPerCategory, 5);

  return (
    <BarChart
      width={350}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5
      }}
    >
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <XAxis dataKey="category" />
      {/* <YAxis />  */}
      <Tooltip />
      {/* <Legend /> */}
      <Bar dataKey="totalOrders" barSize={30} fill="#8884d8" />
      {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
    </BarChart>
  );
}
