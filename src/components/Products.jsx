import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa Axios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';



const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // Nuevo estado
  const [newProduct, setNewProduct] = useState({ name: '', sale_price: 0 }); // Estado para el nuevo producto
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Nuevo estado para el modal de eliminación
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products'); // Usa axios.get
      setProducts(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = async () => { // Añadir 'async' aquí
    if (editingProduct) {
      // la url de la api es http://127.0.0.1:8000/api/products/id
      const response = await axios.put(`http://127.0.0.1:8000/api/products/${editingProduct.id}`, editingProduct);
      const updatedProducts = products.map(product =>
        product.id === editingProduct.id ? editingProduct : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
    }
  };

  const handleDelete = async () => { // Añadir 'async' aquí
    if (editingProduct) {
      const response = await axios.delete(`http://127.0.0.1:8000/api/products/${editingProduct.id}`);
      console.log(response);
      const updatedProducts = products.filter(product => product.id !== editingProduct.id);
      setProducts(updatedProducts);
      setEditingProduct(null);
    }
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  



  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
      withCredentials: true, // Para obtener el token CSRF y la cookie de sesión
    });
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/products', {
        name: newProduct.name,
        sale_price: newProduct.sale_price,
        cost_price: 60, // Asegúrate de usar los valores correctos
      }, {
        withCredentials: true,
      });
      setProducts([...products, response.data]);
    } catch (error) {
      console.error(error);
      setError('No se pudo agregar el producto');
    } finally {
      setNewProduct({ name: '', sale_price: 0 });
      setShowAddForm(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-6 p-6 bg-indigo-100 text-indigo-800">Productos</h2>
        <button onClick={handleAddProduct} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200">
          <FontAwesomeIcon icon={faPlus} /> Producto
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddProductSubmit} className="mb-4 p-4 bg-gray-100 rounded">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleNewProductChange}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              name="sale_price"
              value={newProduct.sale_price}
              onChange={handleNewProductChange}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200">Añadir Producto</button>
        </form>
      )}

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-4 px-6">
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  product.name
                )}
              </td>
              <td className="py-4 px-6">
                {editingProduct?.id === product.id ? (
                  <input
                    type="number"
                    value={editingProduct.sale_price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sale_price: parseFloat(e.target.value) })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  // el separador decimal es una coma
                  `${(parseFloat(product.sale_price) || 0).toFixed(2).replace('.', ',')}`
                )}
              </td>
              <td className="py-4 px-6">
                {editingProduct?.id === product.id ? (
                  <>
                  <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200">Guardar</button>
                  <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200">Eliminar</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(product)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200">Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
};

export default Products;
