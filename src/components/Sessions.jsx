'use client'

import { useState, useCallback } from 'react'
import { debounce } from 'lodash'

// Simulated API calls - replace these with actual API calls to your backend
const searchDatabase = async (field, query) => {
  //consulta a la base de datos
  const response = await fetch(`http://localhost:8000/api/sessions/${field}/${query}`)
  const data = await response.json()
  const dataArray = data.map(item => ({ name: item.name, id: item.id }))
  return dataArray
  
}

const saveToDatabase = async (data) => {
  // Crear un nuevo objeto solo con los campos que se van a guardar
  const dataToSave = {
    customer_id: data.customer_id,
    treatment_id: data.treatment_id,
    product_id: data.product_id
  }
  console.log(dataToSave)
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

export default function Component() {
  const [formData, setFormData] = useState({
    customer: '',
    treatment: '',
    product: ''
  })
  const [suggestions, setSuggestions] = useState({
    customer: [],
    treatment: [],
    product: []
  })
  const [showClientSessions, setShowClientSessions] = useState(false)

  const debouncedSearch = useCallback(
    debounce(async (field, value) => {
      if (value.length > 2) {
        const results = await searchDatabase(field, value)
        console.log(results)
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
      setFormData({ customer: '', treatment: '', product: '' })
    } else {
      alert('Error al guardar el registro')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {showClientSessions && (
          <div className="mb-4">
            <a href="#" className="text-blue-600 hover:underline">
              Ver sesiones del cliente {formData.customer}
            </a>
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">
            Cliente *
          </label>
          <input
            id="client"
            name="customer"
            value={formData.customer}
            onChange={handleInputChange}
            onBlur={handleClientBlur}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input type="hidden" name="customer_id" value={formData.customer_id} />
          {suggestions.customer.length > 0 && (
            <ul className="mt-1 bg-white border border-gray-300 rounded-md shadow-sm">
              {suggestions.customer.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, customer: suggestion.name, customer_id: suggestion.id }))
                    setSuggestions(prev => ({ ...prev, customer: [] })) // Cierra el desplegable
                  }}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="treatment" className="block text-sm font-medium text-gray-700">
            Tratamiento
          </label>
          <input
            id="treatment"
            name="treatment"
            value={formData.treatment}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input type="hidden" name="treatment_id" value={formData.treatment_id} />
          {suggestions.treatment.length > 0 && (
            <ul className="mt-1 bg-white border border-gray-300 rounded-md shadow-sm">
              {suggestions.treatment.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, treatment: suggestion.name, treatment_id: suggestion.id }))
                    setSuggestions(prev => ({ ...prev, treatment: [] }))
                  }}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="product" className="block text-sm font-medium text-gray-700">
            Producto
          </label>
          <input
            id="product"
            name="product"
            value={formData.product}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input type="hidden" name="product_id" value={formData.product_id} />
          {suggestions.product.length > 0 && (
            <ul className="mt-1 bg-white border border-gray-300 rounded-md shadow-sm">
              {suggestions.product.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, product: suggestion.name, product_id: suggestion.id }))
                    setSuggestions(prev => ({ ...prev, product: [] }))
                  }}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

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
