// import { getContext } from "../../extensions.js";
import { getContext } from "../../../../public/scripts/extensions.js";

const MODULE_NAME = 'silly-model-tester';

/**
 * Функция отправки тестовых сообщений
 * @param {string[]} messages - список сообщений для тестирования
 */
async function sendTestMessagesToModel(messages) {
    const context = getContext();

    if (!context || typeof context.sendMessageToModel !== 'function') {
        console.error("SillyTavern API недоступен или sendMessageToModel не является функцией.");
        return;
    }

    for (const message of messages) {
        try {
            console.log(`Отправка сообщения: ${message}`);
            await context.sendMessageToModel(message);  // Отправляем сообщение в модель
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка перед следующим сообщением
        } catch (error) {
            console.error(`Ошибка при отправке сообщения: ${error}`);
            break;
        }
    }
    console.log("Отправка всех тестовых сообщений завершена.");
}

// Экспортируем функцию для использования в HTML-шаблоне
window.sendTestMessagesToModel = sendTestMessagesToModel;
