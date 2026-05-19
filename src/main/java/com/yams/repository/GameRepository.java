package com.yams.repository;

import com.yams.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    @Query("SELECT DISTINCT g FROM Game g JOIN g.scorecards s WHERE s.player.id = :userId")
    List<Game> findGamesByUserId(@Param("userId") Long userId);

    Optional<Game> findByJoinCode(String joinCode);
}
