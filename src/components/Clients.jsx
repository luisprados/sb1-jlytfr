import React, { useState, useEffect } from 'react';



const Clients = () => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', dni: '' });
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/customers'); // Reemplaza con la URL de tu API
      if (!response.ok) {
        throw new Error('Error al recuperar los clientes');
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = () => {
    setShowAddForm(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
  };

  const handleSave = async () => {
    if (editingClient) {
      // actualizar el cliente en la base de datos
      const response = await fetch(`http://127.0.0.1:8000/api/customers/${editingClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingClient),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el cliente');
      }
      const updatedClient = await response.json();
      const updatedClients = clients.map(client =>
        client.id === editingClient.id ? updatedClient : client
      );
      setClients(updatedClients);
      setEditingClient(null);
    }
  };

  const handleAddClientSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:8000/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newClient),
    });
    if (!response.ok) {
      throw new Error('Error al agregar el cliente');
    }
    const addedClient = await response.json();
    setClients([...clients, addedClient]);
    setNewClient({ name: '', phone: '', dni: '' });
    setShowAddForm(false);
  };

  const handleNewClientChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };  


  const handleDelete = async () => {
    if (editingClient) {
      // eliminar el cliente de la base de datos
      const response = await fetch(`http://127.0.0.1:8000/api/customers/${editingClient.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el cliente');
      }
      const updatedClients = clients.filter(client => client.id !== editingClient.id);
      setClients(updatedClients);
      setEditingClient(null);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading clients...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-3xl font-bold mb-6 p-6 bg-indigo-100 text-indigo-800">Clients</h2>
      <button onClick={handleAddClient} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200">+ Cliente</button>
      {showAddForm && (
        <form onSubmit={handleAddClientSubmit} className="mb-4 p-4 bg-gray-100 rounded">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={newClient.name}
              onChange={handleNewClientChange}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Telefono</label>
            <input
              type="number"
              name="phone"
              value={newClient.phone}
              onChange={handleNewClientChange}
              className="border rounded px-2 py-1 w-full"
              required
              min="100000000"
              max="999999999"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">DNI</label>
            <input
              type="text"
              name="dni"
              value={newClient.dni}
              onChange={handleNewClientChange}
              className="border rounded px-2 py-1 w-full"
              required
              minLength="9"
              maxLength="9"
            />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200">+Cliente</button>
        </form>
      )}
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="py-4 px-6">
                {editingClient?.id === client.id ? (
                  <input
                    type="text"
                    value={editingClient.name}
                    onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  client.name
                )}
              </td>
              <td className="py-4 px-6">
                {editingClient?.id === client.id ? (
                  <input
                    type="number"
                    value={editingClient.phone}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  `${client.phone}`
                )}
              </td>
              <td className="py-4 px-6">
                {editingClient?.id === client.id ? (
                  <input
                    type="text"
                    value={editingClient.dni}
                    onChange={(e) => setEditingClient({ ...editingClient, dni: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  `${client.dni}`
                )}
              </td>
              <td className="py-4 px-6">
                {editingClient?.id === client.id ? (
                  <>
                    <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200">Guardar</button>
                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200">Eliminar</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(client)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200">Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clients;
