"use client"
import { FileClock, Home, Settings, WalletCards } from 'lucide-react'
import Link from 'next/link';
import React, { useEffect } from "react";
import { usePathname } from 'next/navigation'
function SideNav() {
    const MenuList=[
        {
            name:'Home',
            icon:Home,
            path:'/dashboard'
        },
        {
            name:'History',
            icon:FileClock,
            path:'/dashboard/history'
        },
        {
            name:'Billing',
            icon:WalletCards,
            path:'/dashboard/billing'
        },
        {
            name:'Setting',
            icon:Settings,
            path:'/dashboard/settings'
        },

    ]

    const path = usePathname();
    useEffect(()=>{
      console.log(path)
    },[])
  return (
    <div className="h-screen p-5 shadow-sm border">
      <div className="flex justify-center">
        <h2 className="font-bold text-3xl font-serif text-primary">
          Hyper Serve
        </h2>
      </div>
      <hr className='my-6 border'/>
      <div className="mt-3">
      {
        MenuList.map((menu, index)=>(
            <div className={`flex gap-2 mb-2 p-3 hover:bg-primary hover:text-white rounded-lg transition-all cursor-pointer items-center ${path == menu.path&&'bg-primary text-white'}`} key={index}>
                <menu.icon className=" h-6 w-6"/>
                <h2 className='text-lg'>{menu.name}</h2>
            </div>
        ))
      }
      </div>
    </div>
  );
}

export default SideNav;
