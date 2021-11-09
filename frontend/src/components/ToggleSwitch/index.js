import React from 'react'
import './ToggleSwitch.scss'

const ToggleSwitch = ({ checked, setChecked }) => {

    return (
        <div>
            <div className="toggle-switch">
                <input
                    type="checkbox"
                    className="toggle-switch-checkbox"
                    name="toggleSwitch"
                    checked={checked}
                    onChange={e => setChecked(e.target.checked)}
                    id="toggleSwitch"
                />
                <label className="toggle-switch-label" htmlFor="toggleSwitch">
                    <span className="toggle-switch-inner" />
                    <span className="toggle-switch-switch" />
                </label>
            </div>
        </div>
    )
}

export default ToggleSwitch
