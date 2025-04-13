package com.keyless.KeylessCampus.controller;

import com.keyless.KeylessCampus.model.ScanTable;
import com.keyless.KeylessCampus.service.DashService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DashController {

    private final DashService dashService;

    public DashController(DashService dashService) {
        this.dashService = dashService;
    }

    @GetMapping("/dashboard-data")
    public ResponseEntity<List<ScanTable>>  getDashData(){
        List<ScanTable> result = dashService.getData();
        return ResponseEntity.ok(result);
    }

}
