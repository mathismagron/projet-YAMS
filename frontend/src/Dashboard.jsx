import { useState, useEffect } from 'react';
import axios from 'axios';
import GameBoard from './GameBoard';

function Dashboard({ user, onLogout }) {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  // Charger la liste des parties
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/games');
      setGames(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des parties", error);
    }
  };

  const handleCreateGame = async () => {
    try {
      const response = await axios.post(`/api/games/create?userId=${user.id}&isPrivate=${isPrivate}`);
      setCurrentGame(response.data);
    } catch (error) {
      console.error("Erreur lors de la création", error);
    }
  };

  const handleJoinPrivateGame = async () => {
    if (!joinCode) return;
    try {
      const response = await axios.post(`/api/games/join-private?userId=${user.id}&joinCode=${joinCode}`);
      setCurrentGame(response.data);
    } catch (error) {
      console.error("Erreur pour rejoindre avec le code", error);
      alert(error.response?.data || "Code invalide");
    }
  };

  const handleJoinGame = async (game) => {
    try {
      const response = await axios.post(`/api/games/${game.id}/join?userId=${user.id}`);
      setCurrentGame(response.data);
    } catch (error) {
      console.error("Erreur pour rejoindre", error);
      alert(error.response?.data || "Erreur pour rejoindre la partie");
    }
  };

  const handleViewGame = async (game) => {
    try {
      const response = await axios.get(`/api/games/${game.id}`);
      setCurrentGame(response.data);
    } catch (error) {
      console.error("Erreur pour charger la partie", error);
      alert(error.response?.data || "Erreur pour charger la partie");
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`/api/games/history/${user.id}`);
      setHistory(response.data);
      setShowHistory(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique", error);
    }
  };

  // Si on est dans une partie, on affiche le composant de jeu
  if (currentGame) {
    return <GameBoard user={user} initialGame={currentGame} onLeave={() => { setCurrentGame(null); fetchGames(); }} />;
  }

  if (showHistory) {
    return (
      <div className="dashboard">
        <h2>Historique de {user.username}</h2>
        <button onClick={() => setShowHistory(false)}>Retour au Tableau de bord</button>
        {history.length === 0 ? (
          <p>Vous n'avez joué aucune partie pour le moment.</p>
        ) : (
          <ul>
            {history.map(g => (
              <li key={g.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", listStyleType: "none" }}>
                <strong>Partie #{g.id}</strong> - Statut: {g.status}
                <button onClick={() => handleViewGame(g)} style={{marginLeft: "15px"}}>
                  Voir les scores
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Tableau de bord - Bienvenue {user.username}</h2>
        <button onClick={onLogout} style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>
          Se déconnecter
        </button>
      </div>
      
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <button onClick={handleCreateGame}>Créer une nouvelle partie</button>
        <label>
          <input 
            type="checkbox" 
            checked={isPrivate} 
            onChange={(e) => setIsPrivate(e.target.checked)} 
          /> 
          Privée
        </label>
        <button onClick={fetchGames}>Actualiser la liste</button>
        <button onClick={fetchHistory} style={{ backgroundColor: "#17a2b8", color: "white", border: "none", padding: "5px 10px", cursor: "pointer"}}>Mon historique</button>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input 
          type="text" 
          placeholder="Code privé" 
          value={joinCode} 
          onChange={(e) => setJoinCode(e.target.value)} 
        />
        <button onClick={handleJoinPrivateGame}>Rejoindre une partie privée</button>
      </div>

      <h3>Parties publiques disponibles :</h3>
      {games.length === 0 ? (
        <p>Aucune partie en cours.</p>
      ) : (
        <ul>
          {games.map(g => (
            <li key={g.id}>
              Partie #{g.id} (Créée par : {g.host ? g.host.username : 'Inconnu'} - {g.status})
              <button 
                  onClick={() => handleJoinGame(g)} 
                  style={{marginLeft: "15px"}}
                  disabled={g.status === 'FINISHED'}
              >
                  Rejoindre / Observer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;