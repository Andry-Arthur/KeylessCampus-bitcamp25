package com.keyless.KeylessCampus.controller;

import com.keyless.KeylessCampus.model.User;
import com.keyless.KeylessCampus.service.UserService;
import org.hibernate.mapping.Any;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @Autowired
    private UserService userService;

    //Expected param for now
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestParam String fname, @RequestParam String username, @RequestParam String password, @RequestParam String rfid) {
         try{
             String response= userService.SignUp(fname,username,password,rfid);
             return ResponseEntity.ok(response);
         }catch(Exception ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
         }

    }

    //login controller
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        try{
            User response = userService.SignIn(username,password);
            return ResponseEntity.ok(response);
        }catch(Exception ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
