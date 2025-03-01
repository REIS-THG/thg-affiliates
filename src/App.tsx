
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import { ErrorProvider } from "./contexts/ErrorContext";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary";

function App() {
  return (
    <Router>
      <ErrorProvider>
        <GlobalErrorBoundary>
          <div className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:z-50 focus-visible:bg-white focus-visible:p-4 focus-visible:text-[#3B751E] focus-visible:border focus-visible:border-[#3B751E] focus-visible:rounded">
            <a href="#main-content">Skip to content</a>
          </div>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster 
            richColors 
            position="top-right" 
            closeButton
            toastOptions={{
              style: { 
                '--toast-text': 'var(--foreground)',
                '--toast-border': '1px solid var(--border)',
              }
            }}
          />
        </GlobalErrorBoundary>
      </ErrorProvider>
    </Router>
  );
}

export default App;
