import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      // Appel à API SpringBoot
      const response = await axios.post('/api/auth/login', {
        username: username,
        password: password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("Joueur connecté :", response.data);
      onLoginSuccess(response.data);
    } catch (error) {
      console.error("Erreur de connexion", error);
      if (error.response && error.response.status === 401) {
        setErrorMsg("Mot de passe incorrect !");
      } else {
        setErrorMsg("Une erreur est survenue lors de la connexion.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion au Yams</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Entrez votre pseudo"
          required 
        />
        <br />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Entrez votre mot de passe"
          required 
        />
        <br />
        <button type="submit">Jouer</button>
      </form>
      {errorMsg && <p style={{color: 'red'}}>{errorMsg}</p>}
    </div>
  );
}

export default Login;