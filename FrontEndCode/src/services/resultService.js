import { BASE_URL } from './helper';

export const getResultsByUser = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/result/current-user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch results');
    }

    return response.json();
};
