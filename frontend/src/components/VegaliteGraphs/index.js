import React, { useState } from 'react'
import BarChart from './BarChart'
import FilterBox from './FilterBox'
import './style/viz.css'

const Viz = () => {
    const [sortCoverage, setSortCoverage] = useState(false)

    return (
        <div className="visualizer-container">
            <FilterBox sortCoverage={sortCoverage} setSortCoverage={setSortCoverage} />
            <BarChart sortCoverage={sortCoverage} />
        </div>
    )
}

export default Viz
