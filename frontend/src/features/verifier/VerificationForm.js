import { useState } from "react";
import api from "../../api/api";

export default function VerificationForm({ onVerifySuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      if (!file) {
        setMessage("Please upload a file to verify.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/content/verify/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Verification complete!");
      onVerifySuccess(res.data);
    } catch {
      setMessage("Verification failed. Try again.");
    }
  };

  return (
    <div className="verify-form card animate-card">
      <h2>Verify File</h2>
      <form onSubmit={handleVerify}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />
        <button type="submit" className="btn-gradient">Verify</button>
      </form>
      <p className="message">{message}</p>
    </div>
  );
}