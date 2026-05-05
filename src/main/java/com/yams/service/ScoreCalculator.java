package com.yams.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class ScoreCalculator {

    public static int calculateScore(String category, List<Integer> dice) {
        switch (category) {
            case "ONES": return sumOf(1, dice);
            case "TWOS": return sumOf(2, dice);
            case "THREES": return sumOf(3, dice);
            case "FOURS": return sumOf(4, dice);
            case "FIVES": return sumOf(5, dice);
            case "SIXES": return sumOf(6, dice);
            case "THREE_OF_A_KIND": return hasCount(3, dice) ? sumAll(dice) : 0;
            case "FOUR_OF_A_KIND": return hasCount(4, dice) ? sumAll(dice) : 0;
            case "FULL_HOUSE": return isFullHouse(dice) ? 25 : 0;
            case "SMALL_STRAIGHT": return isSmallStraight(dice) ? 30 : 0;
            case "LARGE_STRAIGHT": return isLargeStraight(dice) ? 40 : 0;
            case "YAMS": return hasCount(5, dice) ? 50 : 0;
            case "CHANCE": return sumAll(dice);
            default: return 0;
        }
    }

    private static int sumOf(int value, List<Integer> dice) {
        return dice.stream().filter(d -> d == value).mapToInt(Integer::intValue).sum();
    }

    private static int sumAll(List<Integer> dice) {
        return dice.stream().mapToInt(Integer::intValue).sum();
    }

    private static boolean hasCount(int count, List<Integer> dice) {
        Map<Integer, Long> counts = dice.stream().collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        return counts.values().stream().anyMatch(c -> c >= count);
    }

    private static boolean isFullHouse(List<Integer> dice) {
        Map<Integer, Long> counts = dice.stream().collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        return (counts.containsValue(3L) && counts.containsValue(2L)) || counts.containsValue(5L); // Yams can act as full house
    }

    private static boolean isSmallStraight(List<Integer> dice) {
        List<Integer> dist = dice.stream().distinct().sorted().collect(Collectors.toList());
        if (dist.size() < 4) return false;
        String s = dist.stream().map(String::valueOf).collect(Collectors.joining(""));
        return s.contains("1234") || s.contains("2345") || s.contains("3456");
    }

    private static boolean isLargeStraight(List<Integer> dice) {
        List<Integer> dist = dice.stream().distinct().sorted().collect(Collectors.toList());
        if (dist.size() < 5) return false;
        String s = dist.stream().map(String::valueOf).collect(Collectors.joining(""));
        return s.equals("12345") || s.equals("23456");
    }
}