import React from 'react'
import ToggleSwitch from '../components/ToggleSwitch'
import CheckBox from '../components/CheckBox'

const FilterBox = ({ sortCoverage, setSortCoverage }) => {
    return (
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
    )
}

export default FilterBox
