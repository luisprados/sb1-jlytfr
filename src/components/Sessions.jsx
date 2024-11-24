'use client'

import { useState, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'
import { Card, Typography } from "@material-tailwind/react"

// Simulated API calls - replace these with actual API calls to your backend
const searchDatabase = async (field, query) => {
  //consulta a la base de datos
  const response = await fetch(`http://localhost:8000/api/sessions/${field}/${query}`)
  const data = await response.json()
  console.log('data',data)
  const dataArray = data.map(item => ({ name: item.name, id: item.id ,price: item.price}))
  return dataArray
  
}

const saveToDatabase = async (data) => {
  console.log('dataaaaaaaaaaaa',data)
 
  const response = await fetch('http://localhost:8000/api/sessions/store', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
  
}

const queryCustomerSessions = async (customer_id) => {
  console.log('customer_id',customer_id)
  const response = await fetch(`http://localhost:8000/api/sessions/sessions_customer/${customer_id}`)
  const data = await response.json()
  console.log('datacustomersessions',data)
  return data
}

export default function Component() {
  
  const [treatments, setTreatments] = useState([{ name: '', id: '' ,price: ''}])
  const [products, setProducts] = useState([{ name: '', id: '' ,price: '', cantidad: '1' }])
  const [customer, setCustomer] = useState({ name: '', id: '' })
  const [showAddButton, setShowAddButton] = useState({ treatment: false, product: false })
  const [suggestions, setSuggestions] = useState({customer: [], treatment: [], product: []})
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState({
    customer: -1,
    treatment: -1,
    product: -1
  })
  const [showClientSessions, setShowClientSessions] = useState(false)
  const [showClientSessionsTable, setShowClientSessionsTable] = useState(false)

  const debouncedSearch = useCallback(
    debounce(async (field, value) => {
      if (value.length > 2) {
        const results = await searchDatabase(field, value)
        setSuggestions(prev => ({ ...prev, [field]: results }))
      } else {
        setSuggestions(prev => ({ ...prev, [field]: [] }))
      }
    }, 300),
    []
  )

  useEffect(() => {
    if(customer.id !== ''){
      setShowClientSessions(true)
    }
  },[customer])

  const addField = (type) => {
    if (type === 'treatment') {
      setTreatments([...treatments, { name: '', id: '' ,price: ''}])
    } else {
      setProducts([...products, { name: '', id: '' ,price: '', cantidad: '1' }])
    }
    setShowAddButton((prev) => ({ ...prev, [type]: false }))
  }  

  const handleTreatmentChange = (index, e) => {
    const { value } = e.target
    const newTreatments = [...formData.treatments]
    newTreatments[index].name = value
    setFormData((prev) => ({ ...prev, treatments: newTreatments }))
    debouncedSearch('treatment', value)
  }

   /* useEffect(() => {
    // Reset selected suggestion index when suggestions change
    setSelectedSuggestionIndex({
      customer: -1,
      treatment: -1,
      product: -1
    })
  }, [suggestions])  */

  const addTreatmentField = () => {
    setFormData((prev) => ({
      ...prev,
      treatments: [...prev.treatments, { name: '', id: '' }]
    }))
  }

  const addProductField = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { name: '', id: '' }]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      customer: customer,
      treatments: treatments,
      products: products
    }
    saveToDatabase(data)
  }

  const checkIfObjectIsEmpty = (obj, index) => {
    const newTreatments = obj === 'treatments' ? [...treatments] : [...products]
    if(newTreatments[index].name === ''){
      newTreatments.splice(index, 1)
      obj === 'treatments' ? setTreatments(newTreatments) : setProducts(newTreatments)
    }
  }

 const handleChange = (type, index, e) => {
  const { value } = e.target
  console.log('valueeeeeeeeeee',e)
  const newItems = type === 'treatment' ? [...treatments] : [...products]
  const propertyToUpdate = e.target.dirName === 'price' ? 'price' : 'name'
  newItems[index][propertyToUpdate] = value
  type === 'treatment' ? setTreatments(newItems) : setProducts(newItems)
  type === 'treatment' && value.length > 4 && setShowAddButton({treatment: true})
  debouncedSearch(type, value)
 }

 const handleSelect = (type, index, suggestion) => {
   if(type =='customer'){
     //   setFormData((prev) => ({ ...prev, customer: suggestion.name, customer_id: suggestion.id }))
      const newCustomer = {
      name: suggestion.name,
      id: suggestion.id,
      } 
     console.log('suggestion',suggestion.name)
     setCustomer(newCustomer)
     console.log('custo',customer)
  }else{
  const newItems = type === 'treatment' ? [...treatments] : [...products]
  newItems[index] = { 
    name: suggestion.name,
    id: suggestion.id,
    price: parseFloat(suggestion.price) || 0,
    }
    if(type === 'product'){
      newItems[index].cantidad = 1
      newItems[index].price_no_change = parseFloat(suggestion.price) || 0
    }
  type === 'treatment' ? setTreatments(newItems) : setProducts(newItems)
  type === 'treatment' && setShowAddButton({treatment: true})
  }
    setSuggestions((prev) => ({ ...prev, [type]: [] }))
}

