// src/services/questionService.js

export const getQuestionsByQuiz = async (quizId) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:8080/question/quiz/all/${quizId}`, {  // ✅ Changed endpoint
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
  
  const response = await fetch('http://localhost:8080/question/', {
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
  
  const response = await fetch('http://localhost:8080/question/', {
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
  
  const response = await fetch(`http://localhost:8080/question/${questionId}`, {
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
  
  const response = await fetch(`http://localhost:8080/quiz/${quizId}`, {
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