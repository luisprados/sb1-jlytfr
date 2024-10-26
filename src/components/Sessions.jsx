'use client'

import { useState, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'

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
  // Crear un nuevo objeto solo con los campos que se van a guardar
  const dataToSave = {
    customer_id: data.customer_id,
    //convertir el array de objetos a un array de ids
    treatment_id: data.treatment.map(item => item.id, item => item.price),
    product_id: data.product.map(item => item.id, item => item.cantidad)
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
  const response = await fetch(`http://localhost:8000/api/sessions/sessions_customer/${customer_id}`)
  const data = await response.json()
  console.log('datacustomersessions',data)
  return data
}

export default function Component() {
  const [formData, setFormData] = useState({
    customer: '',
    treatment: [{ name: '', id: '', price: '' }], // Cambia a un array de objetos
    product: [{ name: '', id: '', price: '', cantidad: '1' }]    // Cambia a un array de objetos
  })
  const [suggestions, setSuggestions] = useState({
    customer: [],
    treatment: [],
    product: []
  })
  const [showClientSessions, setShowClientSessions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState({
    customer: -1,
    treatment: -1,
    product: -1
  })
  const [treatments, setTreatments] = useState([{ name: '', id: '' ,price: ''}])
  const [products, setProducts] = useState([{ name: '', id: '' ,price: '', cantidad: '1' }])
  const [showAddButton, setShowAddButton] = useState({ treatment: false, product: false })

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    debouncedSearch(name, value)
  }

  const handleClientBlur = () => {
    if (formData.customer) {
      setShowClientSessions(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.customer) {
      alert('El campo cliente es obligatorio')
      return
    }
    const result = await saveToDatabase(formData)
    if (result.success) {
      alert('Registro guardado con éxito')
      setFormData({ customer: '', treatments: [{ name: '', id: '' ,price: ''}], products: [{ name: '', id: '' ,cantidad: '' }] })
    } else {
      alert('Error al guardar el registro')
    }
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

  const handleChange = (type, index, e) => {
    const { value } = e.target
    const newItems = type === 'treatment' ? [...treatments] : [...products]
    newItems[index].name = value
    if(type === 'product'){
      newItems[index].price = 88
    }
    type === 'treatment' ? setTreatments(newItems) : setProducts(newItems)
    console.log('newItems11',products)
    debouncedSearch(type, value)
  }
  const handleChangeProduct = (index, e) => {
    const { value } = e.target
    const newItems = [...products]
    console.log('prodgggggggggggggucts',newItems)
    console.log('valor',newItems[index][e.target.name])
    //cambiar dinamicamente el nombre del campo
    newItems[index][e.target.name] = e.target.value
    if(e.target.name === 'product_quantity-'+index){
      newItems[index].price = newItems[index].price * newItems[index].price_no_change * value
    }
    console.log('newItems',newItems)
    setProducts(newItems)
    debouncedSearch('product', value)
  }

  const handleChangeCantidad = (index, e) => {
    const { value } = e.target
    const newItems = [...products]
    newItems[index].cantidad = value
    newItems[index].price = newItems[index].price_no_change * value
    setProducts(newItems)
  }

  const handleBlur = (type, index) => {
    const items = type === 'treatment' ? treatments : products
    if (items[index].name.trim() !== '') {
      setShowAddButton((prev) => ({ ...prev, [type]: true }))
    } else {
      setShowAddButton((prev) => ({ ...prev, [type]: false }))
    }
  }

  const addField = (type) => {
    if (type === 'treatment') {
      setTreatments([...treatments, { name: '', id: '' }])
    } else {
      setProducts([...products, { name: '', id: '' }])
    }
    setShowAddButton((prev) => ({ ...prev, [type]: false }))
  }

  const handleSelect = (type, index, suggestion) => {
    if(type =='customer'){
      setFormData((prev) => ({ ...prev, customer: suggestion.name, customer_id: suggestion.id }))
    }else{
      console.log('products1',products)
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
    console.log('products2',products)
    type === 'treatment' ? setTreatments(newItems) : setProducts(newItems)
    console.log('products3',products)
    //refrescar setFormData con los nuevos valores
      setFormData((prev) => ({ ...prev, [type]: newItems }))
      console.log('products4',products)
    }
      setSuggestions((prev) => ({ ...prev, [type]: [] }))
  }

  const handleTreatmentChange = (index, e) => {
    const { value } = e.target
    const newTreatments = [...formData.treatments]
    newTreatments[index].name = value
    setFormData((prev) => ({ ...prev, treatments: newTreatments }))
    debouncedSearch('treatment', value)
  }

  const handleProductChange = (index, e) => {
    const { value } = e.target
    const newProducts = [...formData.products]
    newProducts[index].name = value
    setFormData((prev) => ({ ...prev, products: newProducts }))
    debouncedSearch('product', value)
  }

  useEffect(() => {
    // Reset selected suggestion index when suggestions change
    setSelectedSuggestionIndex({
      customer: -1,
      treatment: -1,
      product: -1
    })
  }, [suggestions])

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

  const calculatePriceProduct = (index) => {
    const product = formData.product[index]
    product.price = parseFloat(product.price)
    console.log('product.price',product.price)
    product.price = product.price * parseFloat(product.cantidad)
    console.log('product',product)
    console.log('cantidad',product.cantidad)
    setFormData((prev) => ({ ...prev, product: product }))
  }

  const handlePriceTotal = (e, index) => {
    const { value } = e.target
    const newPriceTotal = [...products]
    newPriceTotal[index].price = value
    setProducts(newPriceTotal)
    console.log('products desde handlePriceTotal',products)
  }

  const handleShowClientSessions = async () => {
    const result = await queryCustomerSessions(formData.customer_id)
    setShowClientSessions(true)
  }
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        {showClientSessions && (
          <div className="mb-4">
            {/* <a href={`/sessions/${formData.customer_id}`} className="text-blue-600 hover:underline">
              Ver sesiones del cliente {formData.customer}
              </a> */}
            <button onClick={handleShowClientSessions} className="text-blue-600 hover:underline">Sesiones de {formData.customer}</button>
          </div>
        )}
        {/* modal de sesiones para el cliente   */}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 relative">
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">
            Cliente *
          </label>
          <input
            id="client"
            name="customer"
            value={formData.customer}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e, 'customer')}
            onBlur={handleClientBlur}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input type="hidden" name="customer_id" value={formData.customer_id} />
          {suggestions.customer.length > 0 && (
            <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-sm w-full">
              {suggestions.customer.map((suggestion, index) => (
                <li
                  key={index}
                  className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                    index === selectedSuggestionIndex.customer ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      customer: suggestion.name,
                      customer_id: suggestion.id,
                    }))
                    setSuggestions((prev) => ({ ...prev, customer: [] }))
                  }}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Campos de Tratamiento */}
        {console.log('treatments',treatments)}
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
                onBlur={() => handleBlur('treatment', index)}
                onKeyDown={(e) => handleKeyDown(e, 'treatment', index)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className='flex flex-col w-1/6'>
              <label htmlFor={`treatment_price-${index}`} className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type='number'
              name={`treatment_price-${index}`}
           
              className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              </div>
            <input type="hidden" name={`treatment_id-${index}`} value={treatment.id} />
            {(suggestions.treatment.length > 0 && treatment.id.length == '')&& (
              <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-sm w-full">
                {suggestions.treatment.map((suggestion, suggestionIndex) => (
                  <li
                    key={suggestionIndex}
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                      suggestionIndex === selectedSuggestionIndex.treatment ? 'bg-gray-200' : ''
                    }`}
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

        {/* Campos de Producto */}
        {console.log('products forumulario',products)}
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
              onBlur={() => handleBlur('product', index)}
              onKeyDown={(e) => handleKeyDown(e, 'product', index)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            </div>
            <div className='flex flex-col w-1/12 pr-2'>
              <label htmlFor={`product_quantity-${index}`} className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input type='number' name={`product_quantity-${index}`} value={product.cantidad} onChange={(e) => handleChangeCantidad(index, e)} className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className='flex flex-col w-2/12'>
              <label htmlFor={`product_price-${index}`} className="block text-sm font-medium text-gray-700">Precio</label>
              <input type='number' name={`product_price-${index}`}  value={product.price} onChange={(e) => handleChangeProduct(index, e)} className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <input type="hidden" name={`product_id-${index}`} value={product.id} />
            {(suggestions.product.length > 0 && product.id.length == '')&& (
              <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-sm w-full">
                {suggestions.product.map((suggestion, suggestionIndex) => (
                  <li
                    key={suggestionIndex}
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                      suggestionIndex === selectedSuggestionIndex.product ? 'bg-gray-200' : ''
                    }`}
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
