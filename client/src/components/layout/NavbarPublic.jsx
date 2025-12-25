import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      {/* El padding-top se mueve aquí porque solo estas páginas tienen Navbar fijo */}
      <div className="pt-20"> 
        <Outlet /> {/* Aquí se renderizará Landing, Login o Register según corresponda */}
      </div>
    </>
  );
};

export default PublicLayout;