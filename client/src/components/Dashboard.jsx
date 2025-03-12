import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import { useAuth } from "./AuthProvider";
import { getTotalExpenses } from '../api/expense';
import { getTotalIncomes } from '../api/income';
import { formatPrice } from '../lib/utils';
import { LineChart } from './charts/LineChart';
import { BarChart } from './charts/BarChart';

export const Dashboard = () => {
  const { user } = useAuth();
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncomes, settotalIncomes] = useState(0);
  const [isPending, setIsPending] = useState({ expenses: false, incomes: false });

  useEffect(() => {
    const fetchTotalExpenses = async () => {
      try {
        setIsPending(prev => ({ ...prev, expenses: true }));
        const data = await getTotalExpenses(user.id);
        setTotalExpenses(data.totalExpenses);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsPending(prev => ({ ...prev, expenses: false }));
      }
    }

    const fetchTotalIncomes = async () => {
      try {
        setIsPending(prev => ({ ...prev, incomes: true }));
        const data = await getTotalIncomes(user.id);
        settotalIncomes(data.totalIncomes);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsPending(prev => ({ ...prev, incomes: false }));
      }
    }

    fetchTotalIncomes();
    fetchTotalExpenses();
  }, []);

  return (
    <div className='dashboard'>
      <header className='dashboard-header'>
        <h1>Welcome {user.fullName}</h1>
      </header>

      <div className='summary'>
        <div className='card income'>
          <h2>Total Income</h2>
          {isPending.incomes ? <p>...</p> : <p>{formatPrice(totalIncomes)}</p>}
        </div>

        <div className='card expense'>
          <h2>Total Expenses</h2>
          {isPending.expenses ? <p>...</p> : <p>{formatPrice(totalExpenses)}</p>}
        </div>

        <div className='card balance'>
          <h2>Total Balance</h2>
          <p>{formatPrice(totalIncomes - totalExpenses)}</p>
        </div>
      </div>
      <div className="charts">
        <LineChart/>
        <BarChart/>
      </div>
    </div>
  )
}
