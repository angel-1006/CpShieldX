import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/uploadHistory.css"; // new CSS file

export default function UploadHistory({ newUpload }) {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await api.get("/content/items/");
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [newUpload]); // refresh when a new upload succeeds

  return (
    <div className="upload-history">
      <h2>My Uploads</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>File</th>
            <th>Status</th>
            <th>Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {files.length > 0 ? (
            files.map((file) => (
              <tr key={file.id}>
                <td>{file.title}</td>
                <td className={`status ${file.status?.toLowerCase()}`}>
                  {file.status}
                </td>
                <td>{new Date(file.created_at).toLocaleString()}</td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No files uploaded yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}