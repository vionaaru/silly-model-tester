import { getContext, extension_settings, renderExtensionTemplateAsync, eventSource, event_types } from '../../../script.js';

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

// Функция отправки сообщений
async function onSendTestMessages() {
    const context = getContext();
    const messages = $('#test_messages').val().split('\n\n\n'); // Сообщения разделены тремя переводами строки
    for (const message of messages) {
        try {
            console.log("Отправка в модель:", message);
            const response = await context.chat.generateQuietPrompt(message); // Замените этот метод, если он не работает
            console.log("Ответ от модели:", response);
        } catch (error) {
            console.error("Ошибка при отправке сообщения:", error);
        }
    }
}

// Инициализация расширения
jQuery(async function () {
    const settingsHtml = await renderExtensionTemplateAsync(MODULE_NAME, 'template');
    $('#extensions_settings').append(settingsHtml);
    loadSettings();
    setupListeners();

    // Привязка событий для обработки обновлений чата
    eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, onSendTestMessages);
});