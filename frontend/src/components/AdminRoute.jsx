import { Navigate } from 'react-router-dom';
import { getAdminToken } from '../auth.js';

// Wrap any admin page with this. No token -> redirect to the admin login.
export default function AdminRoute({ children }) {
  if (!getAdminToken()) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}
