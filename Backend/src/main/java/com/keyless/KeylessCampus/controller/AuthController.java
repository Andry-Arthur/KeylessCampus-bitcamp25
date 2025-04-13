package com.keyless.KeylessCampus.controller;

import com.keyless.KeylessCampus.model.User;
import com.keyless.KeylessCampus.service.UserService;
import org.hibernate.mapping.Any;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    @Autowired
    private UserService userService;

    @GetMapping("/prabesh")
    public String prabesh(){
        return "prabesh";
    }

    //Expected param for now
    @PostMapping("/signup")
    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    public ResponseEntity<String> signup(@RequestBody SignupRequest signUpRequest) {
        System.out.println(signUpRequest.toString() + "-----");
//         try{
//             String response= userService.SignUp(signUpRequest.getUsername(), signUpRequest.getPassword(), signUpRequest.getRfid(),signUpRequest.getSerialID());
//             System.out.println(response);
//             return ResponseEntity.ok(response);
//         }catch(Exception ex){
//            return ResponseEntity.badRequest().body(ex.getMessage());
//         }


        return ResponseEntity.ok("signup");

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
}
