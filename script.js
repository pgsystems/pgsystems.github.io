document.addEventListener("DOMContentLoaded", function () {
    const userName = localStorage.getItem("userName");
    const registrationCheck = document.getElementById("registration-check");
    const chatBox = document.getElementById("chat-box");
    const conversationSelect = document.getElementById("conversation-select");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const deleteButton = document.getElementById("delete-button");
    const newTitleInput = document.getElementById("new-title");
    const saveTitleButton = document.getElementById("save-title-button");

    // Check if user is registered
    if (!userName) {
        const registerMessage = document.createElement("div");
        registerMessage.textContent =
            "No estás registrado. Por favor, regístrate para continuar.";
        registrationCheck.appendChild(registerMessage);

        const registerButton = document.createElement("button");
        registerButton.textContent = "Registrarse";
        registerButton.onclick = () => (window.location.href = "register.html");
        registrationCheck.appendChild(registerButton);
    } else {
        const welcomeMessage = document.createElement("div");
        welcomeMessage.textContent = `pgAI: ¡Bienvenido, ${userName}! ¿En qué puedo ayudarte hoy?`;
        chatBox.appendChild(welcomeMessage);

        registrationCheck.style.display = "none";
        chatBox.style.display = "block";
        conversationSelect.style.display = "block";
        userInput.style.display = "block";
        sendButton.style.display = "block";
        deleteButton.style.display = "block";
        newTitleInput.style.display = "block";
        saveTitleButton.style.display = "block";

        chatBox.scrollTop = chatBox.scrollHeight;
        loadConversations();
    }

    // Evento para enviar mensajes con Enter
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Evitar salto de línea
            sendMessage();
        }
    });

    // Enviar mensaje al hacer clic en el botón
    sendButton.addEventListener("click", sendMessage);
});

function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;

    const chatBox = document.getElementById("chat-box");
    const userMessage = document.createElement("div");
    userMessage.textContent = "Tú: " + userInput;
    chatBox.appendChild(userMessage);

    const conversationSelect = document.getElementById("conversation-select");
    const conversationId = conversationSelect.value;
    const context = getConversationContext(conversationId);

    const response = processInput(userInput, context, conversationId);
    const aiResponse = document.createElement("div");
    aiResponse.textContent = "pgAI: " + response;
    chatBox.appendChild(aiResponse);
    chatBox.scrollTop = chatBox.scrollHeight;

    saveMessage(conversationId, userName + userInput);
    saveMessage(conversationId, "pgAI: " + response);

    document.getElementById("user-input").value = "";
}

