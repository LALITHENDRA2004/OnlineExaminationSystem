import { BASE_URL } from './helper';

export const getAllQuizzes = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/quiz/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch quizzes');
  }

  return await response.json();
};

// Get all active quizzes
export const getActiveQuizzes = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/quiz/active`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch active quizzes');
  }

  return await response.json();
};

export const createQuiz = async (quiz) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/quiz/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quiz)
  });

  if (!response.ok) {
    throw new Error('Failed to create quiz');
  }

  return await response.json();
};

export const updateQuiz = async (quiz) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/quiz/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quiz)
  });

  if (!response.ok) {
    throw new Error('Failed to update quiz');
  }

  return await response.json();
};

export const deleteQuiz = async (qid) => {
  const token = localStorage.getItem('token');

  console.log('DELETE quiz id:', qid);
  console.log('TOKEN:', token);

  const response = await fetch(`${BASE_URL}/quiz/${qid}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  console.log('DELETE status:', response.status);

  if (!response.ok) {
    const text = await response.text();
    console.error('DELETE error response:', text);
    throw new Error('Failed to delete quiz');
  }
};

