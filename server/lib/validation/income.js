const {z} = require('zod');

const incomeSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    amount: z.number().positive(),
    tag: z.enum(['salary', 'bonus', 'gift', 'other']),
    currency: z.enum(['ILS', 'USD', 'EUR']),
});


module.exports = { incomeSchema };