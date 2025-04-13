package com.keyless.KeylessCampus.DAO;

import com.keyless.KeylessCampus.model.DoorSchema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoorSchemaRepository extends JpaRepository<DoorSchema,Long> {

}
