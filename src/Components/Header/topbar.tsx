import React from 'react'

const Topbar = () => {
  return (
    <div className="bg-red-950 text-white">
      <div className="flex justify-center gap-x-4 text-xs sm:text-sm md:text-base text-center py-1 md:py-2">
        <p className="tracking-tight">Instant deliveries!</p>
        <p className="font-heading font-semibold text-sm sm:text-base md:text-lg">
          University of Ghana this is your plug
        </p>
      </div>
    </div>
  )
}

export default Topbar