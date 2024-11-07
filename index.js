import { generateRaw } from '../../../script.js'; // Импорт функции для генерации ответа

// Функция для отправки тестовых сообщений модели
async function sendTestMessages(messages) {
    const outputField = document.getElementById('response_output'); // Поле для вывода ответов
    outputField.value = ''; // Очистка поля перед новым тестом

    for (const message of messages) {
        try {
            const response = await generateRaw(message, "openai", false, false); // Настройки можно изменить под API
            outputField.value += `Вопрос: ${message}\nОтвет: ${response}\n\n`;
        } catch (error) {
            console.error(`Ошибка при отправке сообщения "${message}":`, error);
            outputField.value += `Ошибка при отправке сообщения: ${message}\n`;
        }
    }
}

// Подключение обработчика к кнопке отправки сообщений
document.getElementById('send_test_messages').addEventListener('click', () => {
    const messages = document.getElementById('test_messages').value.split('\n').filter(line => line.trim());
    sendTestMessages(messages);
});
