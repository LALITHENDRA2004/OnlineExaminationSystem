import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import StudentLayout from '../layouts/StudentLayout';

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
import UserAttempts from '../pages/student/UserAttempts';
import ReviewQuiz from '../pages/student/ReviewQuiz';

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
      {/* Root route redirection */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>

        {/* Student Routes wrapped in StudentLayout */}
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/attempts" element={<UserAttempts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quizzes/:id" element={<QuizDetail />} />
          <Route path="/quizzes/:id/attempt" element={<QuizAttempt />} />
          <Route path="/results/:id" element={<Result />} />
          <Route path="/results/review/:rid" element={<ReviewQuiz />} />
        </Route>

        {/* Admin Routes wrapped in AdminLayout */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
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
