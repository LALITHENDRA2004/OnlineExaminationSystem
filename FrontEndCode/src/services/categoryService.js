// src/services/categoryService.js
import { BASE_URL } from './helper';

export const getAllCategories = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/category/`, {
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

  const response = await fetch(`${BASE_URL}/category/`, {
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

  const response = await fetch(`${BASE_URL}/category/`, {
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

  const response = await fetch(`${BASE_URL}/category/${categoryId}`, {
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