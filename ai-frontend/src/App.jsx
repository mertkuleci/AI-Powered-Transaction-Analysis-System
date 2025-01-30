import React from 'react'
import UploadPage from './UploadPage'
import MerchantForm from './MerchantForm'
import PatternForm from './PatternForm'
import logo from './assets/logo.png'

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* HEADER / LOGO SECTION */}
        <div className="flex items-center mb-4">
          {/* Logo */}
          <img 
            src={logo} 
            alt="App Logo" 
            className="w-16 h-16 object-cover rounded-md mr-4" 
          />
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800">
            fin AI
          </h1>
        </div>

        {/* Short Description */}
        <p className="text-gray-600 mb-8">
          AI-powered transaction analysis system for merchant name normalization 
          and recurring pattern detection.
        </p>

        {/* Main Content */}
        <UploadPage />
        <MerchantForm />
        <PatternForm />
      </div>
    </div>
  )
}

export default App
