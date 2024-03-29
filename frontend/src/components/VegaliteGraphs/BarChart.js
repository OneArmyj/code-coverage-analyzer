import React from 'react'
import { VegaLite } from 'react-vega'
import { Handler } from "vega-tooltip"
import { config } from './utils/config';
import { unsortedEncoding, sortedEncoding } from './utils/encoding';

const BarChart = ({ sortCoverage }) => {

    const getEncoding = (sorted) => {
        return sorted ? sortedEncoding : unsortedEncoding
    }

    const getData = () => {
        let dataFile = require('./data.json');
        return dataFile.data
    }

    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": { "name": "values" },
        "padding": 50,
        "width": 1000,
        "height": 450,
        "autosize": {
            "type": "fit",
            "contains": "padding"
        },
        "config": config,
        "mark": {
            "type": "bar",
            "tooltip": true
        },
        "encoding": getEncoding(sortCoverage)
    }

    return (
        <div>
            <VegaLite className="barchart-vega" spec={spec} actions={false} data={getData()} renderer={"svg"} tooltip={new Handler().call} />
        </div>
    )
}

export default BarChart