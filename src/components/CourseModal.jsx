import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../api/axiosConfig';

const CourseModal = ({ show, handleClose, courseToEdit, refreshCourses }) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    useEffect(() => {
        if (courseToEdit) {
            setTitle(courseToEdit.title);
        } else {
            setTitle('');
        }
        setError('');
    }, [courseToEdit, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (courseToEdit) {
                await api.put(`/course/${courseToEdit.id}`, {
                    id: courseToEdit.id,
                    title: title,
                    status: courseToEdit.status
                });
            } else {
                await api.post('/course', { title });
            }
            refreshCourses(); // Recargar la tabla
            handleClose();
        } catch (err) {
            setError('Error al guardar el curso');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{courseToEdit ? 'Editar Curso' : 'Nuevo Curso'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Título del Curso</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ej: Introducción a .NET"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CourseModal;