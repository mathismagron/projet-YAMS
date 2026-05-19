package com.yams.controller;

import com.yams.model.Game;
import com.yams.service.GameService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:5173")
public class GameController {
    
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public List<Game> getGames() {
        return gameService.getWaitingGames();
    }

    @GetMapping("/history/{userId}")
    public List<Game> getGameHistory(@PathVariable Long userId) {
        return gameService.getGamesHistoryForUser(userId);
    }

    @PostMapping("/create")
    public Game createGame(@RequestParam Long userId, @RequestParam(required = false, defaultValue = "false") boolean isPrivate) {
        return gameService.createGame(userId, isPrivate);
    }

    @GetMapping("/{id}")
    public Game getGame(@PathVariable Long id) {
        return gameService.getGame(id);
    }

    @PostMapping("/{id}/join")
    public Game joinGame(@PathVariable Long id, @RequestParam Long userId, @RequestParam(required = false) String joinCode) {
        return gameService.joinGame(id, userId, joinCode);
    }

    @PostMapping("/join-private")
    public Game joinGameByCode(@RequestParam String joinCode, @RequestParam Long userId) {
        return gameService.joinGameByCode(joinCode, userId);
    }

    @PostMapping("/{id}/start")
    public Game startGame(@PathVariable Long id, @RequestParam Long userId) {
        return gameService.startGame(id, userId);
    }

    @PostMapping("/{id}/roll")
    public Game rollDice(@PathVariable Long id, @RequestParam Long userId, @RequestBody(required = false) List<Boolean> keepDice) {
        return gameService.rollDice(id, userId, keepDice);
    }

    @PostMapping("/{id}/score")
    public Game submitScore(@PathVariable Long id, @RequestParam Long userId, @RequestParam String category) {
        return gameService.submitScore(id, userId, category);
    }
}
