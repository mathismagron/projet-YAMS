import { useEffect, useState } from 'react'
import axios from 'axios'
import Login from './Login' // AJOUTER CET IMPORT

import Dashboard from './Dashboard'

function App() {
  const [user, setUser] = useState(null) // Ajouter un état pour le joueur connecté

  // Fonction appelée quand le Login réussit
  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <div>
      <h1>Projet Yams - INP ENSEEIHT</h1>
      
      {/* Si personne n'est connecté, afficher le Login, sinon afficher le Dashboard entier */}
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App