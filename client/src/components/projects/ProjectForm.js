import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  addProject,
  updateProject,
  getProject,
} from '../../store/actions/projectActions';
import { Form, Button, Spinner } from 'react-bootstrap';

const ProjectForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'not started',
    teamMembers: [],
  });

  const { name, description, startDate, endDate, status } = formData;
  const loading = useSelector((state) => state.project.loading);
  const project = useSelector((state) =>
    state.project.projects.find((p) => p._id === id)
  );

  useEffect(() => {
    if (id) {
      if (!project) {
        dispatch(getProject(id));
      } else {
        setFormData({
          name: project.name,
          description: project.description,
          startDate: moment(project.startDate).format('YYYY-MM-DD'),
          endDate: moment(project.endDate).format('YYYY-MM-DD'),
          status: project.status,
          teamMembers: project.teamMembers,
        });
      }
    }
  }, [dispatch, id, project]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updateProject(id, formData, history));
    } else {
      dispatch(addProject(formData, history));
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>{id ? 'Edit Project' : 'Create Project'}</h1>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter project name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            name="description"
            value={description}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="startDate"
            value={startDate}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            value={endDate}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={status}
            onChange={onChange}
          >
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on hold">On Hold</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          {id ? 'Update Project' : 'Create Project'}
        </Button>
      </Form>
    </div>
  );
};

export default ProjectForm;