const unsortedEncoding = {
    "x": {
        "field": "Coverage",
        "type": "quantitative",
    },
    "y": {
        "field": "Module",
        "type": "nominal",
    },
    "color": {
        "field": "Coverage",
        "type": "quantitative",
        "scale": {
            "scheme": "tealblues"
        }
    }
}

const sortedEncoding = {
    "x": {
        "field": "Coverage",
        "type": "quantitative",
    },
    "y": {
        "field": "Module",
        "type": "nominal",
        "sort": "-x"
    },
    "color": {
        "field": "Coverage",
        "type": "quantitative",
        "scale": {
            "scheme": "tealblues"
        }
    }
}

export { unsortedEncoding, sortedEncoding }