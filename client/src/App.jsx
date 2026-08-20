import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Offers from "./pages/Offers";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import TrackingLinks from "./pages/TrackingLinks";
import Conversions from "./pages/Conversions";
import Payouts from "./pages/Payouts";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import Affiliates from "./pages/Affiliates";
import RoleRoute from "./components/routes/RoleRoute";
import Clicks from "./pages/Clicks";
import Register from "./pages/Register";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>

        <Route element={<ProtectedRoute />}>
          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/create-affiliates" element={<Affiliates />} />
              <Route path="/tracking-links" element={<TrackingLinks />} />
              <Route path="/clicks" element={<Clicks />} />
              <Route path="/conversions" element={<Conversions />} />
              <Route path="/payouts" element={<Payouts />} />
            </Route>
          </Route>

          {/* Affiliate Routes */}
          <Route element={<RoleRoute allowedRoles={["affiliate"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/affiliate" element={<AffiliateDashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster richColors position="top-right" duration={2500} />
    </>
  );
};

export default App;
