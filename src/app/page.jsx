'use client'
import VideoChat from '@/components/videochat/Videochat'
import Chat from '@/components/chat/Chat'
import Profile from '@/components/Profile/Profile'
import SearchBox from '@/components/SearchBox/SearchBox'
import { useEffect, useState } from 'react'
import userinfo, { login } from '@/store/userinfo/userinfo'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebaseConfig/firebaseConfig'

export default function Home() {

  // const [username,setUsername] = useState('')

  const userInfo = useSelector(state => state.userinfo);
  console.log('home',userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("hello")
    onAuthStateChanged(auth, (user) => {

      if (user) {
        console.log('okay',user)
        dispatch(login(user));
      }
    });

  },[userinfo])
  

  return (
    <>
      {
        
        userInfo && userInfo.username ? 
          <>
          <div className='flex relative  border border-green-400 flex-col p-2'>
        
        <div className='flex flex-wrap gap-5 relative justify-around  py-8 bg-red-300'>
        <SearchBox />
          <Profile/>
          
      </div>
        <div className='flex md:flex-col justify-center items-center mt-10 gap-5 '>
        <VideoChat/> 
        <Chat />
      </div>
      </div>
      {/* <button onClick={() => logout()}>Logout</button> */}
          </>
          : <button onClick={() => dispatch(login())}>Login</button>
      }
    
    </>
  )
}