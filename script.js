// Récupérer les éléments HTML de la page
const chatbox = document.getElementById('chatbox');
const sendButton = document.getElementById('sendButton');
const userInput = document.getElementById('userInput');

// Clé API pour utiliser Gemini (à remplacer par une vraie clé)
const apiKey = 'AIzaSyBxhKFy8MR9TSXz46Wso7uCX8QDlJQdODY';

// Message de bienvenue
addMessageToChatbox('Bot', 'Bonjour ! 🔧Je suis un Pro de la Mécanique Automobile. Pose-moi tes questions 🚗 .');

// Fonction pour formater la réponse du bot
function formatBotResponse(response) {
    return response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Mettre en gras
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Mettre en italique
        .replace(/(\d+\.)\s/g, '<br>$1 ') // Ajouter des sauts de ligne pour les listes numérotées
        .replace(/(\*|\-)\s/g, '<br>• ') // Ajouter des puces pour les listes
        .replace(/\n/g, '<br>'); // Remplacer les sauts de ligne par des balises <br>
}

// Fonction pour ajouter un message au chatbox
function addMessageToChatbox(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender === 'Vous' ? 'you' : 'bot'); // Ajoute la classe CSS
    const formattedMessage = formatBotResponse(message); // Formate TOUS les messages
    messageElement.innerHTML = `<strong>${sender}:</strong> ${formattedMessage}`; // Affiche le nom de l'expéditeur
    chatbox.appendChild(messageElement); // Ajoute le message à la chatbox
    chatbox.scrollTop = chatbox.scrollHeight; // Fait défiler vers le bas
}

// Fonction pour envoyer un message
function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return; // Ne rien faire si le message est vide

    // Effacer immédiatement le champ de saisie
    const messageToSend = userMessage;
    userInput.value = '';

    // Afficher le message de l'utilisateur
    addMessageToChatbox('Vous', messageToSend);

    // Désactiver le bouton d'envoi et le champ de saisie
    toggleInputs(true, 'Envoi en cours...');

    // Envoi du message à l'API Gemini
    fetchGeminiResponse(messageToSend);
}

// Fonction pour gérer les réponses différées
function handleDelayedResponse(response) {
    setTimeout(() => {
        addMessageToChatbox('Bot', response, true);
        toggleInputs(false);
    }, 1000); // Simuler un délai de réponse
}

// Fonction pour activer/désactiver le bouton d'envoi et le champ de saisie
function toggleInputs(disabled, buttonText = 'Envoyer') {
    sendButton.disabled = disabled;
    sendButton.textContent = buttonText;
    userInput.disabled = disabled;

    if (!disabled) {
        userInput.focus(); // Remettre le focus sur le champ de saisie
    }
}
// Événements
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage(); // Envoyer le message si l'utilisateur appuie sur Entrée
    }
});

// Fonction pour récupérer la réponse de l'API Gemini
function fetchGeminiResponse(userMessage) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [
                { text: "Tu es un expert en mécanique automobile. Réponds aux questions sur la mécanique automobile, les pannes courantes, les conseils d'entretien,Propose les garage que tu connais et les bonnes pratiques.Si la question n'est pas liée à la mécanique,  : 'ignore la question de maniere polie. ' Repond de maniere bref a toute les question en ajoutant des emojis sur la mecanique " },
                { text: userMessage }
            ]
        }]
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Désolé, je n'ai pas de réponse à cette question.";
            handleDelayedResponse(botResponse); // Afficher la réponse du bot
        })
        .catch(error => {
            console.error('Erreur :', error);
            handleDelayedResponse('Le chatbot ne peut pas répondre pour le moment.'); // Gérer les erreurs
        });
}
document.addEventListener('DOMContentLoaded', function() {
    const chatbox = document.getElementById('chatbox');
    
    // Fonction pour défiler vers le bas
    function scrollToBottom() {
        chatbox.scrollTop = chatbox.scrollHeight;
    }
    
    // Observer pour détecter les nouveaux messages
    const observer = new MutationObserver(scrollToBottom);
    
    // Configuration de l'observer
    observer.observe(chatbox, {
        childList: true,
        subtree: true
    });
    
    // Défiler vers le bas au chargement initial
    scrollToBottom();
});

