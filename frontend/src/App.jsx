import { useEffect, useState } from 'react'
import axios from 'axios'
import Login from './Login' // AJOUTER CET IMPORT

import Dashboard from './Dashboard'

function App() {
  const [message, setMessage] = useState("Connexion au serveur SpringBoot...")
  const [user, setUser] = useState(null) // Ajouter un état pour le joueur connecté

  useEffect(() => {
    axios.get('/api/hello')
      .then(res => setMessage(res.data))
      .catch(err => setMessage("Erreur : Le serveur SpringBoot ne répond pas !"))
  }, [])

  // Fonction appelée quand le Login réussit
  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  return (
    <div>
      <h1>Projet Yams - INP ENSEEIHT</h1>
      <p>Statut du serveur : {message}</p>
      
      {/* Si personne n'est connecté, afficher le Login, sinon afficher le Dashboard entier */}
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  )
}

export default App