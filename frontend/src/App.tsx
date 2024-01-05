import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import ScanTable from './pages/ScanTable';
import ScanPage from './pages/ScanPage';
import ProductPage from './pages/ProductPage';
import AdminPage from './pages/AdminPage';
import ProductsTablePage from './pages/ProductsTablePage';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<WelcomePage />} />
      <Route path="welcome" element={<WelcomePage/>} /> 
      <Route path="login" element={<LoginPage/>} /> 
      <Route path="scantable" element={<ScanTable/>} /> 
      <Route path="scan" element={<ScanPage/>} /> 
      <Route path="product" element={<ProductPage/>} />
      <Route path="productsTable" element={<ProductsTablePage/>} />
      <Route path="admin" element={<AdminPage/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App
