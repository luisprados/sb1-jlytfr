import React, { useState, useEffect } from 'react';



const Works = () => {
  const [works, setWorks] = useState([]);
  const [editingWork, setEditingWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = () => {
    // Simulate API call delay
    setTimeout(() => {
      setWorks(mockWorks);
      setLoading(false);
    }, 500);
  };

  const handleEdit = (work) => {
    setEditingWork(work);
  };

  const handleSave = () => {
    if (editingWork) {
      // Simulate API call to update work
      const updatedWorks = works.map(work =>
        work.id === editingWork.id ? editingWork : work
      );
      setWorks(updatedWorks);
      setEditingWork(null);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading works...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-3xl font-bold mb-6 p-6 bg-indigo-100 text-indigo-800">Sesiones</h2>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {works.map((work) => (
            <tr key={work.id}>
              <td className="py-4 px-6">
                {editingWork?.id === work.id ? (
                  <input
                    type="text"
                    value={editingWork.name}
                    onChange={(e) => setEditingWork({ ...editingWork, name: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  work.name
                )}
              </td>
              <td className="py-4 px-6">
                {editingWork?.id === work.id ? (
                  <input
                    type="number"
                    value={editingWork.price}
                    onChange={(e) => setEditingWork({ ...editingWork, price: parseFloat(e.target.value) })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  `$${work.price.toFixed(2)}`
                )}
              </td>
              <td className="py-4 px-6">
                {editingWork?.id === work.id ? (
                  <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200">Save</button>
                ) : (
                  <button onClick={() => handleEdit(work)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200">Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Works;