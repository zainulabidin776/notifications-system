import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CreateNotificationPage } from './pages/notifications/CreateNotificationPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { EditNotificationPage } from './pages/notifications/EditNotificationPage';
import { SettingsPage } from './pages/settings/SettingsPage';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
  path="/notifications/new"
  element={
    <ProtectedRoute>
      <CreateNotificationPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/notifications/:id/edit"
  element={
    <ProtectedRoute>
      <EditNotificationPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;