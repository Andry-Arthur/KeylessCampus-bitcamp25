package com.keyless.KeylessCampus.controller;

import com.keyless.KeylessCampus.DAO.DoorSchemaRepository;
import com.keyless.KeylessCampus.DAO.UserRepository;
import com.keyless.KeylessCampus.model.DoorSchema;
import com.keyless.KeylessCampus.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
public class DoorSchemaController {

    @Autowired
    private DoorSchemaRepository doorSchemaRepository;

    @Autowired
    private UserRepository userRepository;

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @GetMapping("/doorschema")
    public ResponseEntity<List<DoorSchemaData>> getDoorSchema(){
        List<DoorSchema> result =  doorSchemaRepository.findAll();
        List<DoorSchemaData> finalResult = new ArrayList<>(0);
        for(DoorSchema doorSchema: result){
            User user = userRepository.findByRFID(doorSchema.getRfid());
            DoorSchemaData doorSchemaData = new DoorSchemaData();
            doorSchemaData.id = user.getId();
            doorSchemaData.RFID = doorSchema.getRfid();
            doorSchemaData.username = user.getUsername();
            finalResult.add(doorSchemaData);

        }

        System.out.println(finalResult.size());

        return ResponseEntity.ok(finalResult);
    }

}
