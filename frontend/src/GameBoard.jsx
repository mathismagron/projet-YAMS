import { useState, useEffect } from 'react';
import axios from 'axios';
import GameChat from './GameChat';

const CATEGORIES = [
  { key: 'ONES', label: 'As (1)' },
  { key: 'TWOS', label: 'Deux (2)' },
  { key: 'THREES', label: 'Trois (3)' },
  { key: 'FOURS', label: 'Quatre (4)' },
  { key: 'FIVES', label: 'Cinq (5)' },
  { key: 'SIXES', label: 'Six (6)' },
  { key: 'BONUS', label: 'Bonus (si >= 63 aux 1-6)' },
  { key: 'THREE_OF_A_KIND', label: 'Brelan' },
  { key: 'FOUR_OF_A_KIND', label: 'Carré' },
  { key: 'FULL_HOUSE', label: 'Full' },
  { key: 'SMALL_STRAIGHT', label: 'Petite Suite' },
  { key: 'LARGE_STRAIGHT', label: 'Grande Suite' },
  { key: 'YAMS', label: 'Yams' },
  { key: 'CHANCE', label: 'Chance' }
];

// Fonction pour calculer les points possibles d'une main
const calculatePotentialScore = (categoryKey, dice) => {
  if (!dice || dice.length !== 5) return 0;
  
  const sumOf = (val) => dice.filter(d => d === val).reduce((a, b) => a + b, 0);
  const sumAll = () => dice.reduce((a, b) => a + b, 0);
  
  const counts = {};
  dice.forEach(d => counts[d] = (counts[d] || 0) + 1);
  const hasCount = (n) => Object.values(counts).some(c => c >= n);
  const isFullHouse = () => (Object.values(counts).includes(3) && Object.values(counts).includes(2)) || Object.values(counts).includes(5);
  
  const dist = [...new Set(dice)].sort().join('');
  const isSmallStraight = () => dist.includes('1234') || dist.includes('2345') || dist.includes('3456');
  const isLargeStraight = () => dist === '12345' || dist === '23456';

  switch (categoryKey) {
    case 'ONES': return sumOf(1);
    case 'TWOS': return sumOf(2);
    case 'THREES': return sumOf(3);
    case 'FOURS': return sumOf(4);
    case 'FIVES': return sumOf(5);
    case 'SIXES': return sumOf(6);
    case 'THREE_OF_A_KIND': return hasCount(3) ? sumAll() : 0;
    case 'FOUR_OF_A_KIND': return hasCount(4) ? sumAll() : 0;
    case 'FULL_HOUSE': return isFullHouse() ? 25 : 0;
    case 'SMALL_STRAIGHT': return isSmallStraight() ? 30 : 0;
    case 'LARGE_STRAIGHT': return isLargeStraight() ? 40 : 0;
    case 'YAMS': return hasCount(5) ? 50 : 0;
    case 'CHANCE': return sumAll();
    default: return 0;
  }
};

