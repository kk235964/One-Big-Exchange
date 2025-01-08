import React from 'react'
import App from '../components/App'
import { useLocation } from 'react-router-dom';


function ConsolidatedBook() {
    const location = useLocation();
    const isLogedIn = location.isMatch ; 
  return (
    <div><App isLogedIn/></div>

  )
}

export default ConsolidatedBook