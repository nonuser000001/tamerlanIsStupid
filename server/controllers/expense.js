const { expenseSchema } = require('../lib/validation/expense');
const User = require('../models/user');
const Expense = require('../models/expense');
const { z } = require('zod');
const { userIdValidation } = require('../lib/validation/user');

const addExpense = async (req, res) => {
    try {

        if (req.user.id !== req.params.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = userIdValidation.parse(req.params.userId);
        const { title, description, amount, tag, currency } = expenseSchema.parse(req.body);

        const userExists = await User.findById(userId);
        let originalAmount = 0;
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (currency !== "ILS") {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${currency}`);
            const data = await response.json();
            if (!response.ok) {
                return res.status(400).json({ message: 'Currency not found' });
            }
            originalAmount = data.conversion_rates.ILS * amount;
        }

        const expense = new Expense({
            title,
            description,
            amount,
            tag,
            currency,
            originalAmount,
        });

        await expense.save();

        userExists.expenses.push(expense);
        await userExists.save();

        return res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getExpenses = async (req, res) => {
    try {

        if (req.user.id !== req.params.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = userIdValidation.parse(req.params.userId);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const expenses = await Expense.find({ _id: { $in: userExists.expenses } });

        return res.status(200).json(expenses);
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateExpense = async (req, res) => {
    try {

        if (req.user.id !== req.params.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = userIdValidation.parse(req.params.userId);
        const expenseId = userIdValidation.parse(req.params.expenseId);
        const { title, description, amount, tag, currency } = expenseSchema.parse(req.body);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }
        let originalAmount = 0;
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (currency !== "ILS") {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${currency}`);
            const data = await response.json();
            if (!response.ok) {
                return res.status(400).json({ message: 'Currency not found' });
            }
            originalAmount = data.conversion_rates.ILS * amount;
        }

        const expense = await Expense.findOneAndUpdate(
            { _id: expenseId },
            { title, description, amount, tag, currency,originalAmount },
            { new: true }
        );

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        return res.status(200).json({ message: 'Expense updated successfully', expense });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteExpense = async (req, res) => {
    try {

        if (req.user.id !== req.params.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = userIdValidation.parse(req.params.userId);
        const expenseId = userIdValidation.parse(req.params.expenseId);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const expense = await Expense.findOneAndDelete({ _id: expenseId });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        await User.findByIdAndUpdate(userId, { $pull: { expenses: expenseId } });

        return res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getTotalExpenses = async (req, res) => {
    try {
        /*
                const userId = userIdValidation.parse(req.params.userId);
                const user = await User.findById(userId).populate("expenses");
                if (!user) {
                    return res.status(404).json();
                }
        
                const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/USD`);
                const data = await response.json();
        
                const USD_ILS = data.conversion_rates.ILS;
                const USD_EUR = data.conversion_rates.EUR;
                const EUR_ILS = USD_ILS / USD_EUR;
        
                const totalExpenses = user.expenses.reduce((sum, expense) => {
                    if (expense.currency === "ILS") return sum + expense.amount;
                    if (expense.currency === "USD") return sum + expense.amount * USD_ILS;
                    return sum + expense.amount * EUR_ILS;
                }, 0);
        
                return res.status(200).json({ totalExpenses });
        */
        // if (req.user.id !== req.params.userId) {
        //     return res.status(401).json({ message: 'Unauthorized' });
        // }
        const userId = userIdValidation.parse(req.params.userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const expenses = await Expense.find({ _id: { $in: user.expenses } });
        const totalExpenses = expenses.reduce(
        (sum, expense) => sum +(expense.currency!=='ILS'? expense.originalAmount:expense.amount), 0);
        return res.status(200).json({ totalExpenses });

    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json();
        }
        return res.status(500).json();
    }
};



module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getTotalExpenses,
};
