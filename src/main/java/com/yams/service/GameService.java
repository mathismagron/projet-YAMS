package com.yams.service;

import com.yams.model.Game;
import com.yams.model.Scorecard;
import com.yams.model.User;
import com.yams.repository.GameRepository;
import com.yams.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final Random random = new Random();

    public GameService(GameRepository gameRepository, UserRepository userRepository) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    public List<Game> getWaitingGames() {
        return gameRepository.findAll(); // Plus tard on filtrera sur status
    }

    public List<Game> getGamesHistoryForUser(Long userId) {
        return gameRepository.findGamesByUserId(userId);
    }

    @Transactional
    public Game createGame(Long userId) {
        User host = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        
        Game game = new Game();
        game.setHost(host);
        
        Scorecard scorecard = new Scorecard(host);
        game.getScorecards().add(scorecard);
        
        return gameRepository.save(game);
    }

    public Game getGame(Long id) {
        return gameRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partie introuvable"));
    }

    @Transactional
    public Game joinGame(Long gameId, Long userId) {
        Game game = getGame(gameId);
        if (!"WAITING".equals(game.getStatus())) {
            throw new IllegalStateException("La partie a déjà commencé ou est terminée.");
        }
        if (game.getScorecards().size() >= 4) {
            throw new IllegalStateException("La partie est pleine (max 4 joueurs).");
        }
        boolean alreadyIn = game.getScorecards().stream()
                .anyMatch(sc -> sc.getPlayer().getId().equals(userId));
        
        if (!alreadyIn) {
            User player = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
            game.getScorecards().add(new Scorecard(player));
        }
        return gameRepository.save(game);
    }

    @Transactional
    public Game startGame(Long gameId, Long userId) {
        Game game = getGame(gameId);
        if (!game.getHost().getId().equals(userId)) {
            throw new IllegalStateException("Seul l'hôte peut démarrer la partie.");
        }
        game.setStatus("IN_PROGRESS");
        game.setCurrentPlayerIndex(0);
        return gameRepository.save(game);
    }

    @Transactional
    public Game rollDice(Long gameId, Long userId, List<Boolean> keepDice) {
        Game game = getGame(gameId);
        
        if (!"IN_PROGRESS".equals(game.getStatus())) {
            throw new IllegalStateException("La partie n'est pas en cours.");
        }
        
        Scorecard currentSc = game.getScorecards().get(game.getCurrentPlayerIndex());
        if (!currentSc.getPlayer().getId().equals(userId)) {
            throw new IllegalStateException("Ce n'est pas ton tour !");
        }

        if (game.getRollCount() >= 3) {
            throw new IllegalStateException("Maximum de 3 lancers atteint.");
        }

        List<Integer> currentDice = game.getDice();
        for (int i = 0; i < 5; i++) {
            if (keepDice == null || keepDice.size() < 5 || !keepDice.get(i)) {
                currentDice.set(i, random.nextInt(6) + 1);
            }
        }
        
        game.setRollCount(game.getRollCount() + 1);
        return gameRepository.save(game);
    }

    @Transactional
    public Game submitScore(Long gameId, Long userId, String category) {
        Game game = getGame(gameId);
        
        if (!"IN_PROGRESS".equals(game.getStatus())) {
            throw new IllegalStateException("La partie n'est pas en cours.");
        }
        
        Scorecard currentSc = game.getScorecards().get(game.getCurrentPlayerIndex());
        if (!currentSc.getPlayer().getId().equals(userId)) {
            throw new IllegalStateException("Ce n'est pas ton tour !");
        }

        if (currentSc.getScores().containsKey(category)) {
            throw new IllegalStateException("Catégorie déjà jouée !");
        }

        if (game.getRollCount() == 0) {
            throw new IllegalStateException("Vous devez lancer les dés au moins une fois !");
        }

        int score = ScoreCalculator.calculateScore(category, game.getDice());
        
        // Vérification que la figure est bien présente (le score doit être > 0) !
        // Si le joueur a atteint 3 lancers, il a le droit de "barrer" la case pour 0 point s'il est coincé.
        if (score == 0 && !"CHANCE".equals(category) && game.getRollCount() < 3) {
            throw new IllegalStateException("Cette figure n'est pas présente dans tes dés ! Tu dois utiliser tes 3 lancers pour pouvoir barrer une case.");
        }
        
        currentSc.getScores().put(category, score);
        
        // Recalcul du total
        int total = currentSc.getScores().values().stream().mapToInt(Integer::intValue).sum();
        
        // Addition du bonus
        int upperScore = 0;
        String[] upperCategories = {"ONES", "TWOS", "THREES", "FOURS", "FIVES", "SIXES"};
        for (String cat : upperCategories) {
            upperScore += currentSc.getScores().getOrDefault(cat, 0);
        }
        if (upperScore >= 63) {
            total += 35;
        }
        
        currentSc.setTotalScore(total);

        // Reset pour le tour suivant
        game.setRollCount(0);
        game.getDice().clear();
        for (int i = 0; i < 5; i++) {
            game.getDice().add(1);
        }
        
        // C'est au joueur suivant :
        game.setCurrentPlayerIndex((game.getCurrentPlayerIndex() + 1) % game.getScorecards().size());
        
        // Vérifier si la partie est terminée (tous les joueurs ont rempli les 13 catégories)
        boolean allFinished = game.getScorecards().stream()
                .allMatch(sc -> sc.getScores().size() == 13);
        if (allFinished) {
            game.setStatus("FINISHED");
        }
        
        return gameRepository.save(game);
    }
}
