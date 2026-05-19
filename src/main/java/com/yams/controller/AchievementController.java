package com.yams.controller;

import com.yams.model.Achievement;
import com.yams.service.AchievementService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping("/user/{userId}")
    public List<Achievement> getUserAchievements(@PathVariable Long userId) {
        return achievementService.getUserAchievements(userId);
    }
}
