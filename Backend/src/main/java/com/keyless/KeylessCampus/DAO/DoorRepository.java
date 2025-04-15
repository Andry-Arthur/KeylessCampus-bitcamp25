package com.keyless.KeylessCampus.DAO;

import com.keyless.KeylessCampus.model.DoorSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.rmi.server.UID;

@Repository
public interface DoorRepository extends JpaRepository<DoorSystem, Long> {
    DoorSystem findBySerialId(String serialId);
}
