import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../../store/actions/authActions';
import { getProjects } from '../../store/actions/projectActions';
import { getTasks } from '../../store/actions/taskActions';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Card,
  Row,
  Col,
  ListGroup,
  Badge,
  Button,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faProjectDiagram,
  faTasks,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

// ✅ Register ChartJS elements AFTER all imports
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.task);

  const [projectStats, setProjectStats] = useState({
    notStarted: 0,
    inProgress: 0,
    completed: 0,
    onHold: 0,
  });

  const [taskStats, setTaskStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    blocked: 0,
  });

  useEffect(() => {
    dispatch(loadUser());
    dispatch(getProjects());
    dispatch(getTasks());
  }, [dispatch]);

  useEffect(() => {
    if (projects) {
      const stats = {
        notStarted: projects.filter((p) => p.status === 'not started').length,
        inProgress: projects.filter((p) => p.status === 'in progress').length,
        completed: projects.filter((p) => p.status === 'completed').length,
        onHold: projects.filter((p) => p.status === 'on hold').length,
      };
      setProjectStats(stats);
    }
  }, [projects]);

  useEffect(() => {
    if (tasks) {
      const stats = {
        pending: tasks.filter((t) => t.status === 'pending').length,
        inProgress: tasks.filter((t) => t.status === 'in progress').length,
        completed: tasks.filter((t) => t.status === 'completed').length,
        blocked: tasks.filter((t) => t.status === 'blocked').length,
      };
      setTaskStats(stats);
    }
  }, [tasks]);

  const projectData = {
    labels: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    datasets: [
      {
        label: 'Projects by Status',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        data: [
          projectStats.notStarted,
          projectStats.inProgress,
          projectStats.completed,
          projectStats.onHold,
        ],
      },
    ],
  };

  const taskData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Blocked'],
    datasets: [
      {
        label: 'Tasks by Status',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        data: [
          taskStats.pending,
          taskStats.inProgress,
          taskStats.completed,
          taskStats.blocked,
        ],
      },
    ],
  };

  const recentProjects = projects
    ? projects.slice(0, 3).map((project) => (
        <ListGroup.Item
          key={project._id}
          className="d-flex justify-content-between align-items-center"
        >
          {project.name}
          <Badge bg={getStatusBadge(project.status)}>
            {project.status}
          </Badge>
        </ListGroup.Item>
      ))
    : null;

  const recentTasks = tasks
    ? tasks.slice(0, 5).map((task) => (
        <ListGroup.Item
          key={task._id}
          className="d-flex justify-content-between align-items-center"
        >
          {task.title}
          <Badge bg={getStatusBadge(task.status)}>
            {task.status}
          </Badge>
        </ListGroup.Item>
      ))
    : null;

  function getStatusBadge(status) {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'not started':
        return 'secondary';
      case 'on hold':
        return 'warning';
      case 'pending':
        return 'secondary';
      case 'blocked':
        return 'danger';
      default:
        return 'light';
    }
  }

  return (
    <div className="dashboard">
      <h1 className="text-primary mb-4">Admin Dashboard</h1>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FontAwesomeIcon
                icon={faUsers}
                size="3x"
                className="mb-3 text-primary"
              />
              <Card.Title>Total Employees</Card.Title>
              <Card.Text className="display-4">24</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FontAwesomeIcon
                icon={faProjectDiagram}
                size="3x"
                className="mb-3 text-primary"
              />
              <Card.Title>Ongoing Projects</Card.Title>
              <Card.Text className="display-4">
                {projects ? projects.length : 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FontAwesomeIcon
                icon={faTasks}
                size="3x"
                className="mb-3 text-primary"
              />
              <Card.Title>Active Tasks</Card.Title>
              <Card.Text className="display-4">
                {tasks ? tasks.length : 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FontAwesomeIcon
                icon={faClock}
                size="3x"
                className="mb-3 text-primary"
              />
              <Card.Title>Pending Approvals</Card.Title>
              <Card.Text className="display-4">5</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Projects Status</h5>
            </Card.Header>
            <Card.Body style={{ height: '300px' }}>
              <Pie data={projectData} options={{ maintainAspectRatio: false }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Tasks Status</h5>
            </Card.Header>
            <Card.Body style={{ height: '300px' }}>
              <Bar
                data={taskData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Projects</h5>
              <Button variant="primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">{recentProjects}</ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Tasks</h5>
              <Button variant="primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">{recentTasks}</ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
