import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(1);
    const [error, setError] = useState('');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/register', { 
                email, 
                username, 
                password, 
                role: parseInt(role) 
            });
            
            login(response.data.accessToken, response.data.refreshToken);
            navigate('/courses'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar usuario');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Registro</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control 
                                type="text" value={username} onChange={(e) => setUsername(e.target.value)} required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="1">Usuario</option>
                                <option value="0">Administrador</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100 mb-2">
                            Registrarse
                        </Button>
                        <Button variant="link" className="w-100" onClick={() => navigate('/')}>
                            ¿Ya tienes cuenta? Inicia Sesión
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;