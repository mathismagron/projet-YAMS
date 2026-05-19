package com.yams.repository;

import com.yams.model.Friendship;
import com.yams.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    
    @Query("SELECT f FROM Friendship f JOIN FETCH f.user1 JOIN FETCH f.user2 WHERE f.user1 = :user OR f.user2 = :user")
    List<Friendship> findByUser(User user);
    
    @Query("SELECT COUNT(f) > 0 FROM Friendship f WHERE (f.user1 = :user1 AND f.user2 = :user2) OR (f.user1 = :user2 AND f.user2 = :user1)")
    boolean existsByUsers(User user1, User user2);
}
