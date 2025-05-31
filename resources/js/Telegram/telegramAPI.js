import apiRequest from "@/Pages/API/main";

// Menggunakan environment variable dari process.env
export const sendTelegramNotification = async (message) => {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    const url_master = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const params = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
    };

    try {
        const response = await apiRequest({
            url: url_master,
            method: "get",
            params: params // gunakan `params` untuk query string dalam GET request
        });

        if (response.status === 200) {
            console.log("Pesan berhasil dikirim ke Telegram.");
        }
    } catch (err) {
        console.error("Gagal mengirim pesan Telegram:", err);
    }
};
