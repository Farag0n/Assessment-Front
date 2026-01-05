// src/pages/Dashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Badge, Row, Col, Alert, Pagination } from 'react-bootstrap';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import CourseModal from '../components/CourseModal';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Paginación
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            // Llamada al endpoint de Search con paginación
            const response = await api.get(`/course/search?page=${page}&pageSize=${pageSize}`);
            setCourses(response.data.data);
            setTotalPages(response.data.totalPages);
            setError('');
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar los cursos. Revisa la conexión.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [page]); // Recargar cuando cambie la página

    // Manejadores de Acciones
    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este curso?')) {
            try {
                await api.delete(`/course/${id}`);
                fetchCourses();
            } catch (err) {
                alert('Error al eliminar');
            }
        }
    };

    const handlePublishToggle = async (course) => {
        try {
            if (course.status === 1) { // 1 = Published
                await api.patch(`/course/${course.id}/unpublish`);
            } else {
                await api.patch(`/course/${course.id}/publish`);
            }
            fetchCourses();
        } catch (err) {
            // Aquí capturamos la regla de negocio del backend (ej: "No tiene lecciones")
            alert(err.response?.data?.message || 'Error al cambiar estado');
        }
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        setShowModal(true);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setShowModal(true);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Container className="mt-5">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1>Gestión de Cursos</h1>
                </Col>
                <Col xs="auto">
                    <Button variant="success" onClick={openCreateModal} className="me-2">
                        + Nuevo Curso
                    </Button>
                    <Button variant="outline-danger" onClick={handleLogout}>
                        Cerrar Sesión
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center">Cargando...</div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>Título</th>
                                <th>Estado</th>
                                <th>Lecciones</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center">No hay cursos disponibles</td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id}>
                                        <td>{course.title}</td>
                                        <td>
                                            <Badge bg={course.status === 1 ? 'success' : 'secondary'}>
                                                {course.status === 1 ? 'Publicado' : 'Borrador'}
                                            </Badge>
                                        </td>
                                        <td>
                                            {/* Botón para ir a ver lecciones (siguiente paso) */}
                                            <Button variant="link" size="sm" onClick={() => navigate(`/course/${course.id}/lessons`)}>
                                                Ver Lecciones
                                            </Button>
                                        </td>
                                        <td>
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => openEditModal(course)}
                                            >
                                                Editar
                                            </Button>
                                            <Button 
                                                variant={course.status === 1 ? "outline-warning" : "outline-success"} 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => handlePublishToggle(course)}
                                            >
                                                {course.status === 1 ? 'Despublicar' : 'Publicar'}
                                            </Button>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDelete(course.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    {/* Paginación */}
                    <div className="d-flex justify-content-center mt-3">
                        <Pagination>
                            <Pagination.Prev 
                                onClick={() => setPage(p => Math.max(1, p - 1))} 
                                disabled={page === 1}
                            />
                            <Pagination.Item active>{page}</Pagination.Item>
                            <Pagination.Next 
                                onClick={() => setPage(p => p + 1)} 
                                disabled={page >= totalPages}
                            />
                        </Pagination>
                    </div>
                </>
            )}

            <CourseModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                courseToEdit={editingCourse}
                refreshCourses={fetchCourses}
            />
        </Container>
    );
};

export default Dashboard;