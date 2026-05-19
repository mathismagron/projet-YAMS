package com.yams.repository;

import com.yams.model.Achievement;
import com.yams.model.AchievementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUserId(Long userId);
    boolean existsByUserIdAndType(Long userId, AchievementType type);
    long countByUserIdAndType(Long userId, AchievementType type);
}
