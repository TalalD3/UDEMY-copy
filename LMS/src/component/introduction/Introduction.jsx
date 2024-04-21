import React from 'react'
import bander from '../../assets/images/bander.svg'
import mist from '../../assets/images/mistcircle.svg'
import door from '../../assets/images/door.svg'
import smallmist from '../../assets/images/Ellipse.svg'
import Text from "./Texte"
import "./home.css"


function Introduction() {
  return (
    <div className='Bigintro'>
      <div className='Intro'>
        <div className="container home-container">

          <div className='mistperson'>
            <div className='person-container mistcircle'>
              <img className='person' src={bander} />
              {/* <div className='mistcircle'></div> */}
              {/* <img className='mistcircle' src={mist} /> */}
            </div>
            <img className='mistcircle2' src={mist} />
            <img className='door' src={door} />
            <img className='door2' src={door} />
          </div>

          <div>
            <Text className='Text' />
          </div>

        </div>

      </div>
    </div>
  )
}

export default Introduction