import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import CallResults from "./pages/user/CallResults";
import Calls from "./pages/admin/Calls";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import MyCalls from "./pages/user/MyCalls";
import Reports from "./pages/admin/Reports";
import Scorecards from "./pages/admin/Scorecards";
import Settings from "./pages/admin/Settings";
import UploadCall from "./pages/user/UploadCall";
import User from "./pages/admin/User";
import UserDashboard from "./pages/user/UserDashboard";
import UserLayout from "./pages/user/UserLayout";
import UserSettings from "./pages/user/UserSettings";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="upload" element={<UploadCall />} />
        <Route path="calls" element={<MyCalls />} />
        <Route path="calls/:id" element={<CallResults />} />
        <Route path="settings" element={<UserSettings />} />
      </Route>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<User />} />
        <Route path="scorecards" element={<Scorecards />} />
        <Route path="calls" element={<Calls />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App