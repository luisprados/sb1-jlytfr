import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

// Mock data
const mockProducts: Product[] = [
  { id: 1, name: 'Product A', price: 19.99 },
  { id: 2, name: 'Product B', price: 29.99 },
  { id: 3, name: 'Product C', price: 39.99 },
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleEdit = (product: Product) => {
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
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b">
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  product.name
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingProduct?.id === product.id ? (
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  `$${product.price.toFixed(2)}`
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingProduct?.id === product.id ? (
                  <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                ) : (
                  <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
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