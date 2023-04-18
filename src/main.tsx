import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // just to check "purity"
  <React.StrictMode>
    <App />
    <App />
    <App />
    <App />
    <App />
    <App />
    <App />
    <App />
    <App />
    <App />
    <App />
  </React.StrictMode>,
)
