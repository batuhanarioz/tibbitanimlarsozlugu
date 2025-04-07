let data = [];

// JSON dosyasını yükleme
fetch('kelimeler.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
    })
    .catch(error => console.error("JSON verisi yüklenirken hata oluştu:", error));

const searchBar = document.getElementById("search-bar");
const resultsDiv = document.getElementById("results"); // Sonuçların gösterileceği alan
const explanationDiv = document.getElementById("explanation"); // Açıklama alanını seç

// Arama kutusuna her harf girildiğinde arama işlevini çalıştırıyoruz
searchBar.addEventListener("input", searchWord);

// Türkçe karakterleri normalize eden fonksiyon
function normalizeString(str) {
    return str
        .replace(/ı/g, 'i')
        .replace(/İ/g, 'i')
        .toLowerCase();
}

function searchWord() {
    const searchTerm = normalizeString(searchBar.value.trim());
    resultsDiv.innerHTML = ""; // Önceki sonuçları temizle

    if (searchTerm === "") {
        explanationDiv.innerHTML = ""; // Arama terimi boşsa açıklamayı temizle
        return; // İşlem yapma
    }

    // Arama terimiyle başlayan kelimeler
    const startsWithResults = data.filter(item => 
        normalizeString(item.kelime).startsWith(searchTerm)
    );

    // Arama terimi herhangi bir yerde geçen, fakat başta olmayan kelimeler
    const containsResults = data.filter(item => 
        normalizeString(item.kelime).includes(searchTerm) && 
        !normalizeString(item.kelime).startsWith(searchTerm)
    );

    // İki listeyi birleştiriyoruz
    const filteredResults = [...startsWithResults, ...containsResults];

    if (filteredResults.length > 0) {
        filteredResults.forEach(item => {
            const resultItem = document.createElement("div");
            resultItem.classList.add("result-item");
            resultItem.textContent = item.kelime;

            // Sonuca tıklandığında açıklamayı göster
            resultItem.addEventListener("click", () => showExplanation(item));
            resultsDiv.appendChild(resultItem);
        });
    } else {
        resultsDiv.innerHTML = "<p>Aradığınız terim bulunamadı.</p>";
    }
}

function showExplanation(item) {
    const resultsDiv = document.getElementById("results");
    const explanationDiv = document.getElementById("explanation"); // Açıklama alanını seç

    // Sonuçları temizle
    resultsDiv.innerHTML = ""; // Sonuç alanını temizle

    // Açıklama kutusu için HTML yapısını oluşturuyoruz
    explanationDiv.innerHTML = `
        <div class="explanation-container">
            <div class="explanation-inner">
                <strong>${item.kelime}</strong>: ${item.aciklama}
            </div>
        </div>
    `;

    // Açıklama div'ini görünür yap
    explanationDiv.style.display = 'block';
}

// Arama çubuğuna odaklanma olayını dinleyin
searchBar.addEventListener('focus', function() {
    window.scrollTo({
        top: 0, // En üste kaydır
        behavior: "smooth" // Kayma efekti
    });
    // Açıklamayı gizle
    explanationDiv.innerHTML = ""; // Açıklamayı temizle
    explanationDiv.style.display = 'none'; // Açıklamayı gizle
});


document.getElementById("chatbot-open-btn").addEventListener("click", function() {
    document.getElementById("chatbox").style.display = "flex";
    document.getElementById("chatbot-open-btn").classList.add("hidden"); // Buton yazısını gizle
});

document.getElementById("chatbox-close-btn").addEventListener("click", function() {
    document.getElementById("chatbox").style.display = "none";
    document.getElementById("chatbot-open-btn").classList.remove("hidden"); // Buton yazısını göster
});

document.querySelector(".search-btn").addEventListener("click", function (e) {
    e.preventDefault();
    gtag("event", "search_button_click", {
        event_category: "Search",
        event_label: searchBar.value.trim()
    });
});

resultItem.addEventListener("click", () => {
    gtag("event", "search_result_click", {
        event_category: "Search",
        event_label: item.kelime
    });
    showExplanation(item);
});


const messagesDiv = document.getElementById("chatbox-messages");
const userInput = document.getElementById("user-input");

userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            displayMessage(userMessage, "user-message");
            botResponse(userMessage);
            userInput.value = "";
        }
    }
});

function displayMessage(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = className;
    messageDiv.innerHTML = text; // Mesaj içeriğini HTML olarak ayarlayın
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Mesaj kutusunu en alta kaydır
}

function botResponse(userMessage) {
    let response;
    const lowerMessage = userMessage.toLowerCase();

    // Cevaplar
    if (lowerMessage.includes("android")) {
        response = 'Android uygulamamıza buradan ulaşabilirsiniz: <a href="https://apps.apple.com/tr/app/t%C4%B1bbi-tan%C4%B1mlar-s%C3%B6zl%C3%BC%C4%9F%C3%BC/id6503453705?l=tr" target="_blank">Tıbbi Tanımlar Sözlüğü</a>';
    } else if (lowerMessage.includes("ios")) {
        response = 'iOS uygulamamıza buradan ulaşabilirsiniz: <a href="https://apps.apple.com/tr/app/t%C4%B1bbi-tan%C4%B1mlar-s%C3%B6zl%C3%BC%C4%9F%C3%BC/id6503453705?l=tr" target="_blank">Tıbbi Tanımlar Sözlüğü</a>';
    } else if (lowerMessage.includes("destek") || lowerMessage.includes("iletişim")) {
        response = 'Destek için bize email atabilirsiniz: <a href="mailto:tibbitanimlarsozlugu@gmail.com">tibbitanimlarsozlugu@gmail.com</a>';
    } else if (lowerMessage.includes("batu")) {
        response = 'İşte Linkedin Hesabım: <a href="https://www.linkedin.com/in/batuhanarioz" target="_blank">Batuhan ARIÖZ</a>';
    } else {
        response = "Üzgünüm, bu soruya yanıt veremiyorum. Başka bir konuda yardımcı olabilir miyim?";
    }

    displayMessage(response, "bot-message");
}
