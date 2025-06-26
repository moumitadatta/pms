import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../../store/actions/authActions';
import { getProjects } from '../../store/actions/projectActions';
import { getTasks } from '../../store/actions/taskActions';
import { Card, Row, Col, ListGroup, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faProjectDiagram,
  faTasks,
  faUserClock
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.task);

  const [clockedIn, setClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format('HH:mm:ss'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(loadUser());
    dispatch(getProjects());
    dispatch(getTasks());
  }, [dispatch]);

  const handleClockIn = async () => {
    try {
      // Dispatch action to backend
      // await dispatch(clockIn(user._id));
      setClockedIn(true);
    } catch (err) {
      console.error('Clock in failed:', err);
    }
  };

  const handleClockOut = async () => {
    try {
      // Dispatch action to backend
      // await dispatch(clockOut(user._id));
      setClockedIn(false);
    } catch (err) {
      console.error('Clock out failed:', err);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: 'success',
      'in progress': 'primary',
      'not started': 'secondary',
      'on hold': 'warning',
      pending: 'secondary',
      blocked: 'danger',
      default: 'light'
    };
    return statusMap[status] || statusMap.default;
  };

  const myProjects = projects
    ?.filter(
      (project) =>
        project.manager._id === user?._id ||
        project.teamMembers.some((member) => member._id === user?._id)
    )
    ?.slice(0, 3)
    ?.map((project) => (
      <ListGroup.Item
        key={project._id}
        className="d-flex justify-content-between align-items-center"
      >
        {project.name}
        <Badge variant={getStatusBadge(project.status)}>
          {project.status}
        </Badge>
      </ListGroup.Item>
    ));

  const myTasks = tasks
    ?.filter((task) => task.assignedTo._id === user?._id)
    ?.slice(0, 5)
    ?.map((task) => (
      <ListGroup.Item
        key={task._id}
        className="d-flex justify-content-between align-items-center"
      >
        {task.title}
        <Badge variant={getStatusBadge(task.status)}>
          {task.status}
        </Badge>
      </ListGroup.Item>
    ));

  return (
    <div className="dashboard">
      <h1 className="text-primary mb-4">Employee Dashboard</h1>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <FontAwesomeIcon
                icon={faProjectDiagram}
                size="3x"
                className="mb-3 text-primary"
              />
              <Card.Title>My Projects</Card.Title>
              <Card.Text className="display-4">
                {projects?.filter(
                  (project) =>
                    project.manager._id === user?._id ||
                    project.teamMembers.some((member) => member._id === user?._id)
                ).length || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <FontAwesomeIcon
                icon={faTasks}
                size="3x"
                className="mb-3 text-primary"
              />
              <Card.Title>My Tasks</Card.Title>
              <Card.Text className="display-4">
                {tasks?.filter((task) => task.assignedTo._id === user?._id).length || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <FontAwesomeIcon
                icon={faUserClock}
                size="3x"
                className="mb-3 text-primary"
              />
              <Card.Title>Current Time</Card.Title>
              <Card.Text className="display-4">{currentTime}</Card.Text>
              <Button
                variant={clockedIn ? 'danger' : 'success'}
                onClick={clockedIn ? handleClockOut : handleClockIn}
              >
                {clockedIn ? 'Clock Out' : 'Clock In'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Projects</h5>
              <Button variant="primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {myProjects?.length ? myProjects : <ListGroup.Item>No projects assigned</ListGroup.Item>}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Tasks</h5>
              <Button variant="primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {myTasks?.length ? myTasks : <ListGroup.Item>No tasks assigned</ListGroup.Item>}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDashboard;