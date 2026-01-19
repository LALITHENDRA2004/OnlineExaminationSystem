import { BASE_URL } from './helper';

export const registerUser = async (user) => {
    const response = await fetch(`${BASE_URL}/user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    return response.json();
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
