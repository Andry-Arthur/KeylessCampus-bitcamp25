package com.keyless.KeylessCampus.service;

import com.keyless.KeylessCampus.DAO.UserRepository;
import com.keyless.KeylessCampus.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    //using dependency injection
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String SignUp(String fname,String username, String password, String rfid){
            User user =  new User(fname,username,password,rfid);
            try{
                userRepository.save(user);
                return "User Created";
            }catch(Exception ex){
                throw new Error("Error while saving user");
            }


    }

    public User SignIn(String username, String password){
        User user  = userRepository.findByUsername(username);
        if(user == null){
            throw new Error("User not Found");
        }else{
            if(user.getPassword().equals(password)){
                return user;
            }else{
                throw new Error("Wrong password");
            }

        }
    }
}
