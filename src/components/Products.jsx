import React, { useState, useEffect } from 'react';

// Mock data
const mockProducts = [
  { id: 1, name: 'Product A', price: 19.99 },
  { id: 2, name: 'Product B', price: 29.99 },
  { id: 3, name: 'Product C', price: 39.99 },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    // Simulate API call delay
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = () => {
    if (editingProduct) {
      // Simulate API call to update product
      const updatedProducts = products.map(product =>
        product.id === editingProduct.id ? editingProduct : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
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
      <h2 className="text-3xl font-bold mb-6 p-6 bg-indigo-100 text-indigo-800">Products</h2>
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
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  `$${product.price.toFixed(2)}`
                )}
              </td>
              <td className="py-4 px-6">
                {editingProduct?.id === product.id ? (
                  <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200">Save</button>
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