import api from "./api";

export const signUp = async (payload) => {
    try {
        const { data } = await api.post('/user/sign-up', payload);

        return data;
    } catch (error) {
        const message = 
         error.response?.data?.message ||
         'An unexpected error occurred. Please try again later.';
        
        throw new Error(message);
    }
}
export const login = async (payload) => {
    try {
        const { data } = await api.post('/user/sign-in', payload);

        return data;
    } catch (error) {
        const message = 
         error.response?.data?.message ||
         'An unexpected error occurred. Please try again later.';
        
        throw new Error(message);
    }
}


export const logout = async () => {
    try {
        const response = await api.post('/user/log-out');
        if (response.status === 200) {
            window.location.href = '/auth';
        }
    } catch (error) {
        const message = error.response?.data?.message || 'An unexpected error occurred. Please try again later.';
        console.error(error); // Log full error for debugging
        throw new Error(message);
    }
};

export const me = async() =>{
    try {
        const { data } = await api.get('/user/me');

        return data;
    } catch (error) {
        const message = 
        error.response?.data?.message ||
        'An unexpected error occurred. Please try again later.';
       
       throw new Error(message);
    }
}
