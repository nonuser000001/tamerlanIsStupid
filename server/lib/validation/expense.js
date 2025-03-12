const { z } = require('zod');

const expenseSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    amount: z.number().positive(),
    tag: z.enum([
        'food',
        'rent',
        'transport',
        'clothing',
        'entertainment',
        'health',
        'education',
        'other',
    ]),
    currency: z.enum(['ILS', 'USD', 'EUR']).default('ILS'),
});

module.exports = { expenseSchema };
