import React, { useState } from "react";
import axios from "axios";

const EditForm = ({ item, fields, onSave, onCancel, apiEndpoint }) => {
  const [formData, setFormData] = useState(item);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${apiEndpoint}/${item.id || item.matricule || item.email}`,
        formData
      );
      onSave();
    } catch (error) {
      console.error("Error updating:", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md modal-box">
        <h3 className="text-xl font-bold text-1e3a8a mb-4 modal-title">
          Edit {item.name || item.email}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="form-group">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 input-field"
              />
            </div>
          ))}
          <div className="form-actions flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onCancel} className="btn btn-gray">
              Cancel
            </button>
            <button type="submit" className="btn btn-blue">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
