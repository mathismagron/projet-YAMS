import { useState, useEffect } from 'react';
import axios from 'axios';
import GameBoard from './GameBoard';

function Dashboard({ user }) {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);

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
      const response = await axios.post(`/api/games/create?userId=${user.id}`);
      setCurrentGame(response.data);
    } catch (error) {
      console.error("Erreur lors de la création", error);
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

  // Si on est dans une partie, on affiche le composant de jeu
  if (currentGame) {
    return <GameBoard user={user} initialGame={currentGame} onLeave={() => setCurrentGame(null)} />;
  }

  return (
    <div className="dashboard">
      <h2>Tableau de bord - Bienvenue {user.username}</h2>
      
      <button onClick={handleCreateGame}>Créer une nouvelle partie</button>
      <button onClick={fetchGames} style={{marginLeft: "10px"}}>Actualiser la liste</button>

      <h3>Parties disponibles :</h3>
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