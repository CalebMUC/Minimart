import * as signalR from "@microsoft/signalr";

class SignalRService {
    constructor() {
        this.connection = null;
        this.isConnected = false; // Track connection state
    }

    // Initialize SignalR Connection
    async startConnection() {
        if (this.connection && this.isConnected) {
            console.log("⚠️ SignalR already connected.");
            return;
        }

        if (!this.connection) {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:44334/ActivityHub", {
                    withCredentials: true, // Ensure CORS credentials are included
                })
                .withAutomaticReconnect()
                .build();

            this.connection.onclose(() => {
                console.warn("🔴 SignalR Disconnected. Reconnecting...");
                this.isConnected = false;
            });

            this.connection.onreconnected(() => {
                console.log("🔄 SignalR Reconnected!");
                this.isConnected = true;
            });
        }

        try {
            await this.connection.start();
            this.isConnected = true;
            console.log("✅ SignalR Connected!");
        } catch (error) {
            console.error("❌ SignalR Connection Error:", error);
        }
    }

    // Subscribe to events (ensure event is only subscribed once)
    onNewUser(callback) {
        if (this.connection) {
            this.connection.off("ReceiveNewUser"); // Avoid duplicate listeners
            this.connection.on("ReceiveNewUser", callback);
        }
    }

    onNewOrder(callback) {
        if (this.connection) {
            this.connection.off("ReceiveNewOrder");
            this.connection.on("ReceiveNewOrder", callback);
        }
    }

    onNewMerchant(callback) {
        if (this.connection) {
            this.connection.off("ReceiveNewMerchant");
            this.connection.on("ReceiveNewMerchant", callback);
        }
    }

    // Stop Connection
    async stopConnection() {
        if (this.connection && this.isConnected) {
            await this.connection.stop();
            this.isConnected = false;
            console.log("🛑 SignalR Disconnected");
        }
    }
}

// Export as a singleton
const signalRService = new SignalRService();
export default signalRService;
