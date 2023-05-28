import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {ThemeModeContext} from "./Components/ThemeModeContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeContext>    
      <App />
    </ThemeModeContext>
  </React.StrictMode>,
)
