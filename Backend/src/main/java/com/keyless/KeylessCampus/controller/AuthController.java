package com.keyless.KeylessCampus.controller;

import com.keyless.KeylessCampus.DAO.ScanTableRepository;
import com.keyless.KeylessCampus.model.ScanTable;
import com.keyless.KeylessCampus.model.User;
import com.keyless.KeylessCampus.service.UserService;
import org.hibernate.mapping.Any;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private ScanTableRepository scanTableRepository;


    //Expected param for now
    @PostMapping("/signup")
    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    public ResponseEntity<String> signup(@RequestBody SignupRequest signUpRequest) {

         try{
             String response= userService.SignUp(signUpRequest.getUsername(), signUpRequest.getPassword(), signUpRequest.getRfid(),signUpRequest.getSerialID());
             System.out.println(response);
             return ResponseEntity.ok(response);
         }catch(Exception ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
         }




    }

    //login controller
    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try{
            User response = userService.SignIn(loginRequest.getUsername(),loginRequest.getPassword());
            return ResponseEntity.ok(response);
        }catch(Exception ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }


    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @GetMapping("/logs")
    public ResponseEntity<?> getLogs(){
        Iterable<ScanTable> scanTableList = scanTableRepository.findAll();
        List<ScanTable> result = (List<ScanTable>) scanTableList;
        return ResponseEntity.ok(result);
    }

}
