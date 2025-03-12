const { incomeSchema } = require('../lib/validation/income');
const User = require('../models/user');
const Income = require('../models/income');
const { z } = require('zod');
const { userIdValidation } = require('../lib/validation/user');

const addIncome = async(req, res) => {
    try {
        if (req.user.id !== req.params.userId){
            return res.status(401).json({message: 'Unauthorized'});
        }

        const  userId  = userIdValidation.parse(req.params.userId);
        const {title, description, amount, tag, currency} = incomeSchema.parse(req.body);
        
        const userExists = await User.findById(userId);

        if (!userExists){
            return res.status(404).json({message: 'User not found'});
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

        const income = new Income({
            title,
            description,
            amount,
            tag,
            currency,
            originalAmount
        });

        await income.save();

        userExists.incomes.push(income);

        await userExists.save();

        return res.status(201).json({message: 'Income added successfully',income});
    } catch (error) {
        console.log(error);
        if(error instanceof z.ZodError){
            return res.status(400).json({message: error.errors[0].message});
        }

        return res.status(500).json({message: 'Internal server error'});
    }
};

const getIncomes = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId){
            return res.status(401).json({message: 'Unauthorized'});
        }

        const  userId  = userIdValidation.parse(req.params.userId);

        const userExists = await User.findById(userId);

        if (!userExists){
            return res.status(404).json({message: 'User not found'});
        }

        const incomes = await Income.find({_id: { $in: userExists.incomes } });
        
        return res.status(200).json(incomes);
    } catch (error) {
        console.log(error);
        if(error instanceof z.ZodError){
            return res.status(400).json({message: error.errors[0].message});
        }

        return res.status(500).json({message: 'Internal server error'});
    }  
};

const updateIncome = async (req, res) => {
    try {

        if (req.user.id !== req.params.userId){
            return res.status(401).json({message: 'Unauthorized'});
        }

        const userId = userIdValidation.parse(req.params.userId);
        const incomeId = userIdValidation.parse(req.params.incomeId); 
        
        const { title, description, amount, tag, currency } = incomeSchema.parse(req.body);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const income = await Income.findById(incomeId);
        if (!income || !userExists.incomes.includes(incomeId)) {
            return res.status(404).json({ message: 'Income not found' });
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

        // Update income fields
        income.title = title;
        income.description = description;
        income.amount = amount;
        income.tag = tag;
        income.currency = currency;
        income.originalAmount = originalAmount;

        await income.save();

        return res.status(200).json({ message: 'Income updated successfully', income });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }

        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteIncome = async (req, res) => {
    try {

        if (req.user.id !== req.params.userId){
            return res.status(401).json({message: 'Unauthorized'});
        }
        
        const userId = userIdValidation.parse(req.params.userId);
        const incomeId = userIdValidation.parse(req.params.incomeId); 
        
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const incomeIndex = userExists.incomes.indexOf(incomeId);
        if (incomeIndex === -1) {
            return res.status(404).json({ message: 'Income not found' });
        }

        userExists.incomes.splice(incomeIndex, 1);
        await userExists.save();
        
        await Income.findByIdAndDelete(incomeId);

        return res.status(200).json({ message: 'Income deleted successfully' });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }

        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getTotalIncomes = async (req, res) => {
    try {
        const userId = userIdValidation.parse(req.params.userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const incomes = await Income.find({ _id: { $in: user.incomes } });
        const totalIncomes = incomes.reduce(
        (sum, income) => sum +(income.currency!=='ILS'? income.originalAmount:income.amount), 0);
        return res.status(200).json({ totalIncomes });

    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json();
        }
        return res.status(500).json();
    }
};


module.exports = {
    addIncome,
    getIncomes,
    updateIncome,
    deleteIncome,
    getTotalIncomes,
};