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
  // Crear un nuevo objeto solo con los campos que se van a guardar
  const dataToSave = {
    customer_id: data.customer_id,
    treatments: data.treatment,
    products: data.product
  }
  const response = await fetch('http://localhost:8000/api/sessions/store', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSave)
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
  const [suggestions, setSuggestions] = useState({
    customer: [],
    treatment: [],
    product: []
  })
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
  const addField = (type) => {
    if (type === 'treatment') {
      setTreatments([...treatments, { name: '', id: '' }])
    } else {
      setProducts([...products, { name: '', id: '' }])
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
    saveToDatabase(formData)
  }
 const handleChange = (type, index, e) => {
  const { value } = e.target
  console.log('value',e)
  const newItems = type === 'treatment' ? [...treatments] : [...products]
  const propertyToUpdate = e.target.id === 'price' ? 'price' : 'name'
  newItems[index][propertyToUpdate] = value
  type === 'treatment' ? setTreatments(newItems) : setProducts(newItems)
  debouncedSearch(type, value)
 }
 const handleSelect = (type, index, suggestion) => {
  console.log('tipo',type)
  if(type =='customer'){
 //   setFormData((prev) => ({ ...prev, customer: suggestion.name, customer_id: suggestion.id }))
    /* const newCustomer = {
      customer: suggestion.name,
      customer_id: suggestion.id,
    } */
    setCustomer({name: suggestion.name, id: suggestion.id})
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
return (
  <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      
       
        
       
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {console.log('trata',treatments)}
      {console.log('suggestions',suggestions)}
        {/* Campos de Tratamiento */}
        {treatments.map((treatment, index) => (
          <div key={index} className="relative flex justify-between">
            <div className='flex flex-col pr-2   w-5/6'>{/*ocupa el espacio que queda libre*/}
              <label htmlFor={`treatment-${index}`} className="block text-sm font-medium text-gray-700">
                Tratamiento {index + 1}
              </label>
              <input
                id={`treatment-${index}`}
                name={`treatment-${index}`}
                value={treatment.name}
                onChange={(e) => handleChange('treatment', index, e)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className='flex flex-col w-1/6'>
              <label htmlFor={`treatment_price-${index}`} className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type='number'
              id={'price'}
              name={'price'}
              value={treatment.price}
              onChange={(e) => handleChange('treatment', index, e)}
              onBlur={() => setShowAddButton({treatment: true})}
              className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              </div>
            <input type="hidden" id={`treatment_id-${index}`} name={`treatment_id-${index}`} value={treatment.id} />
            {(suggestions.treatment.length > 0 )&& (
              <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-sm w-full">
                {suggestions.treatment.map((suggestion, suggestionIndex) => (
                  <li
                    key={suggestionIndex}
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer `}
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
        {showAddButton.treatment && (
          <button
            type="button"
            onClick={() => addField('treatment')}
            className="mt-2 text-blue-600 hover:underline"
          >
            + Tto.
          </button>
        )}
          {console.log('products',products)}
        {/* Campos de Producto */}
        {products.map((product, index) => (
          <div key={index} className="relative flex justify-between">
            <div className='flex flex-col w-9/12 pr-2'>
            <label htmlFor={`product-${index}`} className="block text-sm font-medium text-gray-700">
              Producto {index + 1}
            </label>
            <input
              id={`product-${index}`}
              name={`product-${index}`}
              value={product.name}
              onChange={(e) =>  handleChange('product', index, e)}
              onBlur={() => setShowAddButton({product: true})}
              onKeyDown={(e) => handleKeyDown(e, 'product', index)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            </div>
            <div className='flex flex-col w-1/12 pr-2'>
              <label htmlFor={`product_quantity-${index}`} className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input type='number' id={`product_quantity-${index}`} name={`product_quantity-${index}`} value={product.cantidad} onChange={(e) => handleChangeCantidad(index, e)} className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className='flex flex-col w-2/12'>
              <label htmlFor={`product_price-${index}`} className="block text-sm font-medium text-gray-700">Precio</label>
              <input type='number' id={`product_price-${index}`} name={`product_price-${index}`}  value={product.price} onChange={(e) => handleChangeProduct(index, e)} className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <input type="hidden" id={`product_id-${index}`} name={`product_id-${index}`} value={product.id} />
            {(suggestions.product.length > 0 && product.id.length == '')&& (
              <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-sm w-full">
                {suggestions.product.map((suggestion, suggestionIndex) => (
                  <li
                    key={suggestionIndex}
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer `}
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
        {showAddButton.product && (
          <button
            type="button"
            onClick={() => addField('product')}
            className="mt-2 text-blue-600 hover:underline"
          >
            + Producto
          </button>
        )}

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
