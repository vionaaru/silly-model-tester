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

    // Обновляем UI с текущими настройками
    $("#example_setting").prop("checked", extension_settings[extensionName].example_setting).trigger("input");
}

// Обработчик изменения настроек в интерфейсе
function onExampleInput(event) {
    const value = Boolean($(event.target).prop("checked"));
    extension_settings[extensionName].example_setting = value;
    saveSettingsDebounced();
}

// Обработчик нажатия кнопки
function onButtonClick() {
    toastr.info(
        `The checkbox is ${extension_settings[extensionName].example_setting ? "checked" : "not checked"}`,
        "A popup appeared because you clicked the button!"
    );
}

// Инициализация расширения при загрузке
jQuery(async () => {
    // Загружаем HTML-шаблон для интерфейса
    const settingsHtml = await $.get(`${extensionFolderPath}/template.html`);

    // Добавляем HTML-шаблон в настройки расширений
    $("#extensions_settings").append(settingsHtml);

    // Назначаем обработчики событий
    $("#my_button").on("click", onButtonClick);
    $("#example_setting").on("input", onExampleInput);

    // Загружаем сохраненные настройки
    loadSettings();
});

