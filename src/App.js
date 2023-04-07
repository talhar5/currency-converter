import { useEffect, useState } from 'react';
import './App.css';

function App() { 
  const [currencyData, setCurrencyData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("AED")
  const [amount, setAmount] = useState(1);
  const [isUpperChanged, setIsUpperChanged] = useState(true);
  const [multiplier, setMultiplier] = useState(1);

  // fetching data on the very start 
  useEffect(() => {
    fetch("https://api.currencyapi.com/v3/latest?apikey=V9o0b2yP2jfOnvukAixciEZq0ndu0epkVIxL3kz9").then(res => res.json()).then((data) => {
      setCurrencyData(data)
      setIsLoading(false)
    }).catch(error =>{
      setIsError(true);
      setIsLoading(false);
      console.log("Error Message: " + error.message);
    })
  }, [])


  let currencyNames;
  if (!isLoading) {
    currencyNames = Object.keys(currencyData.data).map(item => {
      return <option key={item}>{item}</option>
    })
  }

  useEffect(() => {
    if (currencyData === undefined) return
    let multiplier = getMultiplier(fromCurrency, toCurrency, currencyData)
    setMultiplier(multiplier);
  }, [toCurrency, fromCurrency, currencyData])

  // onChange handlers 
  function handleFromCurrency(e) {
    setFromCurrency(e.target.value);
  } 
  function handleToCurrency(e) {
    setToCurrency(e.target.value);
  }
  function handleToAmount(e) {
    setAmount(e.target.value);
    setIsUpperChanged(false);
  }
  function handleFromAmount(e) {
    setAmount(e.target.value);
    setIsUpperChanged(true);
  }
  let fromValue, toValue;
  if (isUpperChanged) {
    fromValue = amount;
    toValue = (amount * multiplier).toFixed(4);
  } else {
    fromValue = (amount / multiplier).toFixed(4);
    toValue = amount
  }

  if (isLoading) return <div className="loading">loading...</div>;
  if (isError) return <div>We are really sorry, There is some error. Check Console</div>
  return (
    <>
      <h1>Currency Converter</h1>
      <input value={fromValue} onChange={handleFromAmount} className='input' type="number" />
      <select value={fromCurrency} onChange={handleFromCurrency}>
        {currencyNames}
      </select>
      <div className='equal'>=</div>
      <input value={toValue} onChange={handleToAmount} className='input' type="number" />
      <select value={toCurrency} onChange={handleToCurrency}>
        {currencyNames}
      </select>
    </>
  );
}

export default App;

function getMultiplier(fromCurrency, toCurrency, data) {
  return data.data[toCurrency].value / data.data[fromCurrency].value;
}