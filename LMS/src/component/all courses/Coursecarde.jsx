import React from 'react'
import star from './../../assets/icons/star.svg'
import { Link } from 'react-router-dom'
import './coursecard.css'
const Coursecard = (props) => {
    return (
        
            <div className='coursecard' onClick={() => window.scrollTo(0, 0)}>
                <div>
                    <img className='courseimg' src={props.image} />
                </div>

                <div>
                    <h3 className='course-title'>{props.title}</h3>
                    <p className='course-description'>{props.littleDescription}</p>
                    <h4 className='course-creator'>{props.creator}</h4>
                    <div className="lien" />
                    <div className="informs">
                        <div className="prix">
                            <p className="n-price">{props.new_props} Da</p>
                            <p className="o-price">{props.old_props} Da</p>
                        </div>
                        <div className="rat">
                            <img src={star} /><p>{props.rating}</p>
                        </div>
                        
                    </div>
                </div>
            </div>
            
       
    )
}

export default Coursecard