const handleChangeCantidad = (index, e) => {
  const { value } = e.target
  const newItems = [...products]
  newItems[index].cantidad = value
  newItems[index].price = newItems[index].price_no_change * value
  setProducts(newItems)
}

const handleInputChange = (e) => {
  const value = e.target.value
  //setFormData(prev => ({ ...prev, [name]: value }))
  setCustomer({name: value})
  console.log('customer2222',customer)
  debouncedSearch('customer', value)
}

const handleKeyDown = (e, field, index, suggestion) => {
  if (suggestions[field].length > 0) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex((prevIndex) => ({
        ...prevIndex,
        [field]: prevIndex[field] < suggestions[field].length - 1 ? prevIndex[field] + 1 : 0
      }))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex((prevIndex) => ({
        ...prevIndex,
        [field]: prevIndex[field] > 0 ? prevIndex[field] - 1 : suggestions[field].length - 1
      }))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedSuggestionIndex[field] >= 0) {
         const selectedSuggestion = suggestions[field][selectedSuggestionIndex[field]]
       
        handleSelect(field, index, selectedSuggestion)
      }
    } else if (e.key === 'Escape') {
      setSuggestions((prev) => ({ ...prev, [field]: [] }))
      setSelectedSuggestionIndex((prevIndex) => ({ ...prevIndex, [field]: -1 }))
    }
  }
}

const handleShowClientSessions = async () => {
  if(showClientSessions && showClientSessionsTable){
   // setShowClientSessions(false)
    setShowClientSessionsTable(false)
  }else{
    const result = await queryCustomerSessions(customer.id)
    setShowClientSessionsTable(result)
    setShowClientSessions(true)
  }
}

