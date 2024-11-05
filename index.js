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
    console.log("Отправка в модель:", message);

    try {
        const response = await context.chat.generateMessage({ prompt: message });
        console.log("Ответ от модели:", response);
        toastr.info(`Ответ модели: ${response}`, "Модель ответила:");
    } catch (error) {
        console.error("Ошибка при отправке в модель:", error);
        toastr.error("Ошибка при отправке сообщения", "Ошибка");
    }
}

// Обработчик для кнопки отправки сообщений
async function onSendTestMessages() {
    console.log("Кнопка отправки сообщений нажата");

    const messagesText = $("#test_messages").val().trim();
    if (!messagesText) {
        toastr.warning("Введите сообщения для отправки", "Предупреждение");
        return;
    }

    // Разделяем сообщения по тройному переводу строки
    const messages = messagesText.split(/\n{3}/).map(msg => msg.trim()).filter(msg => msg.length > 0);

    console.log("Сообщения для отправки:", messages);

    // Отправляем каждое сообщение в модель и обрабатываем ответы
    for (const message of messages) {
        console.log("Отправка сообщения:", message);
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
