package com.yams.controller;

import com.yams.model.Message;
import com.yams.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private MessageRepository messageRepository;

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
        return messageRepository.save(message);
    }
}
