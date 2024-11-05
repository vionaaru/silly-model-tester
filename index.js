import { getContext } from "../../extensions.js";
import { eventSource, event_types } from "../../../script.js";

// Получаем контекст SillyTavern
const context = getContext();
const log = [];

// Функция для отправки тестового сообщения и получения ответа
async function sendTestMessage(message) {
    const response = await context.chat.generateMessage({ prompt: message });
    log.push({ message, response });
    console.log(`Сообщение: ${message}\nОтвет: ${response}\n\n`);
}

// Команда /test для начала тестирования
function handleTestCommand() {
    const testMessages = [
        "Привет!",
        "Как дела?",
        "Расскажи анекдот.",
        // Добавьте другие сообщения для тестирования
    ];

    testMessages.forEach(async (message) => {
        await sendTestMessage(message);
    });
}

// Слушаем события
eventSource.on(event_types.MESSAGE_RECEIVED, (data) => {
    console.log("Сообщение получено:", data.message);
});

eventSource.on(event_types.MESSAGE_SENT, (data) => {
    console.log("Сообщение отправлено:", data.message);
});

// Регистрируем команду /test
import { SlashCommandParser } from "../../slash-commands.js";
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "test",
    callback: handleTestCommand,
    helpString: `
        <div>
            Запускает автоматическое тестирование сообщений и логирует ответы.
        </div>
    `
}));