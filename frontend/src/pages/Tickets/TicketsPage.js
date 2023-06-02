import React from 'react'
import Ticket from '../../components/myTickets/Ticket'
import './tickets.css'
import Navbar from '../../components/Navbar/Navbar'

function TicketsPage() {
  const list = [1,2,3,4]
  const amount = list.map(() => {
    return <Ticket />
  })
  return (
    <>
    <Navbar />
    
    <div className='tickets-flex'>
      <div className='tickets-title'>My Tickets</div>
      <div className='tickets-body'>

      {amount}

      </div>
    </div>
    </>
  )
}

export default TicketsPage