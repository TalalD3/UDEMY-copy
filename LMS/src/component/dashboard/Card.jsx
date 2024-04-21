import React from "react"

const Card = ({extra, number, total}) => {
  return (
    <div className="dashboard-card">
        <p className="total-card">Total {total}</p>
        <p className="number-card">{number}</p>
        <p className="extra-card">You made an extra <span>{extra}</span> this year</p>
    </div>
  )
}

export default Card