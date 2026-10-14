import React from 'react'
import './Breadcrums.css'
import arrow_icon from '../breadcrum_arrow.png'

const Breadcrums = (props) => {
  return (
    <div className='breadcrums'>
        HOME <img src={arrow_icon} alt=""/> SHOP <img src={arrow_icon} alt=""/>{props.product.category} <img src={arrow_icon} alt=""/>{props.product.name}

    </div>
  )
}
export default Breadcrums

