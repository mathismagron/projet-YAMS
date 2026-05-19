package com.yams.model;

public enum AchievementType {
    FIRST_GAME("Jouer une partie (la première fois)"),
    WIN_FIRST_GAME("Gagner une partie"),
    LOSE_FIRST_GAME("Perdre une partie"),
    WIN_TEN_GAMES("Gagner 10 parties"),
    FIRST_MESSAGE("Envoyer un message dans le chat de partie"),
    ROLL_YAMS("Réaliser un YAMS au cours d'une partie");

    private final String description;

    AchievementType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
