package com.keyless.KeylessCampus.service;

import com.keyless.KeylessCampus.DAO.ScanTableRepository;
import com.keyless.KeylessCampus.model.ScanTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DashService {
    @Autowired
    private ScanTableRepository scanTableRepository;

    public List<ScanTable> getData(){
        Iterable<ScanTable> scanTables = scanTableRepository.findAll();
        List<ScanTable> result = new ArrayList<>();
        while(scanTables.iterator().hasNext()){
            result.add(scanTables.iterator().next());
        }


        return result;


    }

}
