package com.yams.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status; // WAITING, IN_PROGRESS, FINISHED
    
    @ManyToOne
    private User host;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Scorecard> scorecards = new ArrayList<>();

    @ElementCollection
    private List<Integer> dice = new ArrayList<>();

    private int rollCount = 0;
    
    private int currentPlayerIndex = 0;

    @Column(name = "is_private")
    private Boolean isPrivate = false;

    private String joinCode;

    public Game() {
        this.status = "WAITING";
        for (int i=0; i<5; i++) dice.add(1);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getHost() { return host; }
    public void setHost(User host) { this.host = host; }

    public List<Scorecard> getScorecards() { return scorecards; }
    public void setScorecards(List<Scorecard> scorecards) { this.scorecards = scorecards; }

    public List<Integer> getDice() { return dice; }
    public void setDice(List<Integer> dice) { this.dice = dice; }

    public int getRollCount() { return rollCount; }
    public void setRollCount(int rollCount) { this.rollCount = rollCount; }

    public int getCurrentPlayerIndex() { return currentPlayerIndex; }
    public void setCurrentPlayerIndex(int currentPlayerIndex) { this.currentPlayerIndex = currentPlayerIndex; }

    public boolean isPrivate() { return isPrivate != null ? isPrivate : false; }
    public void setPrivate(Boolean isPrivate) { this.isPrivate = isPrivate; }

    public String getJoinCode() { return joinCode; }
    public void setJoinCode(String joinCode) { this.joinCode = joinCode; }
}
