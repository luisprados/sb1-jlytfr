import React, { useState, useEffect } from 'react';

interface Client {
  id: number;
  name: string;
  email: string;
}

// Mock data
const mockClients: Client[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
];

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleEdit = (client: Client) => {
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
    return <div>Loading clients...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Clients</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="py-2 px-4 border-b">
                {editingClient?.id === client.id ? (
                  <input
                    type="text"
                    value={editingClient.name}
                    onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  client.name
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingClient?.id === client.id ? (
                  <input
                    type="email"
                    value={editingClient.email}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  client.email
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingClient?.id === client.id ? (
                  <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                ) : (
                  <button onClick={() => handleEdit(client)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
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