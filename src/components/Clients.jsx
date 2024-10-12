import React, { useState, useEffect } from 'react';

// Mock data
const mockClients = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
];

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    // Simulate API call delay
    setTimeout(() => {
      setClients(mockClients);
      setLoading(false);
    }, 500);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
  };

  const handleSave = () => {
    if (editingClient) {
      // Simulate API call to update client
      const updatedClients = clients.map(client =>
        client.id === editingClient.id ? editingClient : client
      );
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
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
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
                    type="email"
                    value={editingClient.email}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  client.email
                )}
              </td>
              <td className="py-4 px-6">
                {editingClient?.id === client.id ? (
                  <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200">Save</button>
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