function GameBoard({ user, initialGame, onLeave }) {
  const [game, setGame] = useState(initialGame);
  const [keepDice, setKeepDice] = useState([false, false, false, false, false]);

  // Actualisation automatique toutes les 2 secondes
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshGame();
    }, 2000);
    return () => clearInterval(intervalId); // nettoyage quand le composant est démonté
  }, [game.id]);

  const refreshGame = async () => {
    try {
      const response = await axios.get(`/api/games/${game.id}`);
      setGame(response.data);
    } catch (error) {
      console.error("Erreur de MAJ", error);
    }
  };

  const handleStartGame = async () => {
    try {
      const response = await axios.post(`/api/games/${game.id}/start?userId=${user.id}`);
      setGame(response.data);
    } catch (error) {
      alert(error.response?.data || "Erreur de démarrage");
    }
  };

  const isMyTurn = game.status === 'IN_PROGRESS' 
        && game.scorecards[game.currentPlayerIndex]?.player?.id === user.id;

  const handleRollDice = async () => {
    if (!isMyTurn) return;
    if (game.rollCount >= 3) {
      alert("Tu as déjà lancé 3 fois les dés ! C'est le moment d'enregistrer ton score.");
      return;
    }
    
    try {
      const response = await axios.post(`/api/games/${game.id}/roll?userId=${user.id}`, keepDice);
      setGame(response.data);
    } catch (error) {
      alert(error.response?.data || "Erreur lors du lancer");
    }
  };

  const toggleKeepDie = (index) => {
    if (!isMyTurn || game.rollCount === 0) return;

    const newKeepDice = [...keepDice];
    newKeepDice[index] = !newKeepDice[index];
    setKeepDice(newKeepDice);
  };

  const submitScore = async (categoryKey) => {
    if (!isMyTurn) return;
    if (game.rollCount === 0) {
      alert("Lancez les dés avant d'enregistrer un score !");
      return;
    }
    try {
      const response = await axios.post(`/api/games/${game.id}/score?userId=${user.id}&category=${categoryKey}`);
      setGame(response.data);
      setKeepDice([false, false, false, false, false]);
    } catch (error) {
      alert(error.response?.data || "Erreur lors de l'enregistrement du score");
    }
  };

  const isHost = game.host?.id === user.id;

  return (
    <div className="game-board" style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
      
      {/* Zone de gauche : Les dés et boutons */}
      <div style={{ flex: 1 }}>
        <h2>Partie #{game.id} - Statut : {game.status}</h2>
        <button onClick={onLeave}>Quitter la partie</button>

        {game.status === 'WAITING' && (
          <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff3cd", border: "1px solid #ffeeba" }}>
            <h3>Salle d'attente ({game.scorecards.length}/4 joueurs)</h3>
            <ul>
              {game.scorecards.map(sc => <li key={sc.player.id}>{sc.player.username}</li>)}
            </ul>
            {isHost ? (
              <button onClick={handleStartGame} disabled={game.scorecards.length === 0}>
                Démarrer la partie maintenant
              </button>
            ) : (
              <p>En attente de l'hôte pour démarrer la partie...</p>
            )}
          </div>
        )}

        {game.status === 'FINISHED' && (
          <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#d4edda", border: "1px solid #c3e6cb", color: "#155724" }}>
            <h3>🎉 La partie est terminée ! 🎉</h3>
            <p>Regardez la grille des scores pour voir le vainqueur !</p>
          </div>
        )}

        {game.status === 'IN_PROGRESS' && (
          <div style={{ marginTop: "20px", padding: "15px", border: "1px solid black" }}>
            <h3>
              {isMyTurn ? "🎲 C'est à TOI de jouer !" : `C'est le tour de ${game.scorecards[game.currentPlayerIndex]?.player?.username}`}
            </h3>
            <p>Lancer {game.rollCount}/3</p>
            
            <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
              {game.dice.map((dieValue, index) => (
                <div 
                  key={index} 
                  onClick={() => toggleKeepDie(index)}
                  style={{
                    width: "50px", height: "50px", fontSize: "24px", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: keepDice[index] ? "3px solid red" : "1px solid black",
                    backgroundColor: keepDice[index] ? "#ffebeb" : "white",
                    cursor: (isMyTurn && game.rollCount > 0) ? "pointer" : "default",
                    opacity: isMyTurn ? 1 : 0.5
                  }}>
                  {game.rollCount === 0 ? "?" : dieValue}
                </div>
              ))}
            </div>
            
            <button 
                onClick={handleRollDice} 
                disabled={!isMyTurn || game.rollCount >= 3}
                style={{ padding: "10px 20px", fontSize: "16px", cursor: (!isMyTurn || game.rollCount >= 3) ? "not-allowed" : "pointer" }}
            >
              {game.rollCount === 0 ? "Lancer les dés !" : "Relancer les dés non-gardés"}
            </button>
          </div>
        )}

        {/* Espace Chat en bas à gauche */}
        {<GameChat gameId={game.id} user={user} />}
      </div>

      {/* Zone de droite : Grille MULTIJOUEURS */}
      <div style={{ padding: "15px", border: "1px solid gray", backgroundColor: "#f9f9f9", overflowX: "auto" }}>
        <h3>Feuille de scores</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "300px" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "2px solid black", padding: "5px", textAlign: "left" }}>Figure</th>
              {game.scorecards.map((sc, index) => (
                <th key={sc.player.id} style={{ borderBottom: "2px solid black", padding: "5px", textAlign: "center" }}>
                  {sc.player.username}
                  {game.status === 'IN_PROGRESS' && index === game.currentPlayerIndex ? " 🎲" : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map(cat => {
              const potentialScore = calculatePotentialScore(cat.key, game.dice);
              const isValidFigure = potentialScore > 0 || cat.key === 'CHANCE';
              
              return (
                <tr key={cat.key}>
                  <td style={{ padding: "8px 5px", borderBottom: "1px solid #ddd" }}>{cat.label}</td>
                  {game.scorecards.map(sc => {
                    if (cat.key === 'BONUS') {
                      const upperKeys = ['ONES', 'TWOS', 'THREES', 'FOURS', 'FIVES', 'SIXES'];
                      const upperScore = upperKeys.reduce((sum, key) => sum + (sc.scores[key] || 0), 0);
                      const allUpperFilled = upperKeys.every(key => sc.scores[key] !== undefined);
                      
                      let bonusPoints = "-";
                      if (upperScore >= 63) bonusPoints = 35;
                      else if (allUpperFilled) bonusPoints = 0;
                      
                      return (
                        <td key={sc.player.id} style={{ padding: "8px 5px", borderBottom: "1px solid #ddd", textAlign: "center", backgroundColor: "#f0f8ff" }}>
                          <strong>{bonusPoints} {allUpperFilled || upperScore >= 63 ? `(Total: ${upperScore})` : `(${upperScore}/63)`}</strong>
                        </td>
                      );
                    }

                    const hasPlayed = sc.scores[cat.key] !== undefined;
                    const isMe = sc.player.id === user.id;

                    return (
                      <td key={sc.player.id} style={{ padding: "8px 5px", borderBottom: "1px solid #ddd", textAlign: "center" }}>
                        {hasPlayed ? (
                          <strong>{sc.scores[cat.key]}</strong>
                        ) : (
                          (isMe && isMyTurn && game.rollCount > 0) ? (
                            isValidFigure ? (
                              <button 
                                onClick={() => submitScore(cat.key)} 
                                style={{ padding: "2px 6px", fontSize: "11px", cursor: "pointer", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "3px" }}
                              >
                                Valider (+{potentialScore})
                              </button>
                            ) : (
                              game.rollCount >= 3 ? (
                                <button 
                                  onClick={() => submitScore(cat.key)} 
                                  style={{ padding: "2px 6px", fontSize: "11px", cursor: "pointer", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "3px" }}
                                  title="Si vous n'avez pas cette figure après 3 lancers, vous devez barrer une case."
                                >
                                  Barrer (0)
                                </button>
                              ) : (
                                <button disabled style={{ padding: "2px 6px", fontSize: "11px", cursor: "not-allowed", opacity: 0.5 }}>
                                  Non valide
                                </button>
                              )
                            )
                          ) : (
                            <span style={{ color: "#aaa" }}>-</span>
                          )
                        )}
                      </td>
                    );
                  })}
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <th style={{ paddingTop: "15px", textAlign: "left" }}>TOTAL</th>
              {game.scorecards.map(sc => (
                <th key={sc.player.id} style={{ paddingTop: "15px", textAlign: "center", fontSize: "18px" }}>
                  {sc.totalScore}
                </th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
}

export default GameBoard;