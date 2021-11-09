import React, { useState } from 'react'
import BarChart from './BarChart'
import ToggleSwitch from '../components/ToggleSwitch'
import CheckBox from '../components/CheckBox'
import './viz.css'

const Viz = () => {
    const [sortCoverage, setSortCoverage] = useState(false)

    return (
        <div className="visualizer-container">
            <div className="visualizer-container-top">
                <div className="sort-coverage-button">
                    <p>Sort by coverage : &nbsp;</p>
                    <ToggleSwitch checked={sortCoverage} setChecked={setSortCoverage} />
                </div>
                <hr style={{ width: 220, textAlign: "left" }} />
                <div className="visualizer-filter-box">
                    <p>Filter by : </p>
                    <CheckBox module_extension={".arx"} />
                    <CheckBox module_extension={".crx"} />
                    <CheckBox module_extension={".dbx"} />
                    <CheckBox module_extension={".dll"} />
                </div>
            </div>
            <BarChart sortCoverage={sortCoverage} />
        </div>
    )
}

export default Viz