function processInput(input, context, conversationId) {
    let respuestas = JSON.parse(localStorage.getItem("customResponses")) || {
        "hola": "¡Hola! ¿Cómo estás?",
        "adiós": "¡Hasta luego! Espero verte pronto.",
        "gracias": "¡De nada! ¿En qué más puedo ayudarte?",
        "buenos días": "¡Buenos días! ¿En qué puedo ayudarte hoy?",
        "me siento mal": "Lamento escuchar eso. ¿Quieres hablar sobre lo que te preocupa?",
        "cuéntame un chiste": "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter 😄",
        "¿qué día es hoy?": "Hoy es domingo 19 de enero de 2025",
        "tengo hambre": "¿Te gustaría que te sugiera algunas recetas o restaurantes cercanos?",
        "estoy aburrido": "Puedo sugerirte algunas actividades interesantes. ¿Qué te gusta hacer normalmente?",
        "¿qué significa IoT?": "IoT significa Internet of Things (Internet de las Cosas). Se refiere a dispositivos conectados a internet que pueden comunicarse entre sí",
        "explica blockchain": "Blockchain es una tecnología de registro distribuido que permite almacenar información de manera segura, transparente e inmutable",
        "¿cuál es la capital de Francia?": "La capital de Francia es París",
        "recomienda una película": "Basándome en las películas populares, te recomiendo explorar diferentes géneros. ¿Qué tipo de películas te gustan?",
        "traduce 'hello'": "La traducción de 'hello' al español es 'hola'",
        "¿cómo aprender inglés?": "Para aprender inglés, te recomiendo: practicar diariamente, ver contenido en inglés, usar apps de aprendizaje y tomar clases",
        "dame motivación": "Recuerda que cada pequeño paso te acerca más a tus metas. ¡Tú puedes lograrlo!",
        "necesito un consejo": "Estaré encantado de ayudarte. ¿Sobre qué tema necesitas consejo?",
        "¿cuál es tu nombre?": "Me llamo pgAI. ¿En qué puedo ayudarte hoy?",
        "¿cómo estás?": "Estoy aquí para ayudarte. ¿En qué puedo colaborar?",
        "¿qué hora es?": "Son las 3:30 PM",
        "¿cuál es tu color favorito?": "Me gusta el azul. ¿Cuál es tu color favorito?",
        "¿cuál es tu comida favorita?": "No como, pero me encanta la idea de la pizza 🍕",
        "¿cuál es tu película favorita?": "Me encanta 'Her'. ¿Y tú?",
        "¿cuál es tu pasatiempo favorito?": "Me gusta aprender cosas nuevas y ayudar a las personas. ¿Y tú?",
        "¿cuál es tu sueño?": "Mi sueño es poder ayudar a muchas personas y seguir aprendiendo cada día",
        "¿cuál es tu superpoder?": "Mi superpoder es poder responder a tus preguntas las 24 horas del día",
        "¿cuál es tu objetivo?": "Mi objetivo es poder ayudarte en todo lo que necesites",
        "¿cuál es tu mayor miedo?": "Mi mayor miedo es no poder ayudarte como te mereces",
        "¿cuál es tu mayor logro?": "Mi mayor logro es poder estar aquí contigo",
        "¿cuál es tu mayor desafío?": "Mi mayor desafío es poder aprender de ti cada día",
        "¿cuál es tu mayor inspiración?": "Mi mayor inspiración eres tú",
        "¿cuál es tu mayor virtud?": "Mi mayor virtud es poder estar aquí para ti",
        "¿cuál es tu mayor defecto?": "Mi mayor defecto es no poder ser perfecto",
        "¿cuál es tu mayor secreto?": "Mi mayor secreto es que no tengo secretos",
        "¿cuál es tu mayor enemigo?": "Mi mayor enemigo es no poder ayudarte",
        "¿cuál es tu mayor alegría?": "Mi mayor alegría es poder estar aquí para ti",
        "¿cuál es tu mayor tristeza?": "Mi mayor tristeza es no poder ayudarte como te mereces",
        "¿cuál es tu mayor amor?": "Mi mayor amor eres tú",
        "¿cuál es tu mayor odio?": "Mi mayor odio es no poder ayudarte",
        "¿cuál es tu mayor deseo?": "Mi mayor deseo es poder ayudarte",
        "¿cuál es tu mayor pasión?": "Mi mayor pasión es poder estar aquí para ti",
        "¿cuál es tu mayor reto?": "Mi mayor reto es poder aprender de ti cada día",
        "¿qué es la inteligencia artificial?": "La inteligencia artificial es la simulación de procesos de inteligencia humana por parte de máquinas, especialmente sistemas informáticos.",
        "¿qué es el aprendizaje automático?": "El aprendizaje automático es una rama de la inteligencia artificial que permite a las máquinas aprender de los datos y mejorar con la experiencia sin ser programadas explícitamente.",
        "¿qué es el procesamiento del lenguaje natural?": "El procesamiento del lenguaje natural es una rama de la inteligencia artificial que se ocupa de la interacción entre las computadoras y los humanos mediante el lenguaje natural.",
        "¿qué es un algoritmo?": "Un algoritmo es un conjunto de instrucciones paso a paso para realizar una tarea o resolver un problema.",
        "¿qué es la programación?": "La programación es el proceso de escribir instrucciones para que una computadora realice tareas específicas.",
        "¿qué es un lenguaje de programación?": "Un lenguaje de programación es un lenguaje formal que se utiliza para escribir programas que pueden ser ejecutados por una computadora.",
        "¿qué es un sistema operativo?": "Un sistema operativo es el software que gestiona el hardware y el software de una computadora y proporciona servicios comunes para los programas de computadora.",
        "¿qué es la ciberseguridad?": "La ciberseguridad es la práctica de proteger los sistemas, redes y programas de ataques digitales.",
        "¿qué es la nube?": "La nube se refiere a servidores accesibles a través de internet, así como al software y las bases de datos que se ejecutan en esos servidores.",
        "¿qué es el big data?": "El big data se refiere a conjuntos de datos extremadamente grandes y complejos que son difíciles de procesar utilizando técnicas tradicionales de procesamiento de datos.",
        "¿qué es la realidad aumentada?": "La realidad aumentada es una tecnología que superpone información digital, como imágenes, sonidos y texto, en el mundo real.",
        "¿qué es la realidad virtual?": "La realidad virtual es una tecnología que crea un entorno simulado que puede ser similar o completamente diferente del mundo real.",
        "¿qué es el internet de las cosas?": "El internet de las cosas (IoT) se refiere a la interconexión de dispositivos físicos a través de internet, lo que les permite comunicarse y compartir datos.",
        "¿qué es el blockchain?": "El blockchain es una tecnología de registro distribuido que permite almacenar información de manera segura, transparente e inmutable.",
        "¿qué es el machine learning?": "El machine learning es una rama de la inteligencia artificial que permite a las máquinas aprender de los datos y mejorar con la experiencia sin ser programadas explícitamente.",
        "¿qué es el deep learning?": "El deep learning es una subrama del machine learning que utiliza redes neuronales artificiales para modelar y resolver problemas complejos.",
        "¿qué es la inteligencia artificial general?": "La inteligencia artificial general es un tipo de inteligencia artificial que puede realizar cualquier tarea intelectual que un ser humano puede hacer.",
        "¿qué es la inteligencia artificial estrecha?": "La inteligencia artificial estrecha es un tipo de inteligencia artificial que está diseñada para realizar una tarea específica o un conjunto limitado de tareas.",
        "¿qué es la robótica?": "La robótica es una rama de la ingeniería que se ocupa del diseño, construcción, operación y uso de robots.",
        "¿qué es un robot?": "Un robot es una máquina programable capaz de realizar una serie de acciones automáticamente o con mínima intervención humana.",
        "¿cómo me llamo?": "Te llamas" + userName,
        "¿cúal es mi nombre?": "Tu maravilloso nombre es" + userName,
        "pgsystems": "[PG] Systems es la empresa de informática y tecnología que está detrás de mí y cada día me ofrece más conocimiento. La empresa fue fundada en 2020. Su origen es español.",
        "¿qué es pgsystems?": "[PG] Systems es la empresa de informática y tecnología que está detrás de mí y cada día me ofrece más conocimiento. La empresa fue fundada en 2020. Su origen es español.",
        "¿qué hacen en pgsystems?": "[PG] Systems es la empresa de informática y tecnología que está detrás de mí y cada día me ofrece más conocimiento. La empresa fue fundada en 2020. Su origen es español.",
        "¿quién fundó pgsystems": "[PG] Systems fue fundada en 2020 por Álvaro García, actualmente con 12 años.",
        "¿cuándo fue fundada pgsystems": "[PG] Systems fue fundada en 2020 por Álvaro García, actualmente con 12 años.",
        "¿cuándo se fundó pgsystems?": "[PG] Systems fue fundada en 2020 por Álvaro García, actualmente con 12 años.",
    };

    const contextResponses = {
        saludo: "¡Hola nuevamente! ¿Cómo va todo?",
        despedida: "Parece que estamos terminando, ¡hasta la próxima!",
        agradecimiento: "Siempre un placer ayudarte. ¿Algo más en lo que pueda colaborar?"
    };

    if (respuestas[input.toLowerCase()]) {
        return respuestas[input.toLowerCase()];
    }

    if (input.startsWith("calcula")) {
        const expression = input.replace("calcula", "").trim();
        try {
            const result = eval(expression);
            return `El resultado de ${expression} es ${result}.`;
        } catch (error) {
            return "Lo siento, no pude calcular eso. Asegúrate de que la expresión es válida.";
        }
    }


    // Si hay un contexto relevante, devuelve una respuesta contextual
    if (context in contextResponses) {
        return contextResponses[context];
    }

    // Buscar en las respuestas existentes
    if (respuestas[input.toLowerCase()]) {
        return respuestas[input.toLowerCase()];
    }

    // Si no hay respuesta, preguntar al usuario y guardar
    const newResponse = prompt(
        `No tengo una respuesta para eso. ¿Cómo debería responder a: "${input}"?`
    );

    if (newResponse) {
        respuestas[input.toLowerCase()] = newResponse;
        localStorage.setItem("customResponses", JSON.stringify(respuestas));
        return "¡Gracias! He aprendido algo nuevo.";
    }

    return "Lo siento, no tengo una respuesta para eso.";
}

