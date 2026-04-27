import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { askQuestion } from './index.js'; // Using local function call for RAG

// Initialize the WhatsApp client with LocalAuth to save session locally
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "rag-bot" // Helps separate multiple sessions if needed
    }),
    puppeteer: {
        headless: true,
        // Crucial arguments for running Chromium smoothly on various OS environments (especially Linux)
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows, remove if Windows execution fails
            '--disable-gpu'
        ],
    }
});

/**
 * Event: qr
 * Triggered when a QR code is received from WhatsApp Web.
 * We render it in the terminal so the user can scan it.
 */
client.on('qr', (qr) => {
    console.log('SCAN THIS QR CODE TO LOGIN:');
    qrcode.generate(qr, { small: true });
});

/**
 * Event: ready
 * Triggered when the client is authenticated and ready to receive/send messages.
 */
client.on('ready', () => {
    console.log('✅ WhatsApp Client is ready and connected!');
});

/**
 * Event: authenticated
 * Triggered when session saved properly.
 */
client.on('authenticated', () => {
    console.log('🔐 WhatsApp Authenticated securely. Session saved.');
});

/**
 * Event: auth_failure
 * Triggered on Auth failure.
 */
client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed. Message:', msg);
});

/**
 * Event: disconnected
 * Triggered when client logs out or gets disconnected.
 */
client.on('disconnected', (reason) => {
    console.log('⚠️ WhatsApp Client was disconnected. Reason:', reason);
    console.log('🔄 Attempting to reconnect...');
    client.initialize(); // Auto-reconnect
});

/**
 * Event: message
 * Triggered every time a new message comes in.
 */
client.on('message', async (message) => {
    console.log(`📩 New Message from ${message.from}: ${message.body}`);

    // If you want to respond to ALL messages, remove the `if` block below.
    // If you want to trigger ONLY via a command like "!ask", keep it.
    // For this example, we'll respond to everything.

    // Ignore updates from Status/Stories
    if (message.from === 'status@broadcast') return;

    try {
        const question = message.body.trim();

        if (!question) return;

        // Send a typing indicator or intermediate response (Reaction or text)
        await message.react('🤖'); // Reacts with a bot emoji
        // OR: await message.reply("Thinking...");

        // Pass it to local function (Option B)
        console.log(`🧠 Asking RAG for: "${question}"`);
        const answer = await askQuestion(question);

        // Reply back to user
        await message.reply(answer);
        console.log(`✅ Replied successfully.`);

    } catch (error) {
        console.error("❌ Error processing WhatsApp message:", error);
        await message.reply("⚠️ Sorry, I encountered an error while processing your request to the RAG backend.");
    }
});

export const startWhatsAppBot = () => {
    console.log('🚀 Initializing WhatsApp Bot...');
    client.initialize();
};
