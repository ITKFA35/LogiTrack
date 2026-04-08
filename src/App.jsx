import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TransportManagement from "./pages/TransportManagement";
import FleetManagement from "./pages/FleetManagement";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import CustomerPartnerPortal from "./pages/CustomerPartnerPortal";
import DashboardV2 from "./pages/DashboardV2";

import ApiTest from "./pages/ApiTest";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Customer-Portal" element={<CustomerPartnerPortal />} />
      <Route path="/reports/dashboard" element={<DashboardV2 />} />
      <Route path="/transport" element={<TransportManagement />} />
      <Route path="/flotte" element={<FleetManagement />} />
      <Route path="/inventar" element={<Inventory />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/api-test" element={<ApiTest />} />
    </Routes>
  );
}

export default App;