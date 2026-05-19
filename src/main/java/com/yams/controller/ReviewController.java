package com.yams.controller;

import com.yams.dto.ReviewRequest;
import com.yams.model.Review;
import com.yams.model.User;
import com.yams.repository.ReviewRepository;
import com.yams.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Review> getUserReview(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        Optional<Review> review = reviewRepository.findByUser(user);
        return review.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping
    public ResponseEntity<Review> saveOrUpdateReview(@RequestBody ReviewRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        Review review = reviewRepository.findByUser(user).orElse(new Review());
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);
        return ResponseEntity.ok(review);
    }
}
