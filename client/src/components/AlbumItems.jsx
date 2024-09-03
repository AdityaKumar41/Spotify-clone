import React from 'react'

const AlbumItems = ({image,name,desc,id}) => {
  return (
    <div className='min-w-[180px] p-2 px-3 rounded cursor-pointer'>
        <img className='rounded' src={image} alt="" />
        <p className='font-bold mt-2 mb-1'>{name}</p>
        <p className='text-slate-200 test-sm'></p>
    </div>
  )
}

export default AlbumItems