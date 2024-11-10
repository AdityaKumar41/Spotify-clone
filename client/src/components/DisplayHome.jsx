import React from 'react'
import Navbar from './Navbar'
import { albumsData } from '../assets/assets'
import AlbumItems from './AlbumItems'
import { songsData } from '../assets/assets'
import Songitem from './Songitem'
import { useGetSongs } from '../hooks/useSong'
import { useGetArtists } from '../hooks/useArtist'
const DisplayHome = () => {
  const { data: songs } = useGetSongs();
  const { data: artists } = useGetArtists();

  // Filter artists who have songs
  const artistsWithSongs = artists?.filter(artist => {
    // Check if this artist has any songs in the songs array
    return songs?.some(song => song.artist.id === artist.id);
  });

  console.log(artistsWithSongs)
  return (
    <div className='p-4 md:p-0'>
    <Navbar />
    <div className='mb-4'>
      <h1 className='my-5 font-bold text-2xl cursor-pointer'>Featured Charts </h1>
      <div className='flex overflow-auto'>
      {artistsWithSongs?.map((item,index)=>(<AlbumItems key={item.id} name={item.name} desc={item.bio} id={item.id} image={item.image}/>))}
      </div>
    </div>
    <div className='mb-4'>
      <h1 className='my-5 font-bold text-2xl cursor-pointer'>Today's biggest hits</h1>
      <div className='flex overflow-auto'>
        {songs?.map((item,index)=>(<Songitem key={index} name={item.title} author={item.artist.name} id={item.id} image={item.coverImage}/>))}
      </div>
    </div>
    </div>
  )
}
export default DisplayHome