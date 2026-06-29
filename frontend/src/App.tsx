import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import AddInvestmentPage from './pages/AddInvestment';
import EditInvestmentPage from './pages/EditInvestment';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          className: '',
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
            borderRadius: '0px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-accent)',
              secondary: 'var(--color-background)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'var(--color-background)',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/investments/add" element={<AddInvestmentPage />} />
        <Route path="/investments/edit/:id" element={<EditInvestmentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
