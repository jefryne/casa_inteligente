let cocina = document.getElementById("cocina")
let sala = document.getElementById("sala")
let patio = document.getElementById("patio")
let oficina = document.getElementById("oficina")
let img_mic = document.getElementById("img_mic")
let boton_fondo = document.getElementById("boton_fondo")
let microfono_activo = false
let body = document.querySelector('body')
oficina.style.backgroundColor = "yellow"
oficina.style.backgroundColor = ""

let info_casa = []

boton_fondo.addEventListener("click", ()=>{
    body.classList.toggle("bg-dark")
    body.classList.toggle("text-white")
})

function updateLuz(id_casa, ubi, mensaje) {
    data = {
        id: id_casa,
        ubicacion: ubi
    }

    fetch("http://127.0.0.1:8000/update-casa/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) 
    })
    .then(res => res.json())
    .then(data => {
        hablar(mensaje)
        getCasas()
    })
    .catch(error =>{
        console.log(error);
    })
}

function validar_luz(arreglo_entidades, estado) {
    let query = ""
    let mensaje = ""
    for (const element of arreglo_entidades) {
        if (element.category == "Ubicacion") {
            if (element.text == "patio") {
                if (info_casa[0][2] == estado) {
                    hablar(mensaje += ((estado == 1) ? "luz del patio ya esta encendida" : "luz del patio ya esta apagada"));
                } else {
                    mensaje += ((estado == 1) ? "luz del patio encendida" : "luz del patio apagada")
                    query += ((query != "") ? "," : "")+" patio = "+estado
                }
            } else if (element.text == "cocina") {
                if (info_casa[0][1] == estado) {
                    hablar(mensaje += ((estado == 1) ? "la luz de la cocina ya esta encendida" : " la luz de la cocina ya esta apagada"));               
                } else {
                    mensaje += ((estado == 1) ? "luz de la cocina encendida" : "luz de la cocina apagada")
                    query += ((query != "") ? "," : "")+" cocina = "+estado
                }
            } else if (element.text == "sala") {
                if (info_casa[0][4] == estado) {
                    hablar(mensaje += ((estado == 1) ? "la luz de la sala ya esta encendida" : " la luz de la sala ya esta apagada"));               
                } else {
                    mensaje += ((estado == 1) ? "luz de la sala encendida" : "luz de la sala apagada")
                    query += ((query != "") ? "," : "")+" sala = "+estado
                }
            } else if (element.text == "oficina") {
                if (info_casa[0][3] == estado) {
                    hablar(mensaje += ((estado == 1) ? "la luz de la oficina ya esta encendida" : " la luz de la oficina ya esta apagada"));               
                } else {
                    mensaje += ((estado == 1) ? "luz de la oficina encendida" : "luz de la oficina apagada")
                    query += ((query != "") ? "," : "")+" oficina = "+estado
                }
            } else if (element.text == "casa") {
                if (estado == 1) {
                    encenderLuces();
                } else {
                    apagarLuces();
                }
            }

        }
    }
    if(query != ""){
        console.log();
        updateLuz(info_casa[0][0], query,mensaje);
        query=""
    }   
}


function entidadesCasa(text) {
    
    data = {
        "kind":"Conversation",
        "analysisInput":{
            "conversationItem":{
                "id":"1",
                "text": text,
                "modality":"text",
                "language":"es-es",
            "participantId":"1"
            }
        },
        "parameters":{
            "projectName":"casaIteligente",
            "verbose":true,
            "deploymentName":"deploy-casa-inteligente",
            "stringIndexType":"TextElement_V8"
            }
    };

    fetch("https://bot-celulares.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-10-01-preview", {
        method: "POST",
        headers: {
            "Ocp-Apim-Subscription-Key": "0f2504649e384ee1a5adebdc5fde163a",
            "Apim-Request-Id": "4ffcac1c-b2fc-48ba-bd6d-b69d9942995a",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) 
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        console.log(data.result.prediction.topIntent);
        console.log(data.result.prediction.entities);
        if(data.result.prediction.topIntent == "ApagarLuz"){
            validar_luz(data.result.prediction.entities, 0)
        }else if(data.result.prediction.topIntent == "PrenderLuz"){
            validar_luz(data.result.prediction.entities, 1)
        }
    })
    .catch(error =>{
        console.log(error);
    })


}

