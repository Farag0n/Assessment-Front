import { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Badge, Row, Col, Alert, Pagination, Card } from 'react-bootstrap';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import CourseModal from '../components/CourseModal';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    let isAdmin = false;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            isAdmin = role === 0 || role === "0" || role === "Admin";
        } catch (e) {
            console.error("Error al leer token", e);
        }
    }
    // -----------------------------------

    const fetchCourses = async () => {
        setLoading(true);
        try {
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
    }, [page]);

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
            if (course.status === 1) {
                await api.patch(`/course/${course.id}/unpublish`);
            } else {
                await api.patch(`/course/${course.id}/publish`);
            }
            fetchCourses();
        } catch (err) {
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

            {/* --- SECCIÓN DE MÉTRICAS (PUNTO EXTRA VISUAL) --- */}
            {/* Solo se muestra si hay cursos cargados para evitar flash vacíos */}
            {!loading && courses.length > 0 && (
                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="text-center shadow-sm border-0 bg-light">
                            <Card.Body>
                                <h6 className="text-muted">Cursos en Pantalla</h6>
                                <h2 className="text-primary fw-bold">{courses.length}</h2>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center shadow-sm border-0 bg-light">
                            <Card.Body>
                                <h6 className="text-muted">Publicados</h6>
                                <h2 className="text-success fw-bold">
                                    {courses.filter(c => c.status === 1).length}
                                </h2>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center shadow-sm border-0 bg-light">
                            <Card.Body>
                                <h6 className="text-muted">Borradores</h6>
                                <h2 className="text-secondary fw-bold">
                                    {courses.filter(c => c.status === 0).length}
                                </h2>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
            {/* ------------------------------------------------ */}

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p>Cargando datos...</p>
                </div>
            ) : (
                <>
                    <Table striped bordered hover responsive className="shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>Título</th>
                                <th>Estado</th>
                                <th>Contenido</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">
                                        No se encontraron cursos disponibles.
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id}>
                                        <td className="align-middle fw-semibold">{course.title}</td>
                                        <td className="align-middle">
                                            <Badge bg={course.status === 1 ? 'success' : 'secondary'}>
                                                {course.status === 1 ? 'Publicado' : 'Borrador'}
                                            </Badge>
                                        </td>
                                        <td className="align-middle">
                                            <Button variant="link" size="sm" onClick={() => navigate(`/course/${course.id}/lessons`)}>
                                                Ver Lecciones
                                            </Button>
                                        </td>
                                        <td className="align-middle">
                                            {isAdmin && (
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => openEditModal(course)}
                                            >
                                                Editar
                                            </Button>
                                            )}
                                            <Button 
                                                variant={course.status === 1 ? "outline-warning" : "outline-success"} 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => handlePublishToggle(course)}
                                            >
                                                {course.status === 1 ? 'Despublicar' : 'Publicar'}
                                            </Button>
                                            
                                            {/* Ocultar botón eliminar si NO es admin */}
                                            {isAdmin && (
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(course.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    {/* Paginación */}
                    <div className="d-flex justify-content-center mt-4">
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