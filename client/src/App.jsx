import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import Calls from "./pages/admin/Calls";
import Login from "./pages/auth/Login";
import Reports from "./pages/admin/Reports";
import Scorecards from "./pages/admin/Scorecards";
import User from "./pages/admin/User";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<User />} />
        <Route path="scorecards" element={<Scorecards />} />
        <Route path="calls" element={<Calls />} />
        <Route path="reports" element={<Reports />} />

      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App