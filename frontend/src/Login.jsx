import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    try {
      const response = await axios.post(endpoint, {
        username: username,
        password: password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("Joueur connecté :", response.data);
      onLoginSuccess(response.data);
    } catch (error) {
      console.error("Erreur d'authentification", error);
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data);
      } else {
        setErrorMsg("Une erreur est survenue.");
      }
    }
  };

  return (
    <div className="login-container" style={{ textAlign: "center", maxWidth: "400px", margin: "0 auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", marginTop: "50px", backgroundColor: "#f9f9f9" }}>
      <h2>{isRegistering ? "Créer un compte" : "Connexion au Yams"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Entrez votre pseudo"
          required 
          style={{ padding: "8px" }}
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Entrez votre mot de passe"
          required 
          style={{ padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          {isRegistering ? "S'inscrire" : "Se connecter"}
        </button>
      </form>
      {errorMsg && <p style={{color: 'red', marginTop: "10px"}}>{errorMsg}</p>}
      
      <div style={{ marginTop: "15px" }}>
        <button 
          onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}
          style={{ background: "none", border: "none", color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
        >
          {isRegistering ? "Déjà un compte ? Connectez-vous" : "Pas de compte ? Inscrivez-vous"}
        </button>
      </div>
    </div>
  );
}

export default Login;