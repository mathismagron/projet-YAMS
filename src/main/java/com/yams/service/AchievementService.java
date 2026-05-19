package com.yams.service;

import com.yams.model.Achievement;
import com.yams.model.AchievementType;
import com.yams.model.Game;
import com.yams.model.Scorecard;
import com.yams.model.User;
import com.yams.repository.AchievementRepository;
import com.yams.repository.GameRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final GameRepository gameRepository;

    public AchievementService(AchievementRepository achievementRepository, GameRepository gameRepository) {
        this.achievementRepository = achievementRepository;
        this.gameRepository = gameRepository;
    }

    @Transactional
    public void unlockAchievement(User user, AchievementType type) {
        if (!achievementRepository.existsByUserIdAndType(user.getId(), type)) {
            Achievement achievement = new Achievement(user, type);
            achievementRepository.save(achievement);
        }
    }

    @Transactional
    public void checkWinTenGames(User user) {
        if (achievementRepository.existsByUserIdAndType(user.getId(), AchievementType.WIN_TEN_GAMES)) {
            return;
        }
        
        List<Game> games = gameRepository.findGamesByUserId(user.getId());
        long winCount = 0;
        for (Game g : games) {
            if ("FINISHED".equals(g.getStatus())) {
                int maxScore = g.getScorecards().stream().mapToInt(Scorecard::getTotalScore).max().orElse(0);
                for (Scorecard sc : g.getScorecards()) {
                    if (sc.getPlayer().getId().equals(user.getId()) && sc.getTotalScore() == maxScore) {
                        winCount++;
                        break;
                    }
                }
            }
        }
        
        if (winCount >= 10) {
            unlockAchievement(user, AchievementType.WIN_TEN_GAMES);
        }
    }

    public List<Achievement> getUserAchievements(Long userId) {
        return achievementRepository.findByUserId(userId);
    }
}
