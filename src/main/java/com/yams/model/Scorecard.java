package com.yams.model;

import jakarta.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
public class Scorecard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User player;

    @ElementCollection
    @MapKeyColumn(name="category")
    @Column(name="score")
    @CollectionTable(name="scorecard_scores", joinColumns=@JoinColumn(name="scorecard_id"))
    private Map<String, Integer> scores = new HashMap<>();

    private int totalScore = 0;

    public Scorecard() {}

    public Scorecard(User player) {
        this.player = player;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getPlayer() { return player; }
    public void setPlayer(User player) { this.player = player; }

    public Map<String, Integer> getScores() { return scores; }
    public void setScores(Map<String, Integer> scores) { this.scores = scores; }

    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
}
