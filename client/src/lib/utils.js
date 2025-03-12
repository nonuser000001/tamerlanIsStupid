export const formatPrice = (price) => {
    if (price == null) return ''; 
    return price.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' });
};
