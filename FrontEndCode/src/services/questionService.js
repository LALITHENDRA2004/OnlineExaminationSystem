import { BASE_URL } from './helper';

export const getQuestionsForAdmin = async (quizId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/question/quiz/all/${quizId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  return await response.json();
};

export const getQuestionsForStudent = async (quizId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/question/quiz/${quizId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  return await response.json();
};


export const createQuestion = async (question) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/question/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(question)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Create question error:', errorText);
    throw new Error('Failed to create question');
  }

  return await response.json();
};

export const updateQuestion = async (question) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/question/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(question)
  });

  if (!response.ok) {
    throw new Error('Failed to update question');
  }

  return await response.json();
};

export const deleteQuestion = async (questionId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/question/${questionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete question');
  }
};

export const getQuiz = async (quizId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/quiz/${quizId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch quiz');
  }

  return await response.json();
};

export const getTotalQuestionCount = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/question/count`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch question count');
  }

  return await response.json();
};
