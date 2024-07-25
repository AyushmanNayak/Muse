import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button';
const Failure = () => {
  return (
    <div className='flex-col text-white text-4xl font-bold'>
    <p className='text-red-500 mt-20' >Your payment was unsuccessful.</p>
      <Button onClick={ () => {navigate('/')} }>
      Go back to home page

      </Button>

  </div>
  )
}

export default Failure