return (
  <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
       {showClientSessions && (
          <div className="mb-4">
            {/* <a href={`/sessions/${formData.customer_id}`} className="text-blue-600 hover:underline">
              Ver sesiones del cliente {formData.customer}
              </a> */}
            <button 
              onClick={() => handleShowClientSessions()} 
              className="text-blue-600 hover:underline"
            >
              Sesiones de {customer.name}
            </button>
          </div>
        )}
        {/* modal con tabla de sesiones para el cliente   */}
        {showClientSessionsTable && (
          <div
              className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md bg-clip-border rounded-xl">
        <Card className="h-full w-full">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="bg-indigo-600 text-white opacity-100 rounded-t-xl">
              <tr className="rounded-t-xl">
                  <th  className="border-b border-blue-gray-100 p-4 rounded-tl-xl">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none"
                    >
                      Tratamientos
                    </Typography>
                  </th>
                  <th  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none"
                    >
                      Productos
                    </Typography>
                  </th>
                  <th  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 rounded-tr-xl">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none"
                    >
                      Fecha
                    </Typography>
                  </th>
              </tr>
            </thead>
            <tbody>
              {showClientSessionsTable.sessions.map((treatment, index) => (
                <tr key={index} className="even:bg-gray-300/50">
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {treatment.treatments.map((treat, i) => (
                        <p key={i}>{treat.name} - {treat.price}€</p>
                      ))}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {treatment.products.map((product, i) => (
                        <p key={i}>{product.name} - {product.price}€</p>
                      ))}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {new Date(treatment.created_at).toLocaleDateString()}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        </div>
  )}
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 relative">
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">
            Cliente *
          </label>
          <input
            id="client"
            name="customer"
            value={customer.name}
            onChange={(e) => handleInputChange(e)}
            onKeyDown={(e) => handleKeyDown(e, 'customer')}
           // onBlur={handleClientBlur}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {console.log('customer3333',customer)}
          <input id="customer_id" type="hidden" name="customer_id" value={customer.id} />
          {suggestions.customer.length > 0 && (
            <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-sm w-full">
              {suggestions.customer.map((suggestion, index) => (
                <li
                  key={index}
                  className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedSuggestionIndex.customer === index ? 'bg-gray-100' : ''}`}
                  onClick={() => {
                  /*   setCustomer({name: suggestion.name, id: suggestion.id}) */
                    handleSelect('customer', index,suggestion )
                    setSuggestions((prev) => ({ ...prev, customer: [] }))
                    }
                  }
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>
          {console.log('trata',treatments)}
      {console.log('suggestions',suggestions)}
        {/* Campos de Tratamiento */}
        {treatments.map((treatment, index) => (
          <div key={index} className="relative flex justify-between">
            <div className='flex flex-col pr-2   w-5/6'>{/*ocupa el espacio que queda libre*/}
              <label htmlFor={`treatments[${index}][name]`} className="block text-sm font-medium text-gray-700">
                Tratamiento {index + 1}
              </label>
              <input
                id={`treatments[${index}][id]`}
                name={`treatments[${index}][name]`}
                value={treatment.name}
                dirname='name'
                onChange={(e) => handleChange('treatment', index, e)}
                onKeyDown={(e) => handleKeyDown(e, 'treatment', index)}
                onBlur={() => checkIfObjectIsEmpty('treatments', index)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className='flex flex-col w-1/6'>
              <label htmlFor={`treatments[${index}][price]`} className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type='number'
              id={`treatments[${index}][price]`}
              name={`treatments[${index}][price]`}
              value={treatment.price}
              dirname='price'
              onChange={(e) => handleChange('treatment', index, e)}
              onBlur={() => setShowAddButton({treatment: true})}
              className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              </div>
            <input type="hidden" id={`treatment_id-${index}`} name={`treatment_id-${index}`} value={treatment.id} />
            {(suggestions.treatment.length > 0 && index == treatments.length - 1)&& (
              <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-sm w-full">
                {suggestions.treatment.map((suggestion, suggestionIndex) => (
                  <li
                    key={suggestionIndex}
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedSuggestionIndex.treatment === suggestionIndex ? 'bg-gray-100' : ''}`}
                    onClick={() => handleSelect('treatment', index, suggestion)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Botón para añadir otro tratamiento */}
        
          <button
            type="button"
            onClick={() => addField('treatment')}
            className="mt-2 text-blue-600 hover:underline"
          >
            + Tto.
          </button>
        
          {console.log('products',products)}
        {/* Campos de Producto */}
        {products.map((product, index) => (
          <div key={index} className="relative flex justify-between">
            <div className='flex flex-col w-9/12 pr-2'>
            <label htmlFor={`product-${index}`} className="block text-sm font-medium text-gray-700">
              Producto {index + 1}
            </label>
            <input
              id={`products[${index}][id]`}
              name={`products[${index}][name]`}
              value={product.name}
              onChange={(e) =>  handleChange('product', index, e)}
              onBlur={() => setShowAddButton({product: true})}
              onKeyDown={(e) => handleKeyDown(e, 'product', index)}
              className="mt-1 block w-full px-3 py-2 
              bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            </div>
            <div className='flex flex-col w-1/12 pr-2'>
              <label htmlFor={`product_quantity-${index}`} className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input type='number' id={`product_quantity-${index}`} name={`products[${index}][cantidad]`} value={product.cantidad} onChange={(e) => handleChangeCantidad(index, e)} className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className='flex flex-col w-2/12'>
              <label htmlFor={`product_price-${index}`} className="block text-sm font-medium text-gray-700">Precio</label>
              <input type='number' 
              id={`product_price-${index}`} 
              name={`products[${index}][price]`} 
              dirname='price'
              value={product.price} 
              onChange={(e) => handleChange('product', index, e)}
              className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <input type="hidden" id={`product_id-${index}`} name={`product_id-${index}`} value={product.id} />
            {(suggestions.product.length > 0 && index == products.length - 1)&& (
              <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-sm w-full">
                {suggestions.product.map((suggestion, suggestionIndex) => (
                  <li
                    key={suggestionIndex}
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedSuggestionIndex.product === suggestionIndex ? 'bg-gray-100' : ''}`}
                    onClick={() => handleSelect('product', index, suggestion)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Botón para añadir otro producto */}
          <button
            type="button"
            onClick={() => addField('product')}
            className="mt-2 text-blue-600 hover:underline"
          >
            + Producto
          </button>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar Registro
        </button>
      </form>
    </div>
  )
}
