import React from 'react'
import '../../styles.css'
import './account.css'
import Navbar from '../../components/Navbar/Navbar'
import ComplexGradientAnimation from '../../components/Canvas'

function Account() {

  const Tickets = () => {
      return(
      <div className='ticket center'>
      <div>Location 1 &#8594; Location 2</div>
      <div>Price : 20 EGP</div>
      <div>Date: 10/05/2023</div>
      </div>
    )
  }

  return (
    <div className='account-background'>
        <Navbar />
        <div><ComplexGradientAnimation/></div>
        <div className='account-body'>
          <div className='account-details'>
            <div className='detail'>Name: Raffy Mekhtik</div>
            <div className='detail'>Email: raffynorair@gmail.com</div>
            <div className='detail'>Password: ***********</div>
            <div className='detail center'>Change Account Details</div>
            <div className='detail center'>Apply For a Senior Membership</div>
          </div>

          <div className='account-tickets'>
            <div className='bold center'>Tickets</div>

              <Tickets/>

          </div>

        </div>
    </div>
  )
}

export default Account