import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks } from '../../store/actions/taskActions';
import TaskItem from './TaskItem';
import { Button, Spinner } from 'react-bootstrap';

const Tasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.tasks);
  const loading = useSelector((state) => state.task.loading);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getTasks());
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
        <h1>Tasks</h1>
        {user && (user.role === 'admin' || user.role === 'manager') && (
          <Link to="/tasks/new">
            <Button variant="primary">Create Task</Button>
          </Link>
        )}
      </div>
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <div className="row">
          {tasks.map((task) => (
            <div className="col-md-6 mb-4" key={task._id}>
              <TaskItem task={task} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;