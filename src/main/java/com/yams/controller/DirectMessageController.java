package com.yams.controller;

import com.yams.model.DirectMessage;
import com.yams.model.User;
import com.yams.repository.DirectMessageRepository;
import com.yams.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class DirectMessageController {

    @Autowired
    private DirectMessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/history")
    public List<DirectMessage> getHistory(@RequestParam Long userId1, @RequestParam Long userId2) {
        User user1 = userRepository.findById(userId1).orElseThrow();
        User user2 = userRepository.findById(userId2).orElseThrow();
        return messageRepository.findChatHistory(user1, user2);
    }

    @PostMapping("/send")
    public DirectMessage sendMessage(@RequestBody Map<String, Object> payload) {
        Long senderId = Long.parseLong(payload.get("senderId").toString());
        Long receiverId = Long.parseLong(payload.get("receiverId").toString());
        String content = payload.get("content").toString();

        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();

        DirectMessage msg = new DirectMessage(sender, receiver, content);
        return messageRepository.save(msg);
    }
}
