import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TransportManagement from "./pages/TransportManagement";
import FleetManagement from "./pages/FleetManagement";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import CustomerPartnerPortal from "./pages/CustomerPartnerPortal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/customer-portal" element={<CustomerPartnerPortal />} />
      <Route path="/transport" element={<TransportManagement />} />
      <Route path="/flotte" element={<FleetManagement />} />
      <Route path="/inventar" element={<Inventory />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}

export default App;