import React, { useState, useEffect } from 'react'
import { Checkbox } from '@material-tailwind/react'


const fetchData = async () => {
  const result = await fetch('http://localhost:8000/api/sessions/quarter')
  const data = await result.json()
  console.log('datatrimestre',data)
  return data
}

export default function Component() {
  //mostrar los datos solo una vez cuando se monta el componente
  const [data, setData] = useState([])
  useEffect(() => {
    fetchData().then(setData)
  }, [])
  const [checkedItems, setCheckedItems] = useState({})
  const [total, setTotal] = useState(0)
  const [sessionsToAdd, setSessionsToAdd] = useState([])

  const handleCheckChange = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSessionClick = (item) => {
    console.log('sessionqqq', item)
    console.log('sessionsToAdd', sessionsToAdd)
    let id = item.id
    //si el item ya está en sessionsToAdd, lo eliminamos y los restamos del total, si no, lo añadimos y lo sumamos al total
    if (sessionsToAdd.includes(id)) {
      setSessionsToAdd(sessionsToAdd.filter(sessionId => sessionId !== id))
      setTotal(total - item.treatments.reduce((acc, treatment) => acc + treatment.price, 0) - item.products.reduce((acc, product) => acc + product.price, 0))
    } else {
      setSessionsToAdd([...sessionsToAdd, id])
      setTotal(total + item.treatments.reduce((acc, treatment) => acc + treatment.price, 0) + item.products.reduce((acc, product) => acc + product.price, 0))
    }
  }
  return (
    <div className="flex flex-col flex-wrap space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <div className="w-full flex justify-center">{/* este div toma todo el ancho */}
        <h1 className={`text-2xl font-bold ${total>0 ? 'opacity-100' : 'opacity-0'}`}>Total: {total}</h1>
      </div>
      {data.map((section) => (
        <div key={section.id} className="flex-1 rounded-lg border p-4 shadow-sm bg-white">
          <h2 className="text-lg font-semibold text-center">{section.month}</h2>
          {section.sessions.map((item, index) => (
            console.log(item),
              <div 
                key={item.id} 
                className={`mb-4 rounded-lg p-4 bg-[#f5f5fe] cursor-pointer border-2 ${sessionsToAdd.includes(item.id) ? ' border-green-600' : 'border-transparent'}`}
                onClick={() => handleSessionClick(item)}
              >
              <h3 className="mb-2 text-lg font-semibold">{item.customer.name}</h3>
                
               <ul className="space-y-2">
                {item.treatments.map((subItem) => (
                  <li key={subItem.id} className="flex items-center space-x-2">
                   <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {subItem.name}
                   </span>
                   <span className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {subItem.price.toLocaleString('es-ES')}€
                   </span>
                  </li>
                ))}
                {item.products.map((subItem) => (
                  <li key={subItem.id} className="flex items-center space-x-2">
                   <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {subItem.name}
                    </span>
                   <span className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {subItem.price.toLocaleString('es-ES')}€
                   </span>
                  </li>
                ))}
              </ul> 
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}