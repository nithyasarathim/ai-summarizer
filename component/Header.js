'use client'

import React from 'react'
import {useSession,signIn,signOut} from 'next-auth/react'

const Header=()=>{
  const {data:session}=useSession();

  return(
    <div className='w-full px-30 py-5 border-b border-white justify-between flex flex-row items-center'>
      <div className='flex gap-3'>
        <p className='text-white text-2xl font-bold flex items-center'>
          QuickRead
        </p>
      </div>

      {session?(
        <div className="flex items-center gap-4">
          <p className="text-white">{session.user.name}</p>
          <button
            onClick={()=>signOut()}
            className="bg-black border border-white text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      ):(
        <button
          onClick={()=>signIn()}
          className="bg-black border border-white text-white px-4 py-2 rounded"
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default Header;
