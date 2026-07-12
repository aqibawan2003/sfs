import React from 'react'
import KitchenOwnerNavbar from './KitchenOwnerNavbar'
import OrderChart from './OrderChart'

const KitchenOwnerDashboard = () => {
  return (
    <div className='flex'>
    <KitchenOwnerNavbar/>
    <div className='mt-4 flex-1'>
      <p className='mb-4 text-4xl ml-4 font-bold'>Ordering chart</p>
      <div className='h-[400px]'>
        <OrderChart />
      </div>
    </div>
    </div>
  )
}

export default KitchenOwnerDashboard
