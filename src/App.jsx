// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons'; // <--- IMPORTAR LA VISTA QUE CREAREMOS AHORA

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Cargando...</div>;
    return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} /> 
                
                {/* Ruta Dashboard */}
                <Route 
                    path="/courses" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />

                {/* NUEVA RUTA: Gestión de Lecciones */}
                {/* :courseId es un parámetro dinámico que usaremos para saber qué curso cargar */}
                <Route 
                    path="/course/:courseId/lessons" 
                    element={
                        <PrivateRoute>
                            <Lessons />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;