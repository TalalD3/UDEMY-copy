import React from 'react';
import money from '../../assets/icons/moneys.svg';
import './card.css';

function Carte(props) {
  return (
    <div className='Card'>
      <div className="content">
        <div className='courseimage'> <img src={props.img} /></div>
        <div className='coursetitle'>
          <h3>{props.title}</h3>
        </div>
        <div className='price'>
          <img src={money} alt="Money Icon" />
          <h3>Price: {props.price} DA</h3>
        </div>
        <hr />
        <div className='buy'>
          <button>Enroll</button>
        </div>
      </div>
    </div>
  );
}

export default Carte;
