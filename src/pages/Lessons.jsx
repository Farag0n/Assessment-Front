import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Alert, Badge } from 'react-bootstrap';
import api from '../api/axiosConfig';
import LessonModal from '../components/LessonModal';

const Lessons = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [courseTitle, setCourseTitle] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);

    const fetchLessons = async () => {
        setLoading(true);
        try {
            const courseRes = await api.get(`/course/${courseId}/summary`);
            setCourseTitle(courseRes.data.title);

            const lessonsRes = await api.get(`/lesson/course/${courseId}`);
            setLessons(lessonsRes.data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Error al cargar lecciones.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLessons();
    }, [courseId]);

    const handleReorder = async (lesson, direction) => {
        
        const newOrder = lesson.order + direction;
        
        try {
            await api.patch(`/lesson/${courseId}/reorder`, {
                lessonId: lesson.id,
                newOrder: newOrder
            });
            fetchLessons();
        } catch (err) {
            alert(err.response?.data?.message || 'No se puede mover en esa dirección');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar lección?')) {
            try {
                await api.delete(`/lesson/${id}`);
                fetchLessons();
            } catch (err) {
                alert('Error al eliminar');
            }
        }
    };

    const openCreateModal = () => {
        setEditingLesson(null);
        setShowModal(true);
    };

    const openEditModal = (lesson) => {
        setEditingLesson(lesson);
        setShowModal(true);
    };

    return (
        <Container className="mt-5">
            <Button variant="outline-secondary" className="mb-3" onClick={() => navigate('/courses')}>
                &larr; Volver a Cursos
            </Button>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Lecciones de: {courseTitle}</h2>
                <Button variant="success" onClick={openCreateModal}>
                    + Nueva Lección
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th style={{width: '80px'}}>Orden</th>
                        <th>Título</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.length === 0 ? (
                        <tr><td colSpan="3" className="text-center">No hay lecciones en este curso.</td></tr>
                    ) : (
                        lessons.map((lesson, index) => (
                            <tr key={lesson.id}>
                                <td className="text-center fw-bold">{lesson.order}</td>
                                <td>{lesson.title}</td>
                                <td>
                                    <Button 
                                        variant="light" size="sm" className="me-1"
                                        disabled={lesson.order === 1}
                                        onClick={() => handleReorder(lesson, -1)}
                                    >
                                        ⬆️
                                    </Button>
                                    <Button 
                                        variant="light" size="sm" className="me-3"
                                        disabled={index === lessons.length - 1}
                                        onClick={() => handleReorder(lesson, 1)}
                                    >
                                        ⬇️
                                    </Button>

                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEditModal(lesson)}>
                                        Editar
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(lesson.id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <LessonModal 
                show={showModal} 
                handleClose={() => setShowModal(false)}
                lessonToEdit={editingLesson}
                courseId={courseId}
                refreshLessons={fetchLessons}
            />
        </Container>
    );
};

export default Lessons;