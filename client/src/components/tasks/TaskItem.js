import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import moment from 'moment';

const TaskItem = ({ task }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'pending':
        return 'secondary';
      case 'blocked':
        return 'danger';
      default:
        return 'light';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'light';
    }
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>
          <Link to={`/tasks/${task._id}`}>{task.title}</Link>
        </Card.Title>
        <Card.Text className="text-muted">
          {task.description || 'No description'}
        </Card.Text>
        <div className="mb-2">
          <Badge variant={getStatusBadge(task.status)} className="mr-2">
            {task.status}
          </Badge>
          <Badge variant={getPriorityBadge(task.priority)}>
            {task.priority}
          </Badge>
        </div>
        <div>
          <small className="text-muted">
            Due: {moment(task.dueDate).format('MMM Do YYYY')}
          </small>
        </div>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
          Project: {task.project?.name || 'No project'}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default TaskItem;