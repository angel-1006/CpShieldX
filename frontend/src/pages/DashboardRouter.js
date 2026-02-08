import CreatorDashboard from "./CreatorDashboard";
import VerifierDashboard from "./VerifierDashboard";
import AdminDashboard from "./AdminDashboard"; // create this if needed

export default function DashboardRouter() {
  const role = localStorage.getItem("userRole");

  if (role === "CREATOR") {
    return <CreatorDashboard />;
  } else if (role === "VERIFIER") {
    return <VerifierDashboard />;
  } else if (role === "ADMIN") {
    return <AdminDashboard />;
  } else {
    return <div>Unauthorized</div>;
  }
}