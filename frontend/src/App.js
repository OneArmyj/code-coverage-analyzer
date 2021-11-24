import './App.css';
import axios from "axios";
import Viz from "./vegalite"
import React from 'react'

const App = () => {

    const onClickHandler = () => {
        axios.get("http://localhost:5000/product")
            .then(res => {
                console.log(res.data)
            })
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    Code Coverage Visualization
                </h1>

            </header>
            <div className="App-body">
                <Viz />
            </div>
        </div>
    );
}

export default App;
