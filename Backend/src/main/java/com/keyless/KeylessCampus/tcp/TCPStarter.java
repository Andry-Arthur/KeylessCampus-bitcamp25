package com.keyless.KeylessCampus.tcp;

import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.ServerSocket;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class TCPStarter {

    private static final AtomicBoolean isListenerStarted = new AtomicBoolean(false);
    private ServerSocket serverSocket;

    @PostConstruct
    public void startDualPortTCP() {
        if (isListenerStarted.compareAndSet(false, true)) {
            try {
                serverSocket = new ServerSocket(DualPortTCP.PORT2);

                // Start the listener for PORT 4321
                new Thread(() -> DualPortTCP.startListenerForMessages(serverSocket)).start();

                // Start the persistent connection for PORT 1234
                new Thread(() -> DualPortTCP.startPersistentConnection(DualPortTCP.PORT1)).start();
            } catch (IOException e) {
                System.err.println("Failed to create ServerSocket on port " + DualPortTCP.PORT2 + ": " + e.getMessage());
            }
        }
    }

    public ServerSocket getServerSocket() {
        return serverSocket;
    }
}