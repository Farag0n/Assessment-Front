// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/" />;
};

// Placeholder para el Dashboard (lo haremos en el siguiente paso)
const Dashboard = () => <h1 className="text-center mt-5">Bienvenido a los Cursos (En construcción)</h1>;

function App() {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route 
                    path="/courses" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    </AuthProvider>
  );
}

function App() {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                
                {/* AGREGAR RUTA DE REGISTRO */}
                <Route path="/register" element={<Register />} /> 

                <Route 
                    path="/courses" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;