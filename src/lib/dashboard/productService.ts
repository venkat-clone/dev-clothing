// lib/productServices.ts
import type { Product } from '@/types/product';
import apiClient from '../apiClient';

// Function to fetch products based on a search query
export const fetchProducts = async (search: string): Promise<Product[]> => {
    try {
        const response = await apiClient.get(`/products`, {
            params: { search }, // Using params to handle query parameters
        });
        // console.log(response.request);
        return response.data; // Return the fetched data
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; // Re-throw error for handling in the calling component
    }
};

// Function to save a new or edited product
export const saveProduct = async (newProduct: any, editingProductId: number | null) => {
    try {
        const method = editingProductId ? 'PUT' : 'POST';
        const url = editingProductId ? `/products/${editingProductId}` : '/products';

        const response = await apiClient({
            method,
            url,
            data: newProduct,
        });

        return response.data; // Return the saved product data if necessary
    } catch (error) {
        console.error('Error saving product:', error);
        throw error; // Re-throw error for handling in the calling component
    }
};

export const fetchSizes = async (productId: number) => {
    try {
        const response = await apiClient.get(`/products/${productId}/sizes`);
        return response.data; // Return the fetched sizes
    } catch (error) {
        console.error('Error fetching sizes:', error);
        throw error; // Re-throw error for handling in the calling component
    }
};

// Function to save a new or edited size
export const saveSize = async (newSize: any, editingSizeId: number | null, productId: number) => {
    try {
        const method = editingSizeId ? 'PUT' : 'POST';
        const url = editingSizeId ? `/products/${productId}/sizes/${editingSizeId}` : `/products/${productId}/sizes`;

        const response = await apiClient({
            method,
            url,
            data: newSize,
        });

        return response.data; // Return the saved size data if necessary
    } catch (error) {
        console.error('Error saving size:', error);
        throw error; // Re-throw error for handling in the calling component
    }
};


export const deleteSize = async (productId: number, sizeId: number) => {
    try {
        const response = await apiClient.delete(`/products/${productId}/sizes/${sizeId}`);
        return response.data; // Return the response if necessary
    } catch (error) {
        console.error('Error deleting size:', error);
        throw error; // Re-throw error for handling in the calling component
    }
};


export const fetchColors = async (productId: number) => {
    try {
        const response = await apiClient.get(`/products/${productId}/colors`);
        return response.data; // Return the fetched colors
    } catch (error) {
        console.error('Error fetching colors:', error);
        throw error; // Re-throw error for handling in the calling component
    }
};

// Function to save a new or edited color
export const saveColor = async (newColor: any, editingColorId: number | null, productId: number) => {
    try {
        const method = editingColorId ? 'PUT' : 'POST';
        const url = editingColorId ? `/products/${productId}/colors/${editingColorId}` : `/products/${productId}/colors`;

        const response = await apiClient({
            method,
            url,
            data: newColor,
        });

        return response.data; // Return the saved color data if necessary
    } catch (error) {
        console.error('Error saving color:', error);
        throw error; // Re-throw error for handling in the calling component
    }
};

// Function to delete a color by ID
export const deleteColor = async (productId: number, colorId: number) => {
    try {
        const response = await apiClient.delete(`/products/${productId}/colors/${colorId}`);
        return response.data; // Return the response if necessary
    } catch (error) {
        console.error('Error deleting color:', error);
        throw error; // Re-throw error for handling in the calling component
    }
};














