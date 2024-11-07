import { getContext } from "../../extensions.js";
import { generateQuietPrompt } from "../../../script.js";

const context = getContext();

// Функция для отправки сообщения в модель
async function sendMessageToModel(message) {
    try {
        console.log("Отправка в модель:", message);
        // Используем generateQuietPrompt для отправки сообщения в модель и получения ответа
        const response = await generateQuietPrompt(message, false, false);
        console.log("Ответ от модели:", response);
        return response;
    } catch (error) {
        console.error("Ошибка при отправке в модель:", error);
    }
}

// Функция для обработки сообщений из текстового поля
async function onSendTestMessages() {
    const messagesText = document.getElementById("test_messages").value;
    const messages = messagesText.split(/\n{3,}/).map(msg => msg.trim()).filter(msg => msg.length > 0);

    console.log("Сообщения для отправки:", messages);

    for (const message of messages) {
        console.log("Отправка сообщения:", message);
        const response = await sendMessageToModel(message);
        if (response) {
            // Отображаем ответ в консоли или сохраняем его, если нужно
            console.log("Получен ответ:", response);
            // Вы можете добавить дополнительную обработку ответа, например, отображение в интерфейсе
        }
    }
}

// Добавляем обработчик для кнопки отправки
document.getElementById("send_test_messages").addEventListener("click", onSendTestMessages);
