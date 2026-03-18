import React from 'react'

const Loader = ({ data }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20">
      <div className="relative">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 animate-spin rounded-full border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-200"></div>
      </div>
      <p className="m-4 p-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium tracking-widest">
        {data ? data : "Loading..."}
      </p>
    </div>
  )
}

export default Loader