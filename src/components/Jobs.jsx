import React, { useState, useEffect } from 'react';



const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({ name: '', price: 0 });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:81/api/jobs'); // Reemplaza con la URL de tu API
      if (!response.ok) {
        throw new Error('Error al recuperar los Trabajos');
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
  };

  const handleSave = async () => {
    if (editingJob) {
      const response = await fetch(`http://127.0.0.1:81/api/jobs/${editingJob.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingJob),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el trabajo');
      }
      const updatedJobs = jobs.map(job =>
        job.id === editingJob.id ? editingJob : job
      );
      setJobs(updatedJobs);
      setEditingJob(null);
    }
  };

  const handleAddJob = () => {
    setShowAddForm(true);
    setEditingJob({ name: '', price: 0 });
  };

  const handleAddTreatmentSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:81/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newJob),
    });
    if (!response.ok) {
      throw new Error('Error al agregar el tratamiento');
    }
    const addedTreatment = await response.json();
    setJobs([...jobs, addedJob]);
    setNewJob({ name: '', price: 0 });
    setShowAddForm(false);  
  };  
  const handleNewJobChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
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
      <button onClick={handleAddTreatment} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200">
          <span className="text-3xl">+</span> Tratamiento
        </button>
      {showAddForm && (
        <form onSubmit={handleAddTreatmentSubmit} className="mb-4 p-4 bg-gray-100 rounded">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={newJob.name}
              onChange={handleNewJobChange}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              name="price"
              value={newJob.price}
              onChange={handleNewJobChange}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200">Añadir Tratamiento</button>
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
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="py-4 px-6">
                {editingJob?.id === job.id ? (
                  <input
                    type="text"
                    value={editingJob.name}
                    onChange={(e) => setEditingJob({ ...editingJob, name: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  job.name
                )}
              </td>
              <td className="py-4 px-6">
                {editingJob?.id === job.id ? (
                  <input
                    type="number"
                    value={editingJob.price}
                    onChange={(e) => setEditingJob({ ...editingJob, price: parseFloat(e.target.value) })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  `${job.price.toFixed(2).replace('.', ',')}`
                )}
              </td>
              <td className="py-4 px-6">
                {editingJob?.id === job.id ? (
                  <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200">Save</button>
                ) : (
                  <button onClick={() => handleEdit(job)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200">Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Jobs;
