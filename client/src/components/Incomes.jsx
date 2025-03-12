import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useAuth } from './AuthProvider'
import { toast } from 'react-toastify'
import '../styles/Income.css';
import { AddIncome, deleteIncome, UpdateIncome, getIncomes } from '../api/income'
import { currencySymbols } from '../constants'
import { SlidersHorizontal } from 'lucide-react';
import { Filters } from './Filters';

export const Incomes = () => {
  const { user } = useAuth()
  const [isPending, setIsPending] = useState({ 'add': false, 'update': false, 'delete': false })
  const [incomes, setIncomes] = useState([])
  const [incomeID, setIncomeID] = useState()
  const [updateOrAdd, setUpdateOrAdd] = useState(false)
  const [inputSearch, setInputSearch] = useState('')
  const [selectFilter, setSelectFilter] = useState(null)


  const filteredIncomes = incomes.filter((income) => {
    const matchesSearch = income.title.toLowerCase().includes(inputSearch.toLowerCase());
    if (selectFilter && selectFilter.type === 'amount') {
      return (matchesSearch &&
        income.amount >= selectFilter.min &&
        income.amount <= selectFilter.max
      );
    }
    return matchesSearch;
  })

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getIncomes(user.id)
        setIncomes(data)
      } catch (error) {
        toast.error(error.message)
      }
    }
    getData()
  }, []);

  const maxAmount = useMemo(() => {
    console.log('useMemo');
    return incomes.length ?
      Math.max(...incomes.map((income) => income.amount)) : 0;
  }, [incomes]);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const tagRef = useRef(null);
  const currencyRef = useRef(null);

  const resetFields = () => {
    titleRef.current.value = ''
    descriptionRef.current.value = ''
    amountRef.current.value = ''
    tagRef.current.value = ''
    currencyRef.current.value = ''
  }

  const handleDelete = async (incomeId) => {
    try {
      setIsPending((prev) => ({ ...prev, delete: true }))
      const userId = user.id;
      const data = await deleteIncome(userId, incomeId);
      toast.success(data.message);
      const data1 = await getIncomes(user.id)
      setIncomes(data1)
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending((prev) => ({ ...prev, delete: false }))

    }
  };

  const editIncome = async (incomeId) => {
    try {
      setUpdateOrAdd(true)
      setIncomeID(incomeId)
      const data = await getIncomes(user.id)
      const income = data.find(income => income._id === incomeId);
      console.log(income)
      const { title, description, amount, tag, currency } = income;
      titleRef.current.value = title;
      descriptionRef.current.value = description;
      amountRef.current.value = Number(amount);
      tagRef.current.value = tag;
      currencyRef.current.value = currency;
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleUpdate = async (e, incomeId) => {
    e.preventDefault()
    try {
      const updatedIncome = {
        title: titleRef.current.value.trim(),
        description: descriptionRef.current.value.trim(),
        amount: parseFloat(amountRef.current.value),
        tag: tagRef.current.value,
        currency: currencyRef.current.value,
      };
      setIsPending((prev) => ({ ...prev, update: true }))
      const userId = user.id;
      const data = await UpdateIncome(userId, incomeId, updatedIncome);
      toast.success(data.message);
      resetFields()
      const data1 = await getIncomes(user.id)
      setIncomes(data1)
      setUpdateOrAdd(false)
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending((prev) => ({ ...prev, update: false }))
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const title = titleRef.current.value;
    const description = descriptionRef.current?.value;
    const amount = amountRef.current.value;
    const tag = tagRef.current.value;
    const currency = currencyRef.current.value;

    const payload = {
      userId: user.id,
      title,
      description,
      amount: Number(amount),
      tag,
      currency,
    };
    console.log(payload)
    try {
      setIsPending((prev) => ({ ...prev, add: true }))
      const data = await AddIncome(payload)
      toast.success(data.message);
      resetFields();
      setIncomes([...incomes, data.income]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending((prev) => ({ ...prev, add: false }))
    }
  };

  return (
    <main className='income-container'>
      <form onSubmit={(e) => updateOrAdd ? handleUpdate(e, incomeID) : handleSubmit(e)}>
        <h1>Incomes Page</h1>
        <div>
          <label htmlFor='title'>Title</label>
          <input type='text' id='title' ref={titleRef} placeholder='Enter income Title'></input>
        </div>
        <div>
          <label htmlFor='title'>Description</label>
          <input type='text' id='description' ref={descriptionRef} placeholder='Enter income Description'></input>
        </div>
        <div>
          <label htmlFor='title'>Amount</label>
          <input type='number' step={0.01} inputMode='numeric' id='amount' ref={amountRef} placeholder='Enter income Amount'></input>
        </div>
        <div>
          <label htmlFor='Tag'>Tag</label>
          <select id='tag' ref={tagRef}>
            <option value="salary">Salary</option>
            <option value="bonus">Bonus</option>
            <option value="gift">Gift</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor='currency'>Currency</label>
          <select id='currency' ref={currencyRef} required>
            <option value="ILS" defaultValue>ILS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <button type='submit' className='income-button' disabled={updateOrAdd ? isPending.update : isPending.add}>
          {updateOrAdd ? 'Update Income' : 'Add Income'}
        </button>
      </form>
      <Filters
        inputSearch={inputSearch}
        setInputSearch={setInputSearch}
        selectFilter={selectFilter}
        setSelectFilter={setSelectFilter}
        maxAmount={maxAmount}
      />
      {filteredIncomes.length ? (
        <table className='incomes-table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Tag</th>
              <th>Currency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncomes?.map((income) => (
              <tr key={income._id}>
                <td>{income.title}</td>
                <td>{income.description}</td>
                <td>{`${currencySymbols[income.currency]}${income.amount}`}</td>
                <td>{income.tag}</td>
                <td>{income.currency}</td>
                <td>
                  <div className='action-buttons'>
                    <button className='edit-button' onClick={() => editIncome(income._id)}>Edit</button>
                    <button className='delete-button' onClick={() => handleDelete(income._id)} disabled={isPending.delete}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>Not Found</p>}

    </main>
  )
};
