import { getContext, extension_settings, renderExtensionTemplateAsync } from '../../../script.js';

const MODULE_NAME = 'silly-model-tester';

// Инициализация настроек
const defaultSettings = {
    messagesToSend: "", // Поле для ввода сообщений
};

// Функция загрузки настроек
function loadSettings() {
    if (Object.keys(extension_settings[MODULE_NAME]).length === 0) {
        Object.assign(extension_settings[MODULE_NAME], defaultSettings);
    }
}

// Привязка обработчиков событий интерфейса
function setupListeners() {
    $('#send_test_messages').on('click', onSendTestMessages);
}

// Функция для отправки сообщения в модель
async function sendMessageToModel(message) {
    const context = getContext();

    // Проверяем, существует ли context.chat и доступен ли метод send
    if (!context || !context.chat || typeof context.chat.send !== 'function') {
        console.error("Метод отправки сообщений не найден.");
        return;
    }

    try {
        console.log("Отправка в модель:", message);

        // Используем метод send, если он существует
        const response = await context.chat.send(message);
        console.log("Ответ от модели:", response);
    } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
    }
}

// Функция отправки всех сообщений из текстового поля
async function onSendTestMessages() {
    const messages = $('#test_messages').val().split('\n\n\n'); // Сообщения разделены тремя переводами строки
    for (const message of messages) {
        await sendMessageToModel(message);
    }
}

// Инициализация расширения
jQuery(async function () {
    const settingsHtml = await renderExtensionTemplateAsync(MODULE_NAME, 'template');
    $('#extensions_settings').append(settingsHtml);
    loadSettings();
    setupListeners();
});
