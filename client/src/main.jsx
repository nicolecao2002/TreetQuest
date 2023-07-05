import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'


// hooking with index.html, everything is render inside root div
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
