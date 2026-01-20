import { BASE_URL } from './helper';

export const registerUser = async (user) => {
    const response = await fetch(`${BASE_URL}/user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    const data = await response.json();

    // Check if response is successful
    if (!response.ok) {
        // If backend returns an error message, throw it
        throw new Error(data.message || data || 'Registration failed');
    }

    return data;
};

export const getAllUsers = async () => {
    const token = localStorage.getItem('token');
    // Calling backend to get all users (Will need to implement this endpoint)
    const response = await fetch(`${BASE_URL}/user/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        // Fallback for now to avoid crash if endpoint doesn't exist
        console.warn("Failed to fetch users, backend endpoint might be missing");
        return [];
    }
    return response.json();
};

export const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.text();
};

export const updateUser = async (user) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/user/`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error(`Update failed with status: ${response.status}`);
    }

    return response.json();
};
