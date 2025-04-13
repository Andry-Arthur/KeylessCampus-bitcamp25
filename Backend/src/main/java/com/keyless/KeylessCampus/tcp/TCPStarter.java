package com.keyless.KeylessCampus.tcp;

import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class TCPStarter {

    @PostConstruct
    public void startDualPortTCP() {
        // Start the listener for messages on PORT2
        new Thread(() -> DualPortTCP.startListenerForMessages(DualPortTCP.PORT2)).start();

        // Start the persistent connection on PORT1
        new Thread(() -> DualPortTCP.startPersistentConnection(DualPortTCP.PORT1)).start();
    }
}