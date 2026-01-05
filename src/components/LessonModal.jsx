import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../api/axiosConfig';

const LessonModal = ({ show, handleClose, lessonToEdit, courseId, refreshLessons }) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (lessonToEdit) {
            setTitle(lessonToEdit.title);
        } else {
            setTitle('');
        }
        setError('');
    }, [lessonToEdit, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (lessonToEdit) {
                await api.put(`/lesson/${lessonToEdit.id}`, {
                    id: lessonToEdit.id,
                    title: title,
                });
            } else {
                await api.post('/lesson', { 
                    courseId: courseId, 
                    title: title 
                });
            }
            refreshLessons();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{lessonToEdit ? 'Editar Lección' : 'Nueva Lección'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Título de la Lección</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default LessonModal;