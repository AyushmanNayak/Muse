import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button';


const Success = () => {
    const navigate = useNavigate();

    useEffect (() => {
        setTimeout(() => {
    
            navigate('/');
        }, 3000 )
    }, [])

  return (
    <div className='flex-col text-white text-4xl font-bold justify-center align-middle'>
      <p className='text-white mt-20' >Your payment was successful.</p>
      <p className='text-white mt-20 text-sm' >Redirecting to home page ....</p>
    </div>
  )
}

export default Success
