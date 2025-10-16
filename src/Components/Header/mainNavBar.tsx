'use client'
import React from 'react'
import SearchComponent from './searchComponent'
import { IoCartOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoPersonCircleSharp } from "react-icons/io5";

import NavLinks from '../Navigation/navLinks' // Import your navLinks component
import { PiPlug } from "react-icons/pi";
import SearchComponet from './searchComponent';

const mainNavBar = () => {
 return (
    <nav className="flex items-center justify-between px-10 py-4 shadow-sm bg-white border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center text-2xl font-bold text-gray-700">
  <span className='text-red-500'>my </span> Plug
  <PiPlug className="text-2xl text-gray-700 ml-2" />
</div>

      {/* Navigation Links */}
      <ul className="flex space-x-20 ">
        <SearchComponet />
      </ul>

      {/* Search and Icons */}
      <div className="flex items-center space-x-10 ">
       <a href=""              className="flex flex-col items-center text-gray-700 hover:text-red-500 transition-colors"
><IoCartOutline className="text-2xl mb-1" /> Cart</a> 
        <a href=""           className="flex flex-col items-center text-gray-700 hover:text-red-500 transition-colors"
> <IoMdHelpCircleOutline  className="text-2xl mb-1"/> Help</a>
         <a href="/accounts/addProducts"           className="flex flex-col items-center text-gray-700 hover:text-red-500 transition-colors"
>  <IoPersonCircleSharp  className="text-2xl mb-1"/> Account</a>
     
      </div>
    </nav>
  );
}

export default mainNavBar