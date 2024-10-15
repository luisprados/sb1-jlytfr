import React, { useState, useEffect } from 'react';



const Treatments = () => {
  const [treatments, setTreatments] = useState([]);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/treatments'); // Reemplaza con la URL de tu API
      if (!response.ok) {
        throw new Error('Error al recuperar los Tratamientos');
      }
      const data = await response.json();
      setTreatments(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (treatment) => {
    setEditingTreatment(treatment);
  };

  const handleSave = () => {
    if (editingTreatment) {
      // Simulate API call to update treatment
      const updatedTreatments = treatments.map(treatment =>
        treatment.id === editingTreatment.id ? editingTreatment : treatment
      );
      setTreatments(updatedTreatments);
      setEditingTreatment(null);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading treatments...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-3xl font-bold mb-6 p-6 bg-indigo-100 text-indigo-800">Treatments</h2>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {treatments.map((treatment) => (
            <tr key={treatment.id}>
              <td className="py-4 px-6">
                {editingTreatment?.id === treatment.id ? (
                  <input
                    type="text"
                    value={editingTreatment.name}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, name: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  treatment.name
                )}
              </td>
              <td className="py-4 px-6">
                {editingTreatment?.id === treatment.id ? (
                  <input
                    type="number"
                    value={editingTreatment.price}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, price: parseFloat(e.target.value) })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  `${treatment.price.toFixed(2)}`
                )}
              </td>
              <td className="py-4 px-6">
                {editingTreatment?.id === treatment.id ? (
                  <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200">Save</button>
                ) : (
                  <button onClick={() => handleEdit(treatment)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200">Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Treatments;
