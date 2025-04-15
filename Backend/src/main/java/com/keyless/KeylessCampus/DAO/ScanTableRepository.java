package com.keyless.KeylessCampus.DAO;


import com.keyless.KeylessCampus.model.ScanTable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScanTableRepository extends CrudRepository<ScanTable, Long> {
}
