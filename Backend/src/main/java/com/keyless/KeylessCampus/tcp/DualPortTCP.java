package com.keyless.KeylessCampus.tcp;

import com.keyless.KeylessCampus.DAO.DoorRepository;
import com.keyless.KeylessCampus.DAO.ScanTableRepository;
import com.keyless.KeylessCampus.DAO.UserRepository;
import com.keyless.KeylessCampus.model.DoorSystem;
import com.keyless.KeylessCampus.model.ScanTable;
import com.keyless.KeylessCampus.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Component
public class DualPortTCP {

    static final int PORT1 = 1234; // Persistent connection
    public static final int PORT2 = 4321; // Message listener

    private static Socket persistentSocket;
    private static PrintWriter persistentWriter;

    private final UserRepository userRepository;
    private final DoorRepository doorRepository;
    private final ScanTableRepository scanTableRepository;

    @Autowired
    public DualPortTCP(UserRepository userRepository, DoorRepository doorRepository, ScanTableRepository scanTableRepository) {
        this.userRepository = userRepository;
        this.doorRepository = doorRepository;
        this.scanTableRepository = scanTableRepository;
    }

    // Listener for incoming messages on PORT 4321
    public void startListenerForMessages(ServerSocket serverSocket) {
        System.out.println("Listening for messages on port " + serverSocket.getLocalPort());

        while (true) {
            try (Socket clientSocket = serverSocket.accept();
                 BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                 PrintWriter clientWriter = new PrintWriter(persistentSocket.getOutputStream(), true)) {

                String rfid = in.readLine();
                System.out.println("Received RFID: " + rfid);

                if (rfid != null && !rfid.isEmpty()) {
                    User user = userRepository.findByRFID(rfid);

                    List<DoorSystem> doors = doorRepository.findAll();
                    DoorSystem door = doors.getFirst();

                    ScanTable scanEntry = new ScanTable();

                    if (doors.isEmpty()) {
                        scanEntry.setDoorSystem(door);
                    } else {
                        System.out.println("Door with ID 101 not found");
                    }

                    if (user != null) {
                        scanEntry.setUser(user);
                        scanEntry.setIsDenied(false);
                        scanTableRepository.save(scanEntry);

                        clientWriter.println("ON");
                        clientWriter.flush();
                        System.out.println("Sent 'ON' to client for user: " + user.getUsername());
                    } else {
                        scanEntry.setUser(null);
                        scanEntry.setIsDenied(true);
                        scanTableRepository.save(scanEntry);

                        clientWriter.println("DENIED");
                        clientWriter.flush();
                        System.out.println("Sent 'DENIED' to client for RFID: " + rfid);
                    }
                }
            } catch (IOException e) {
                System.err.println("Error handling client on port " + serverSocket.getLocalPort() + ": " + e.getMessage());
            } catch (Exception e) {
                System.err.println("Error processing RFID: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

    // Persistent connection handler for PORT 1234
    public static void startPersistentConnection(int listenPort) {
        while (true) {
            try (ServerSocket serverSocket = new ServerSocket(listenPort)) {
                System.out.println("Waiting for persistent connection on port " + listenPort);

                persistentSocket = serverSocket.accept();
                System.out.println("Persistent connection established on port " + listenPort);

                try (BufferedReader in = new BufferedReader(new InputStreamReader(persistentSocket.getInputStream()))) {
                    persistentWriter = new PrintWriter(persistentSocket.getOutputStream(), true);

                    while (true) {
                        String message = in.readLine();
                        if (message == null) {
                            break;
                        }
                        System.out.println("Persistent connection received: " + message);
                    }
                } catch (IOException e) {
                    System.err.println("Error in persistent connection: " + e.getMessage());
                } finally {
                    persistentSocket.close();
                    persistentWriter = null;
                    System.out.println("Persistent connection closed");
                }
            } catch (IOException e) {
                System.err.println("Could not establish persistent connection on port " + listenPort);
                e.printStackTrace();
            }

            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("Retry interrupted");
                break;
            }
        }
    }

    // Subroutine to get a single message from PORT 4321
    public static String getMessageFromPort(int listenPort) {
        try (ServerSocket serverSocket = new ServerSocket(listenPort)) {
            System.out.println("Waiting for a message on port " + listenPort);

            try (Socket clientSocket = serverSocket.accept();
                 BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()))) {

                String received = in.readLine();
                System.out.println("Received message: " + received);
                return received;
            }
        } catch (IOException e) {
            System.err.println("Error getting message from port " + listenPort + ": " + e.getMessage());
            return null;
        }
    }

    public static CompletableFuture<String> getMessageFromPortAsync(ServerSocket serverSocket) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                System.out.println("Waiting for a message on port " + serverSocket.getLocalPort());

                try (Socket clientSocket = serverSocket.accept();
                     BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()))) {

                    String received = in.readLine();
                    System.out.println("Received message: " + received);
                    return received;
                }
            } catch (IOException e) {
                System.err.println("Error getting message from port " + serverSocket.getLocalPort() + ": " + e.getMessage());
                return null;
            }
        });
    }
}