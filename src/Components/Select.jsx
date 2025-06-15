import React, { forwardRef , useId} from 'react'

const Select = ({
    label,
    className,
    option,
    ...props
}, ref) => {
    const id = useId()
  return (
    <div className='w-full'>
      {label && 
      <label htmlFor={id} className='' >{label}</label>}
      <select className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
      id={id}
      ref={ref}
      {...props}
      >
         {
            option?.map((option) => (
                <option value={option} key={option}>
                {option}
                </option>
            ))
         }
      </select>
    </div>
  )
}

export default forwardRef(Select) 
