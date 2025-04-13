package com.keyless.KeylessCampus.service;

import com.keyless.KeylessCampus.DAO.DoorRepository;
import com.keyless.KeylessCampus.DAO.DoorSchemaRepository;
import com.keyless.KeylessCampus.DAO.UserRepository;
import com.keyless.KeylessCampus.model.DoorSchema;
import com.keyless.KeylessCampus.model.DoorSystem;
import com.keyless.KeylessCampus.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    //using dependency injection
    private final UserRepository userRepository;
    private final DoorRepository doorRepository;
    private final DoorSchemaRepository doorSchemaRepository;

    public UserService(UserRepository userRepository, DoorRepository doorRepository,DoorSchemaRepository doorSchemaRepository) {
        this.doorRepository = doorRepository;
        this.userRepository = userRepository;
        this.doorSchemaRepository = doorSchemaRepository;
    }

    public String SignUp(String username, String password, String rfid,String serialID){
            User user =  new User(username,password,rfid);

            try{
                userRepository.save(user);
                DoorSystem doorSystem = new DoorSystem("Room "+serialID,serialID);
                doorRepository.save(doorSystem);

                DoorSchema doorSchema = new DoorSchema(serialID,rfid);
                doorSchemaRepository.save(doorSchema);

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
