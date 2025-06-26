import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { addTask, updateTask, getTask } from '../../store/actions/taskActions';
import { getProjects } from '../../store/actions/projectActions';
import { Form, Button, Spinner } from 'react-bootstrap';
import moment from 'moment';

const TaskForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    dueDate: '',
    status: 'pending',
    priority: 'medium',
  });

  const { title, description, project, dueDate, status, priority } = formData;
  const taskLoading = useSelector((state) => state.task.loading);
  const projects = useSelector((state) => state.project.projects);
  const task = useSelector((state) =>
    state.task.tasks.find((t) => t._id === id)
  );

  useEffect(() => {
    dispatch(getProjects());
    if (id) {
      if (!task) {
        dispatch(getTask(id));
      } else {
        setFormData({
          title: task.title,
          description: task.description,
          project: task.project?._id || '',
          dueDate: moment(task.dueDate).format('YYYY-MM-DD'),
          status: task.status,
          priority: task.priority,
        });
      }
    }
  }, [dispatch, id, task]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updateTask(id, formData, history));
    } else {
      dispatch(addTask(formData, history));
    }
  };

  if (taskLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>{id ? 'Edit Task' : 'Create Task'}</h1>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter task title"
            name="title"
            value={title}
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
          <Form.Label>Project</Form.Label>
          <Form.Control
            as="select"
            name="project"
            value={project}
            onChange={onChange}
            required
          >
            <option value="">Select Project</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="date"
            name="dueDate"
            value={dueDate}
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
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Priority</Form.Label>
          <Form.Control
            as="select"
            name="priority"
            value={priority}
            onChange={onChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          {id ? 'Update Task' : 'Create Task'}
        </Button>
      </Form>
    </div>
  );
};

export default TaskForm;