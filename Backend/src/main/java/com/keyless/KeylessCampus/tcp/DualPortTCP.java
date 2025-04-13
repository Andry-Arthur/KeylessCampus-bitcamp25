package com.keyless.KeylessCampus.tcp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.CompletableFuture;
import java.io.PrintWriter;

public class DualPortTCP {


    static final int PORT1 = 1234; // Persistent connection
    public static final int PORT2 =  4321; // Message listener

    private static Socket persistentSocket;
    private static PrintWriter persistentWriter;

    // Listener for incoming messages on PORT 4321
    public static void startListenerForMessages(ServerSocket serverSocket) {
        System.out.println("Listening for messages on port " + serverSocket.getLocalPort());

        while (true) {
            try (Socket clientSocket = serverSocket.accept();
                 BufferedReader in = new BufferedReader(
                         new InputStreamReader(clientSocket.getInputStream()))) {

                String received = in.readLine();
                System.out.println("Received message on port " + serverSocket.getLocalPort() + ": " + received);

                // Send "ON" to the persistent connection if it exists
                if (persistentWriter != null) {
                    persistentWriter.println("ON");
                    System.out.println("Sent 'ON' to persistent connection on port " + PORT1);
                } else {
                    System.err.println("No persistent connection available to send 'ON'");
                }
            } catch (IOException e) {
                System.err.println("Error handling client on port " + serverSocket.getLocalPort() + ": " + e.getMessage());
            }
        }
    }

    // Persistent connection handler for PORT 1234
    public static void startPersistentConnection(int listenPort) {
        while (true) { // Keep retrying indefinitely
            try (ServerSocket serverSocket = new ServerSocket(listenPort)) {
                System.out.println("Waiting for persistent connection on port " + listenPort);

                persistentSocket = serverSocket.accept();
                System.out.println("Persistent connection established on port " + listenPort);

                try (BufferedReader in = new BufferedReader(
                        new InputStreamReader(persistentSocket.getInputStream()))) {
                    persistentWriter = new PrintWriter(persistentSocket.getOutputStream(), true);

                    // Keep the connection alive
                    while (true) {
                        String message = in.readLine();
                        if (message == null) {
                            break; // Client disconnected
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

            // Wait before retrying
            try {
                Thread.sleep(5000); // Retry every 5 seconds
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

            // Accept a connection and read the message
            try (Socket clientSocket = serverSocket.accept();
                 BufferedReader in = new BufferedReader(
                         new InputStreamReader(clientSocket.getInputStream()))) {

                String received = in.readLine();
                System.out.println("Received message: " + received);

                // Return the received message
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

                // Accept a connection and read the message
                try (Socket clientSocket = serverSocket.accept();
                     BufferedReader in = new BufferedReader(
                             new InputStreamReader(clientSocket.getInputStream()))) {

                    String received = in.readLine();
                    System.out.println("Received message: " + received);

                    // Return the received message
                    return received;
                }
            } catch (IOException e) {
                System.err.println("Error getting message from port " + serverSocket.getLocalPort() + ": " + e.getMessage());
                return null;
            }
        });
    }
}