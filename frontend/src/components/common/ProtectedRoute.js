import { Navigate, useLocation } from 'react-router-dom';

// Client guards improve UX and stop protected components from mounting before
// redirect. Authorization is still enforced by the API on every request.
export default function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  let user;

  try {
    user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('adminData') || 'null');
  } catch {
    user = null;
  }

  if (!user) {
    return <Navigate to="/loginform" replace state={{ from: location }} />;
  }
  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
