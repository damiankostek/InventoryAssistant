import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import WelcomePage from './pages/WelcomePage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import ScanPage from './pages/ScanPage';
import ProductPage from './pages/ProductPage';
import AdminPage from './pages/AdminPage';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<WelcomePage />} />
      <Route path="welcome" element={<WelcomePage/>} /> 
      <Route path="registration" element={<RegistrationPage/>} /> 
      <Route path="login" element={<LoginPage/>} /> 
      <Route path="scan" element={<ScanPage/>} /> 
      <Route path="product" element={<ProductPage/>} />
      <Route path="admin" element={<AdminPage/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App
