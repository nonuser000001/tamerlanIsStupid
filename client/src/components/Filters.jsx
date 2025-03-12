import { SlidersHorizontal, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Modal } from './Modal'
import '../styles/Filters.css'
import { FilterModal } from './FilterModal'

export const Filters = ({
    inputSearch,
    setInputSearch,
    selectFilter,
    setSelectFilter,
    maxAmount
}) => {

    const MIN_BOUND = 0
    const MAX_BOUND = maxAmount;

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [rangeValue, setRangeValue] = useState([MIN_BOUND, MAX_BOUND])

    useEffect(()=>{
        setRangeValue([MIN_BOUND,MAX_BOUND])
    },[maxAmount])

    const handleFilterSelect = (option) => {
        setSelectFilter(option)
        setIsFilterModalOpen(false)
    }

    const handleClearFilter = () => {
        setSelectFilter(null)
        setRangeValue([MIN_BOUND, MAX_BOUND])
    }

    return (
        <>
            <div className='filters'>
                <input type='search' placeholder='Search...'
                    value={inputSearch}
                    onChange={(e) => setInputSearch(e.target.value)}></input>
                <button onClick={() => setIsFilterModalOpen(true)}>
                    <SlidersHorizontal />
                </button>
            </div>
            <FilterModal
            isOpen={isFilterModalOpen}
            onClose={()=> setIsFilterModalOpen(false)}
            onFilterSelect={handleFilterSelect}
            rangeValue={rangeValue}
            setRangeValue={setRangeValue}
            MIN_BOUND={MIN_BOUND}
            MAX_BOUND={MAX_BOUND}
            />
            {selectFilter && (
                <div className='selected-filter'>
                    <span className='filter-label'>
                        Filter: Min: {selectFilter.min} - Max: {selectFilter.max}
                    </span>
                    <Trash2 onClick={handleClearFilter} className='clear-filter-icon'/>
                </div>

            )}
            </>
            )

}
