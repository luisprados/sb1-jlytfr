'use client'

import { useState, useCallback } from 'react'
import { debounce } from 'lodash'

// Simulated API calls - replace these with actual API calls to your backend
const searchDatabase = async (field, query) => {
  console.log(field, query)
  //consulta a la base de datos
  const response = await fetch(`http://localhost:8000/api/sessions/search/${query}`)
  const data = await response.json()
  const dataArray = data.map(item => item.name)
  console.log(dataArray)
  return dataArray
  
}

const saveToDatabase = async (data) => {
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Saved to database:', data)
  return { success: true }
}

export default function Component() {
  const [formData, setFormData] = useState({
    client: '',
    treatment: '',
    product: ''
  })
  const [suggestions, setSuggestions] = useState({
    client: [],
    treatment: [],
    product: []
  })
  const [showClientSessions, setShowClientSessions] = useState(false)

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
    if (formData.client) {
      setShowClientSessions(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.client) {
      alert('El campo cliente es obligatorio')
      return
    }
    const result = await saveToDatabase(formData)
    if (result.success) {
      alert('Registro guardado con éxito')
      setFormData({ client: '', treatment: '', product: '' })
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
              Ver sesiones del cliente {formData.client}
            </a>
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">
            Cliente *
          </label>
          <input
            id="client"
            name="client"
            value={formData.client}
            onChange={handleInputChange}
            onBlur={handleClientBlur}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {suggestions.client.length > 0 && (
            <ul className="mt-1 bg-white border border-gray-300 rounded-md shadow-sm">
              {suggestions.client.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, client: suggestion }))
                    setSuggestions(prev => ({ ...prev, client: [] })) // Cierra el desplegable
                  }}
                >
                  {suggestion}
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
          {suggestions.treatment.length > 0 && (
            <ul className="mt-1 bg-white border border-gray-300 rounded-md shadow-sm">
              {suggestions.treatment.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setFormData(prev => ({ ...prev, treatment: suggestion }))}
                >
                  {suggestion}
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
          {suggestions.product.length > 0 && (
            <ul className="mt-1 bg-white border border-gray-300 rounded-md shadow-sm">
              {suggestions.product.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setFormData(prev => ({ ...prev, product: suggestion }))}
                >
                  {suggestion}
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
