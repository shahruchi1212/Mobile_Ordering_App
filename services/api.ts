import { ENDPOINTS } from '../constants/api';


export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
    };
}



// Fetches all products data from the dummy API.

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(ENDPOINTS.products);

    if (!response.ok) {
        throw new Error('Failed to fetch products. Status: ' + response.status);
    }

    return response.json();
}

//Fetches the dummy user profile.
export async function fetchUserProfile(): Promise<User> {
    const response = await fetch(ENDPOINTS.userProfile);

    if (!response.ok) {
        throw new Error('Failed to fetch user profile. Status: ' + response.status);
    }

    return response.json();
}

// dummy the order placement API call.
export async function placeOrder(orderData: any): Promise<{ orderId: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Order Placed:', orderData);

    return { orderId: `ORD-${Date.now()}` };
}