import api from './api'

export const AddIncome = async (payload) => {
    try {
        const { userId } = payload
        const { data } = await api.post(`/income/add-income/${userId}`, payload);

        return data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'An unexpected error occurred. Please try again later.';

        throw new Error(message);
    }

}

export const getIncomes = async (userId) => {
    try {
        const { data } = await api.get(`/income/get-incomes/${userId}`);

        return data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'An unexpected error occurred. Please try again later.';

        throw new Error(message);
    }

}

export const getTotalIncomes = async (userId) => {
    try {
        const { data } = await api.get(`/income/get-total-incomes/${userId}`);

        return data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'An unexpected error occurred. Please try again later.';

        throw new Error(message);
    }

}

export const deleteIncome = async (userId, expenseId) => {
    try {
        console.log(userId, expenseId)
        const { data } = await api.delete(`/income/delete-income/${userId}/${expenseId}`);

        return data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'An unexpected error occurred. Please try again later.';

        throw new Error(message);
    }

}

export const UpdateIncome = async (userId, expenseId,payload) => {
    try {
        console.log(userId, expenseId)
        const { data } = await api.patch(`/income/update-income/${userId}/${expenseId}`,payload);

        return data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'An unexpected error occurred. Please try again later.';

        throw new Error(message);
    }

}