import React from 'react'
import { Search } from 'lucide-react'
import { MdNavigateNext } from "react-icons/md";

const searchComponent = () => {
  return (
    <>
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-5 py-3 bg-gray-100  rounded-sm">
            <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm w-90"
            />
             <Search className="w-4 h-4 text-gray-500" />
        </div>
    </>
  )
}

export default searchComponent