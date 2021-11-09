import React from 'react'

const CheckBox = ({ module_extension }) => {
    return (
        <div className="checkbox">
            <input className="checkbox-input" type="checkbox" id="flexCheckChecked" />
            <label className="checkbox-label" for="flexCheckChecked">
                {module_extension}
            </label>
        </div>
    )
}

export default CheckBox
