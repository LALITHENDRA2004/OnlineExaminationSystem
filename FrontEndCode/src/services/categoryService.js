// src/services/categoryService.js

export const getAllCategories = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8080/category/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return await response.json();
};

export const createCategory = async (category) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8080/category/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category)
  });

  if (!response.ok) {
    throw new Error('Failed to create category');
  }

  return await response.json();
};

export const updateCategory = async (category) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8080/category/', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category)
  });

  if (!response.ok) {
    throw new Error('Failed to update category');
  }

  return await response.json();
};

export const deleteCategory = async (categoryId) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:8080/category/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete category');
  }
};