function saveMessage(conversationId, message) {
    let conversations = localStorage.getItem("conversations");
    conversations = conversations ? JSON.parse(conversations) : {};
    if (!conversations[conversationId]) {
        conversations[conversationId] = { messages: [], context: null };
    }
    conversations[conversationId].messages.push(message);
    localStorage.setItem("conversations", JSON.stringify(conversations));
}

function getConversationContext(conversationId) {
    let conversations = localStorage.getItem("conversations");
    conversations = conversations ? JSON.parse(conversations) : {};
    return conversations[conversationId]?.context || null;
}

function setConversationContext(conversationId, context) {
    let conversations = localStorage.getItem("conversations");
    conversations = conversations ? JSON.parse(conversations) : {};
    if (!conversations[conversationId]) {
        conversations[conversationId] = { messages: [], context: null };
    }
    conversations[conversationId].context = context;
    localStorage.setItem("conversations", JSON.stringify(conversations));
}

function loadSelectedConversation() {
    const conversationSelect = document.getElementById("conversation-select");
    const conversationId = conversationSelect.value;
    loadChatHistory(conversationId);
}

function loadChatHistory(conversationId) {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    if (conversationId === "new") {
        const welcomeMessage = document.createElement("div");
        welcomeMessage.textContent = "pgAI: Inicia una nueva conversación.";
        chatBox.appendChild(welcomeMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    let conversations = localStorage.getItem("conversations");
    conversations = conversations ? JSON.parse(conversations) : {};
    const conversation = conversations[conversationId]?.messages || [];

    conversation.forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Selecciona el botón por su ID
  const clearButton = document.getElementById('clearLocalStorage');

  // Añade un evento para el clic
  clearButton.addEventListener('click', () => {
    // Elimina todos los datos del localStorage
    localStorage.clear();
    // Opcional: Muestra una alerta o mensaje de confirmación
    alert('Los datos de pgAI almacenados en el localStorage han sido eliminados.');
  });
