import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Crops } from './pages/Crops';
import { PestDiagnosis } from './pages/PestDiagnosis';
import { Weather } from './pages/Weather';
import { Market } from './pages/Market';
import { Community } from './pages/Community';
import { Marketplace } from './pages/Marketplace';
import { Resources } from './pages/Resources';
import { LoanCalculator } from './pages/LoanCalculator';
import { IoTDashboard } from './pages/IoTDashboard';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Loader2 } from 'lucide-react';
import { DigitalPollenCursor } from './components/DigitalPollenCursor';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0] dark:bg-stone-900">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router basename="/agriconnect">
            <DigitalPollenCursor />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/crops" element={<Crops />} />
                        <Route path="/pest-diagnosis" element={<PestDiagnosis />} />
                        <Route path="/weather" element={<Weather />} />
                        <Route path="/market" element={<Market />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/loan-calculator" element={<LoanCalculator />} />
                        <Route path="/iot-dashboard" element={<IoTDashboard />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
