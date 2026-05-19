package com.yams.controller;

import com.yams.model.Friendship;
import com.yams.model.User;
import com.yams.repository.FriendshipRepository;
import com.yams.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/friends")
public class FriendshipController {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public List<User> getFriends(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        return friendshipRepository.findByUser(user).stream()
                .map(f -> f.getUser1().getId().equals(userId) ? f.getUser2() : f.getUser1())
                .collect(Collectors.toList());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addFriend(@RequestParam Long userId1, @RequestParam Long userId2) {
        User user1 = userRepository.findById(userId1).orElseThrow();
        User user2 = userRepository.findById(userId2).orElseThrow();

        if (userId1.equals(userId2)) {
            return ResponseEntity.badRequest().body("Vous ne pouvez pas vous ajouter vous-même");
        }

        if (friendshipRepository.existsByUsers(user1, user2)) {
            return ResponseEntity.badRequest().body("Déjà amis");
        }

        Friendship friendship = new Friendship(user1, user2);
        friendshipRepository.save(friendship);
        return ResponseEntity.ok("Ami ajouté avec succès");
    }
}
