// /**
//  * App.jsx
//  * 
//  * Purpose:
//  * - Root component of the Online Examination System
//  * - Sets up React Router with BrowserRouter
//  * - Delegates all route definitions to AppRoutes component
//  * 
//  * TODO: Connect authentication and role-based access logic later
//  * TODO: Add global state management (Context API / Redux) when integrating with backend
//  * TODO: Replace route check with real auth logic (show layout only when authenticated)
//  */

// import React from 'react';
// import { BrowserRouter, useLocation } from 'react-router-dom';
// import AppRoutes from './routes/AppRoutes';
// import Navbar from './components/common/Navbar';
// import MainLayout from './layouts/MainLayout';

// function AppContent() {
//   const location = useLocation();

//   // TODO: Replace this route check with real authentication logic later
//   const isPublicRoute = location.pathname === '/login' || location.pathname === '/register';

//   if (isPublicRoute) {
//     return <AppRoutes />;
//   }

//   return (
//     <>
//       <Navbar />
//       <MainLayout>
//         <AppRoutes />
//       </MainLayout>
//     </>
//   );
// }


// function App() {
//   return (
//     <BrowserRouter>
//       <AppContent />
//     </BrowserRouter>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
