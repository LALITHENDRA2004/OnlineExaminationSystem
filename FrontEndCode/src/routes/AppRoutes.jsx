import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

// Public pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Student pages
import StudentDashboard from '../pages/student/StudentDashboard';
import QuizList from '../pages/student/QuizList';
import QuizDetail from '../pages/student/QuizDetail';
import QuizAttempt from '../pages/student/QuizAttempt';
import Result from '../pages/student/Result';
import Profile from '../pages/student/Profile';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminQuizzes from '../pages/admin/AdminQuizzes';
import AdminQuestions from '../pages/admin/AdminQuestions';
import AdminRoute from './AdminRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Student */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quizzes/:id" element={<QuizDetail />} />
          <Route path="/quizzes/:id/attempt" element={<QuizAttempt />} />
          <Route path="/results/:id" element={<Result />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/quizzes" element={<AdminQuizzes />} />
            <Route path="/admin/quizzes/:id/questions" element={<AdminQuestions />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
