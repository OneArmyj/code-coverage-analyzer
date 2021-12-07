import axios from "axios";
import React from 'react'
import HomePage from './views/pages/homePage';

const App = () => {

    const onClickHandler = () => {
        axios.get("http://localhost:5000/product")
            .then(res => {
                console.log(res.data)
            })
    }

    return (
        <>
            <HomePage />
        </>
    );
}

export default App;
