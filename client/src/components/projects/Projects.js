import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../../store/actions/projectActions';
import ProjectItem from './ProjectItem';
import { Button, Spinner } from 'react-bootstrap';

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const loading = useSelector((state) => state.project.loading);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Projects</h1>
        {user && user.role === 'admin' && (
          <Link to="/projects/new">
            <Button variant="primary">Create Project</Button>
          </Link>
        )}
      </div>
      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <div className="row">
          {projects.map((project) => (
            <div className="col-md-4 mb-4" key={project._id}>
              <ProjectItem project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;