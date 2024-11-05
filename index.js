// Импортируем необходимые функции из SillyTavern
import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

// Имя расширения и путь к папке
const extensionName = "silly-model-tester";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};

// Загрузка настроек расширения или инициализация по умолчанию
async function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }
}

// Отправка сообщения в модель и получение ответа
async function sendMessageToModel(message) {
    const context = getContext();
    const response = await context.chat.generateMessage({ prompt: message });
    // Отображаем ответ в интерфейсе
    toastr.info(`Ответ модели: ${response}`, "Модель ответила:");
}

// Обработчик для кнопки отправки сообщений
async function onSendTestMessages() {
    const messagesText = $("#test_messages").val().trim();
    if (!messagesText) {
        toastr.warning("Введите сообщения для отправки", "Предупреждение");
        return;
    }

    // Разделяем сообщения по тройному переводу строки
    const messages = messagesText.split(/\n{3}/).map(msg => msg.trim()).filter(msg => msg.length > 0);

    // Отправляем каждое сообщение в модель и обрабатываем ответы
    for (const message of messages) {
        await sendMessageToModel(message);
    }
}

// Инициализация расширения при загрузке
jQuery(async () => {
    const settingsHtml = await $.get(`${extensionFolderPath}/template.html`);
    $("#extensions_settings").append(settingsHtml);

    // Назначаем обработчик для кнопки отправки сообщений
    $("#send_test_messages").on("click", onSendTestMessages);

    loadSettings();
});
