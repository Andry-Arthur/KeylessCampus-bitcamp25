package com.keyless.KeylessCampus.DAO;

import com.keyless.KeylessCampus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.rmi.server.UID;

public interface UserRepository extends JpaRepository<User, UID> {
    User findByUsername(String username);
}