let audioContext = null;
let recognizer = null;

function iniciarAudioContext() {
    
    if (audioContext === null) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();


        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("64bd01cdd7d94e569857f92701fd3a38", "eastus");


        speechConfig.speechRecognitionLanguage = "es-ES";

        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

        recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
        

        recognizer.recognized = (s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                entidadesCasa(e.result.text)
            }
        };

        recognizer.canceled = (s, e) => {
            console.log(`CANCELED: Reason=${e.reason}`);

            if (e.reason === SpeechSDK.CancellationReason.Error) {
                console.log(`CANCELED: ErrorCode=${e.ErrorCode}`);
                console.log(`CANCELED: ErrorDetails=${e.ErrorDetails}`);
            }
        };
    }
}

img_mic.addEventListener("click", ()=>{
    if(microfono_activo){
        recognizer.stopContinuousRecognitionAsync();
        microfono_activo = false
        img_mic.setAttribute("src", "img/icons8-mic-50.png")   
    }else{
        iniciarAudioContext();
        recognizer.startContinuousRecognitionAsync();
        microfono_activo = true
        img_mic.setAttribute("src", "img/icons8-microphone-50.png")
    }

})

function getCasas() {
    fetch("http://127.0.0.1:8000/")
    .then(res => res.json())
    .then(data => {
        info_casa = data
        console.log(info_casa);
        pitar_luz()
    })
    .catch(error =>{
        console.log(error);
    })
}

getCasas()



function hablar(texto_hablar) {
    const apiUrl = 'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1';
    const subscriptionKey = '64bd01cdd7d94e569857f92701fd3a38'; 

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
            'User-Agent': 'curl'
        },
        body: "<speak version='1.0' xml:lang='en-US'><voice xml:lang='es-ES' xml:gender='Female' name='	es-ES-ElviraNeural'>"+texto_hablar+"</voice></speak>"
    })
    .then((response) => {
        if (response.ok) {
            return response.blob();
        } else {
            throw new Error('Error en la solicitud a la API.');
        }
    })
    .then((blob) => {
        const url = URL.createObjectURL(blob);

        // Crea un nuevo elemento de audio
        const audio = new Audio(url);
    
        // Reproduce automáticamente el audio
        audio.play();
        texto_de_voz=""
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function pitar_luz() {
    if(info_casa[0][1] == 1){
        cocina.classList.add("bg-warning")
    }else{
        cocina.classList.remove("bg-warning")
    }

    if(info_casa[0][2] == 1){
        patio.classList.add("bg-warning")
    }else{
        patio.classList.remove("bg-warning")
    }

    if(info_casa[0][3] == 1){
        oficina.classList.add("bg-warning")
    }else{
        oficina.classList.remove("bg-warning")
    }

    if(info_casa[0][4] == 1){
        sala.classList.add("bg-warning")
    }else{
        sala.classList.remove("bg-warning")
    }
}

function apagarLuces() {
    cocina.classList.remove("bg-warning")
    patio.classList.remove("bg-warning")
    oficina.classList.remove("bg-warning")
    sala.classList.remove("bg-warning")
    for (let index = 1; index < info_casa[0].length; index++) {
        info_casa[0][index] = 0
    }
    manejar_luces(1,0, "Todas las luces fueron apagadas")
}

function encenderLuces() {
    cocina.classList.add("bg-warning")
    patio.classList.add("bg-warning")
    oficina.classList.add("bg-warning")
    sala.classList.add("bg-warning")
    for (let index = 1; index < info_casa[0].length; index++) {
        info_casa[0][index] = 1
    }
    manejar_luces(1,1, "Todas las luces fueron encendidas")
}

function manejar_luces(id,estado,mensaje) {
    fetch(`http://127.0.0.1:8000/luces/${id}/${estado}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        hablar(mensaje);
    })
    .catch(error =>{
        console.log(error);
    })
}