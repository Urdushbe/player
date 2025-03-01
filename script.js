let words = [];
let currentIndex = -1;
let savedWords = [];

document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    words = jsonData.filter(row => row[1] && row[2]).map(row => ({ english: row[1], translation: row[2] }));
    alert('Excel file uploaded!');
    showNextWord();
  };
  reader.readAsArrayBuffer(file);
}

function showNextWord() {
  if (words.length === 0) {
    alert('No words available. Upload Excel file!');
    return;
  }
  currentIndex = (currentIndex + 1) % words.length;
  displayWord();
  speakWord(words[currentIndex].english);
}

function displayWord() {
  const word = words[currentIndex];
  document.getElementById('englishWord').textContent = word.english;
  document.getElementById('translation').textContent = word.translation;
}

function speakWord(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

document.getElementById('nextButton').addEventListener('click', showNextWord);
document.getElementById('prevButton').addEventListener('click', () => speakWord(words[currentIndex].english));

document.getElementById('saveButton').addEventListener('click', () => {
  const savedWord = words[currentIndex];
  savedWords.push(savedWord);
  alert(`${savedWord.english} saved!`);
});

document.getElementById('downloadButton').addEventListener('click', () => {
  if (savedWords.length === 0) {
    alert('No words were spared!');
    return;
  }
  const newWorkbook = XLSX.utils.book_new();
  const newSheetData = savedWords.map((word, index) => [index + 1, word.english, word.translation]);
  const newSheet = XLSX.utils.aoa_to_sheet(newSheetData);
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Saved Words');
  XLSX.writeFile(newWorkbook, 'SavedVocabulary.xlsx');
});

// Klaviatura boshqaruvi
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowRight':
      showNextWord(); // O'ng tugma bilan keyingi so'z
      break;
    case 'ArrowLeft':
      speakWord(words[currentIndex].english); // Chap tugma bilan qayta o'qish
      break;
    case 'ArrowDown':
      const savedWord = words[currentIndex];
      savedWords.push(savedWord); // Pastga tugma bilan saqlash
      alert(`${savedWord.english} saved!`);
      break;
    case 'ArrowUp':
      if (savedWords.length > 0) {
        const newWorkbook = XLSX.utils.book_new();
        const newSheetData = savedWords.map((word, index) => [index + 1, word.english, word.translation]);
        const newSheet = XLSX.utils.aoa_to_sheet(newSheetData);
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Saved Words');
        XLSX.writeFile(newWorkbook, 'SavedVocabulary.xlsx');
      } else {
        alert('No words were spared!');
      }
      break;
  }
});


function toggleBlur() {
  var text = document.getElementById("translation");
  var icon = document.getElementById("eye-icon");

  if (text.classList.contains("blurred")) {
    text.classList.remove("blurred"); // Matnni aniq qilish
    icon.classList.remove("bi-eye-slash-fill");
    icon.classList.add("bi-eye-fill"); // Ochiq ko‘z
  } else {
    text.classList.add("blurred"); // Matnni hiralashtirish
    icon.classList.remove("bi-eye-fill");
    icon.classList.add("bi-eye-slash-fill"); // Yopiq ko‘z
  }
};