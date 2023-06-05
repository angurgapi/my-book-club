import React from 'react'
import Image from 'next/image'

 const Loader = () => {
    return (
        <div className='flex justify-center w-full py-10    '>
            <Image
                className="animate-spin"
                src="/books.svg"
                 alt="books"
                width={22}
                height={22}
          
            />			
        </div>
    )
}

export default Loader