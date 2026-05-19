package com.yams.service;

import com.yams.model.User;
import com.yams.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Logique d'identification : 
     * Si l'utilisateur existe, on vérifie le mot de passe.
     * Sinon, on le crée automatiquement.
     * (Note: en production, il faudrait hacher le mot de passe avant de le stocker !)
     */
    @Transactional
    public User login(String username, String password) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Le pseudo ne peut pas être vide.");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Le mot de passe ne peut pas être vide.");
        }

        Optional<User> optUser = userRepository.findByUsername(username);
        
        if (optUser.isPresent()) {
            User existingUser = optUser.get();
            if (existingUser.getPassword().equals(password)) {
                return existingUser;
            } else {
                throw new IllegalArgumentException("Mot de passe incorrect.");
            }
        } else {
            throw new IllegalArgumentException("Utilisateur non trouvé.");
        }
    }

    @Transactional
    public User register(String username, String password) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Le pseudo ne peut pas être vide.");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Le mot de passe ne peut pas être vide.");
        }

        Optional<User> optUser = userRepository.findByUsername(username);
        if (optUser.isPresent()) {
            throw new IllegalArgumentException("Le pseudo est déjà pris.");
        }

        User newUser = new User(username, password);
        return userRepository.save(newUser);
    }
}