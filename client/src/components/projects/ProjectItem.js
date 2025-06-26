import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import moment from 'moment';

const ProjectItem = ({ project }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'not started':
        return 'secondary';
      case 'on hold':
        return 'warning';
      default:
        return 'light';
    }
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>
          <Link to={`/projects/${project._id}`}>{project.name}</Link>
        </Card.Title>
        <Card.Text className="text-muted">
          {project.description || 'No description'}
        </Card.Text>
        <div className="mb-2">
          <Badge variant={getStatusBadge(project.status)}>
            {project.status}
          </Badge>
        </div>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
          {moment(project.startDate).format('MMM Do YYYY')} -{' '}
          {moment(project.endDate).format('MMM Do YYYY')}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default ProjectItem;