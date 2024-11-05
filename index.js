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
    // Создаем настройки, если их еще нет
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

// Обработчик для кнопки отправки сообщения
function onSendTestMessage() {
    const message = $("#test_message").val().trim();
    if (message) {
        sendMessageToModel(message);
    } else {
        toastr.warning("Введите сообщение для отправки", "Предупреждение");
    }
}

// Инициализация расширения при загрузке
jQuery(async () => {
    // Загружаем HTML-шаблон для интерфейса
    const settingsHtml = await $.get(`${extensionFolderPath}/template.html`);

    // Добавляем HTML-шаблон в настройки расширений
    $("#extensions_settings").append(settingsHtml);

    // Назначаем обработчики событий
    $("#send_test_message").on("click", onSendTestMessage);

    // Загружаем сохраненные настройки
    loadSettings();
});