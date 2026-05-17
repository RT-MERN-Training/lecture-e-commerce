import { Outlet } from 'react-router-dom';

import { Footer } from './Footer';
import { Navbar } from '../../features/navbar/Navbar';

const RootLayout = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
