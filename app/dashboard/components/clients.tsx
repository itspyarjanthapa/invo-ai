"use client";

import { EditIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type ClientTypes = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
};

const ClientsForm = () => {
  const [clientToDelete, setClientToDelete] = useState<ClientTypes | null>(
    null,
  );

  const [clients, setClients] = useState<ClientTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setformData] = useState({
    name: "",
    email: "",
    address: "",
    company: "",
    phone: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create client");
      }

      const newClient = await res.json();

      setClients([newClient, ...clients]);

      alert("Client Created Successfully..");
      setLoading(false);
      setformData({
        name: "",
        email: "",
        address: "",
        company: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error: ", error);
      alert("Failed to create client");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function clientsData() {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
      console.log("clients: ", data);
    } catch (error) {
      alert("Failed to fetch the client data..");
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    clientsData();
  }, []);

  async function handleClientDelete() {
    if (!clientToDelete) return;

    try {
      const res = await fetch(`/api/clients/${clientToDelete?.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed!");
      }

      setClients(clients.filter((c) => c.id !== clientToDelete.id));

      setClientToDelete(null);

      alert(`${clientToDelete.name} deleted successfully!`);
    } catch (error) {
      alert(`unable to delete ${clientToDelete?.name}`);
      console.error("Delete error:", error);
    }
  }

  if (loading) return <div>Loading....</div>;

  return (
    <div className="space-y-5">
      <div className="bg-white shadow p-5 rounded-2xl mt-5">
        <h1 className="font-bold text-2xl mb-5">Add Clients:</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-3">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded-lg"
              type="text"
              placeholder="e.g: Jhon Eden *"
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded-lg"
              type="email"
              placeholder="e.g: jhon@example.com *"
            />

            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-lg"
              type="text"
              placeholder="e.g: XYZ Tech.Co"
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-lg"
              type="text"
              placeholder="e.g: +977 9863432112"
            />

            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-lg"
              type="text"
              placeholder="e.g: Butwal, Nepal"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Client"}
            </button>
          </div>
        </form>
      </div>

      {/* // Show Clients */}
      <div className="bg-white shadow p-5 rounded-2xl mt-5">
        <h1 className="font-bold text-2xl mb-5">Client List:</h1>

        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4">Recent Clients</h3>
          {clients.length === 0 ? (
            <p className="text-gray-500">
              No clients yet. Add your first client!
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {clients.map((client: any) => (
                <div
                  key={client.id}
                  className="bg-gray-100 p-3 flex items-baseline justify-between rounded-xl "
                >
                  <div>
                    <p className="font-semibold">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    <p>{client.phone}</p>
                    <p>{client.company}</p>
                    <p>{client.address}</p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setClientToDelete(client)}>
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                    <button>
                      <EditIcon size={18} />
                    </button>
                  </div>

                  {clientToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">
                          Delete Client
                        </h2>
                        <p className="mb-6">
                          Are you sure you want to delete{" "}
                          <strong>{clientToDelete.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setClientToDelete(null)}
                            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleClientDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsForm;
