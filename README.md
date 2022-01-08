# FastFetch

Fast Fetch for Reactjs

## Install

$ npm install fast_fetch_react
## Usage 
```javascript
import FastFetch from "fast_fetch_react"

import React from "react";
 
function Categories() {

    const [loading, error, categories] = FastFetch("https://fakestoreapi.com/products/categories", null, 60 * 60 * 1000);//1H
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong...</p>;
    if (!categories)
        return '';
    return (
        <div className="App">
            <header className="App-header">
                <p>Categories:</p>
                <ul>
                    {categories ? categories.map(c => <li>{c}</li>) : ''}
                </ul>
            </header>
        </div>
    );
}

export default Categories;
```