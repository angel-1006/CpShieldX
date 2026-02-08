export default function VerificationResult({ data }) {
  if (!data) return null;

  return (
    <div className="verify-result card animate-card">
      <h2>Verification Result</h2>

      <p><strong>Status:</strong> {data.status}</p>

      {/* Title */}
      {data.title && (
        <p><strong>File Title:</strong> {data.title}</p>
      )}

      {/* Owner */}
      {data.owner && (
        <p><strong>Owner:</strong> {data.owner}</p>
      )}

      {/* SHA-256 */}
      <p><strong>SHA-256:</strong> {data.sha256}</p>

      {/* Similarity Score */}
      {data.similarity_score !== undefined && (
        <p><strong>Similarity Score:</strong> {data.similarity_score}%</p>
      )}

      {/* Message */}
      {data.message && (
        <p><strong>Message:</strong> {data.message}</p>
      )}

      {/* Verified At */}
      {data.verified_at && (
        <p><strong>Verified At:</strong> {new Date(data.verified_at).toLocaleString()}</p>
      )}
    </div>
  );
}