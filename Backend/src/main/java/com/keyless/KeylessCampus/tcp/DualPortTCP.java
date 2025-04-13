package com.keyless.KeylessCampus.tcp;

import java.io.*;
import java.net.*;

public class DualPortTCP {

    static final int PORT1 = 1234; // Persistent connection
    static final int PORT2 = 4321; // Message listener

    private static Socket persistentSocket;
    private static PrintWriter persistentWriter;

    public static void main(String[] args) {
        // Start the listener for PORT 4321
        new Thread(() -> startListenerForMessages(PORT2)).start();

        // Start the persistent connection for PORT 1234
        new Thread(() -> startPersistentConnection(PORT1)).start();
    }

    // Listener for incoming messages on PORT 4321
    public static void startListenerForMessages(int listenPort) {
        try (ServerSocket serverSocket = new ServerSocket(listenPort)) {
            System.out.println("Listening for messages on port " + listenPort);

            while (true) {
                try (Socket clientSocket = serverSocket.accept();
                     BufferedReader in = new BufferedReader(
                             new InputStreamReader(clientSocket.getInputStream()))) {

                    String received = in.readLine();
                    System.out.println("Received message on port " + listenPort + ": " + received);

                    // Send "ON" to the persistent connection if it exists
                    if (persistentWriter != null) {
                        persistentWriter.println("ON");
                        System.out.println("Sent 'ON' to persistent connection on port " + PORT1);
                    } else {
                        System.err.println("No persistent connection available to send 'ON'");
                    }
                } catch (IOException e) {
                    System.err.println("Error handling client on port " + listenPort + ": " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("Could not listen on port " + listenPort);
            e.printStackTrace();
        }
    }

    // Persistent connection handler for PORT 1234
    public static void startPersistentConnection(int listenPort) {
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
    }
}
