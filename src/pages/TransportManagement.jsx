import { useNavigate } from "react-router-dom";
export default function TransportManagement() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <h1 className="text-4xl">Transport Page</h1>
      <button onClick={() => navigate("/")} className="absolute top-6 left-6 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition">
        ← Dashboard
      </button>
    </div>
  );
}