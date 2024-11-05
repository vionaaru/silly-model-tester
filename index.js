import { eventSource, event_types, main_api } from '../../../../script.js';
import { renderExtensionTemplateAsync } from '../../../extensions.js';
import { POPUP_RESULT, POPUP_TYPE, Popup } from '../../../popup.js';

// Проверка на наличие необходимых событий в SillyTavern
if (!('GENERATE_AFTER_COMBINE_PROMPTS' in event_types) || !('CHAT_COMPLETION_PROMPT_READY' in event_types)) {
    toastr.error('Required event types not found. Update SillyTavern to the latest version.');
    throw new Error('Events not found.');
}

// Функция для проверки, является ли текущая модель Chat Completion
function isChatCompletion() {
    return main_api === 'openai';
}

// Логирование полученных ответов
const log = [];

// Функция для отправки тестового сообщения и записи ответа
async function sendTestMessage(message) {
    const response = await generateQuietPrompt(message);
    log.push({ message, response });
    console.log(`Сообщение: ${message}\nОтвет: ${response}\n\n`);
}

// Команда /test для запуска тестирования
function handleTestCommand() {
    const testMessages = [
        "Привет!",
        "Как дела?",
        "Расскажи анекдот.",
    ];

    testMessages.forEach(async (message) => {
        await sendTestMessage(message);
    });
}

// Регистрируем команду /test
import { SlashCommandParser, SlashCommand } from "../../slash-commands.js";
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "test",
    callback: handleTestCommand,
    helpString: `
        <div>
            Запускает автоматическое тестирование сообщений и логирует ответы.
        </div>
    `
}));

// Создание кнопки для управления инспектором
function addLaunchButton() {
    const launchButton = document.createElement('div');
    launchButton.id = 'sillyModelTesterButton';
    launchButton.classList.add('list-group-item', 'flex-container', 'flexGap5', 'interactable');
    launchButton.tabIndex = 0;
    launchButton.title = 'Запустить тестирование моделей';
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-vial';
    launchButton.appendChild(icon);
    const textSpan = document.createElement('span');
    textSpan.textContent = 'Запустить тестирование моделей';
    launchButton.appendChild(textSpan);

    const extensionsMenu = document.getElementById('extensionsMenu');
    if (!extensionsMenu) {
        throw new Error('Could not find the extensions menu');
    }

    extensionsMenu.appendChild(launchButton);
    launchButton.addEventListener('click', handleTestCommand);
}

// Инициализация расширения
(function init() {
    addLaunchButton();
    console.log("SillyModelTester initialized successfully");
})();
