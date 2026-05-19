import { useState, useEffect } from 'react';
import axios from 'axios';
import GameBoard from './GameBoard';
import DirectChat from './DirectChat';

function Dashboard({ user, onLogout }) {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [userAchievements, setUserAchievements] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [activeChatFriend, setActiveChatFriend] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [showReviews, setShowReviews] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);
  const [myReview, setMyReview] = useState({ rating: 5, comment: "" });

  const ALL_ACHIEVEMENTS = [
    { type: 'FIRST_GAME', description: "Jouer une partie (la première fois)" },
    { type: 'WIN_FIRST_GAME', description: "Gagner une partie" },
    { type: 'LOSE_FIRST_GAME', description: "Perdre une partie" },
    { type: 'WIN_TEN_GAMES', description: "Gagner 10 parties" },
    { type: 'FIRST_MESSAGE', description: "Envoyer un message dans le chat de partie" },
    { type: 'ROLL_YAMS', description: "Réaliser un YAMS au cours d'une partie" }
  ];

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
      setShowAchievements(false);
      setShowFriends(false);
      setShowReviews(false);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique", error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await axios.get(`/api/achievements/user/${user.id}`);
      setUserAchievements(response.data);
      setShowAchievements(true);
      setShowHistory(false);
      setShowFriends(false);
      setShowReviews(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des succès", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`/api/friends/${user.id}`);
      setFriendsList(response.data);
      setShowFriends(true);
      setShowAchievements(false);
      setShowHistory(false);
      setShowReviews(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des amis", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const responseAll = await axios.get('/api/reviews');
      setReviewsList(responseAll.data);
      
      try {
        const responseMe = await axios.get(`/api/reviews/user/${user.id}`);
        if (responseMe.status === 200 && responseMe.data) {
          setMyReview(responseMe.data);
        }
      } catch (e) {
        // Pas encore d'avis
      }

      setShowReviews(true);
      setShowHistory(false);
      setShowAchievements(false);
      setShowFriends(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des avis", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews', {
        userId: user.id,
        rating: myReview.rating,
        comment: myReview.comment
      });
      fetchReviews(); // Refresh
      alert("Avis enregistré avec succès !");
    } catch (error) {
      alert("Erreur lors de l'enregistrement de l'avis.");
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

  if (showAchievements) {
    return (
      <div className="dashboard">
        <h2>Succès de {user.username}</h2>
        <button onClick={() => setShowAchievements(false)}>Retour au Tableau de bord</button>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px', padding: 0 }}>
          {ALL_ACHIEVEMENTS.map(ach => {
            const unlocked = userAchievements.find(ua => ua.type === ach.type);
            return (
              <li key={ach.type} style={{
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                listStyleType: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: unlocked ? "#e6ffe6" : "#f8f9fa",
                opacity: unlocked ? 1 : 0.6
              }}>
                <div>
                  <strong>{ach.description}</strong>
                  {unlocked && <div style={{ fontSize: "0.8em", color: "#666", marginTop: "5px" }}>
                    Débloqué le : {new Date(unlocked.unlockedAt).toLocaleDateString()}
                  </div>}
                </div>
                <div style={{ fontSize: "1.5rem" }}>
                  {unlocked ? "🏆" : "🔒"}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    );
  }

  if (showFriends) {
    return (
      <div className="dashboard">
        <h2>Amis de {user.username}</h2>
        <button onClick={() => setShowFriends(false)}>Retour au Tableau de bord</button>
        {friendsList.length === 0 ? (
          <p style={{ marginTop: '20px' }}>Vous n'avez pas encore d'amis. Ajoutez-en lors de vos parties !</p>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', padding: 0 }}>
            {friendsList.map(f => (
              <li key={f.id} style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", listStyleType: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{f.username}</strong>
                <button 
                  onClick={() => setActiveChatFriend(f)} 
                  style={{ backgroundColor: "#007bff", color: "white", padding: "5px 15px", border: "none", borderRadius: "4px" }}
                >
                  Envoyer un message
                </button>
              </li>
            ))}
          </ul>
        )}
        {activeChatFriend && (
          <DirectChat 
            user={user} 
            friend={activeChatFriend} 
            onClose={() => setActiveChatFriend(null)} 
          />
        )}
      </div>
    );
  }

  if (showReviews) {
    return (
      <div className="dashboard">
        <h2>Avis sur le jeu</h2>
        <button onClick={() => setShowReviews(false)}>Retour au Tableau de bord</button>
        
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
          <h3>Mon Avis</h3>
          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label>
              Note (0 à 5) : 
              <input 
                type="number" 
                min="0" max="5" 
                value={myReview.rating} 
                onChange={(e) => setMyReview({ ...myReview, rating: parseInt(e.target.value) })}
                style={{ marginLeft: '10px', width: '50px' }}
                required
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column' }}>
              Message :
              <textarea 
                rows="3" 
                value={myReview.comment} 
                onChange={(e) => setMyReview({ ...myReview, comment: e.target.value })}
                placeholder="Laissez un message..."
                style={{ marginTop: '5px', padding: '5px' }}
              />
            </label>
            <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', width: '150px' }}>
              Sauvegarder mon avis
            </button>
          </form>
        </div>

        <h3 style={{ marginTop: '30px' }}>Tous les avis</h3>
        {reviewsList.length === 0 ? (
          <p>Aucun avis pour le moment.</p>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: 0 }}>
            {reviewsList.map(r => (
              <li key={r.id} style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", listStyleType: "none" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>{r.user.username} {r.user.id === user.id && "(Moi)"}</strong>
                  <span style={{ color: '#f39c12', fontWeight: 'bold' }}>{'⭐'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <div>{r.comment || <em style={{ color: '#888' }}>Aucun commentaire</em>}</div>
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
        <button onClick={fetchAchievements} style={{ backgroundColor: "#ffc107", color: "black", border: "none", padding: "5px 10px", cursor: "pointer"}}>Mes succès</button>
        <button onClick={fetchFriends} style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "5px 10px", cursor: "pointer"}}>Mes amis</button>
        <button onClick={fetchReviews} style={{ backgroundColor: "#6f42c1", color: "white", border: "none", padding: "5px 10px", cursor: "pointer"}}>Avis & Notes</button>
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