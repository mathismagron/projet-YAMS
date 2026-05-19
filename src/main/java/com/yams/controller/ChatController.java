package com.yams.controller;

import com.yams.model.Message;
import com.yams.model.User;
import com.yams.model.AchievementType;
import com.yams.repository.MessageRepository;
import com.yams.repository.UserRepository;
import com.yams.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AchievementService achievementService;

    @GetMapping("/{gameId}")
    public List<Message> getMessages(@PathVariable Long gameId) {
        return messageRepository.findByGameIdOrderByTimestampAsc(gameId);
    }

    @PostMapping("/{gameId}")
    public Message sendMessage(@PathVariable Long gameId, @RequestBody Message message) {
        message.setGameId(gameId);
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }
        
        Optional<User> user = userRepository.findByUsername(message.getAuthorName());
        user.ifPresent(u -> achievementService.unlockAchievement(u, AchievementType.FIRST_MESSAGE));

        return messageRepository.save(message);
    }
}
