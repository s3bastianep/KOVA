import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/styles/landing-base.css'
import '@/styles/landing-nav.css'
import '@/styles/landing-wave-home.css'
import '@/styles/landing-wave-inner.css'
import '@/styles/landing-home-plain.css'
/* Premium must load after plain so /para-empresas dark hero wins the cascade. */
import '@/styles/landing-home-premium.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
