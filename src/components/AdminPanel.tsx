import React, { useState } from "react";
import type { Item } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AdminPanel = () => {
  const [curries, setCurries] = useState<Item[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchCurries = async () => {
    const res = await fetch(`${apiBaseUrl}/curries`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setCurries(data);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const res = await fetch(`${apiBaseUrl}/login`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (res.ok) {
      setIsLoggedIn(true);
      fetchCurries();
    } else {
      alert("Login failed");
    }
  };

  const handleSubmit = async () => {
    const res = await fetch(`${apiBaseUrl}/curries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(curries),
    });
    if (res.ok) {
      alert("Curries updated");
    } else {
      alert("Failed to update curries");
    }
  };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const newList = [...curries];
    newList[index] = { ...newList[index], [field]: value };
    setCurries(newList);
  };

  const addNewCurry = () => {
    setCurries([
      ...curries,
      { id: Date.now(), name: "", image: "", slot: "curry" },
    ]);
  };

  const handleLogout = async () => {
    await fetch(`${apiBaseUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-40 space-y-4 p-6 border rounded">
        <h2 className="text-xl font-semibold text-center">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Update Today's Curries</h2>
        <button onClick={handleLogout} className="text-red-600 font-semibold">
          Logout
        </button>
      </div>

      {curries.map((item, index) => (
        <div
          key={item.id}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
        >
          <input
            value={item.name}
            onChange={(e) => updateItem(index, "name", e.target.value)}
            className="border px-3 py-2 rounded"
            placeholder="Name"
          />
          <input
            value={item.image}
            onChange={(e) => updateItem(index, "image", e.target.value)}
            className="border px-3 py-2 rounded"
            placeholder="Image URL"
          />
          <input
            value={item.slot}
            disabled
            className="border px-3 py-2 rounded bg-gray-100"
          />
        </div>
      ))}

      <div className="flex justify-between">
        <button
          onClick={addNewCurry}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Curry
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
