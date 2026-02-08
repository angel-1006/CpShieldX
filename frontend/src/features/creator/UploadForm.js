import { useState } from "react";
import api from "../../api/api";
import "../../styles/UploadForm.css"; // new CSS file

export default function UploadForm({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("title", selectedFile.name);
    formData.append("file", selectedFile);

    try {
      const res = await api.post("/content/items/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
      setSelectedFile(null);
      onUploadSuccess(res.data); // notify parent dashboard
    } catch (err) {
      console.error("Upload failed", err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert("You must be logged in to upload files.");
      } else {
        alert("Error uploading file");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <h2>Upload New File</h2>
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="upload-input"
      />
      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}