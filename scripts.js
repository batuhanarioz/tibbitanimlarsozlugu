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
    // Açıklamayı gizle
    explanationDiv.innerHTML = ""; // Açıklamayı temizle
    explanationDiv.style.display = 'none'; // Açıklamayı gizle
});
