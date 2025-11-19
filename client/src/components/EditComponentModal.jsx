import { useState } from "react";

export default function EditComponentModal({ data, onClose, refresh }) {
  const [form, setForm] = useState({
    name: data.name,
    category: data.category,
    totalQuantity: data.totalQuantity,
    description: data.description,
    location: data.location,
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:5000/api/components/${data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        totalQuantity: Number(form.totalQuantity),
      }),
    });

    if (res.ok) {
      refresh();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Edit Component</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        />

        <input
          name="totalQuantity"
          type="number"
          value={form.totalQuantity}
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded mt-3"
        >
          Update
        </button>

        <button
          onClick={onClose}
          className="w-full text-gray-600 mt-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
