
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <div>
    
    Welcome to the Dashboard{user.name} !
    
    </div>
};

export default Dashboard;
