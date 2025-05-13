import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import React from 'react'

const AppHeader = () => {
  return (
    <div className=' flex justify-between p-3 sm:p-4 shadow-sm items-center'>
        <Image src={'/logo.svg'} alt='logo' width={180} height={180}/>
        <UserButton/>
    </div>
  )
}

export default AppHeader