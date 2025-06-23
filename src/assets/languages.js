let currentTestCategory = null;
let correctlyAnsweredWords = new Set();

function openTestWordsModal() {
  document.getElementById("testWordsModal").style.display = "block";
  document.getElementById("testWord").textContent =
    "Select a category to start testing";
  document.getElementById("answer").value = "";
}

function startTest(category) {
  currentTestCategory = category;
  correctlyAnsweredWords.clear();
  displayRandomWord();
}

function displayRandomWord() {
  if (!currentTestCategory) return;

  const words = vocabulary[currentTestCategory].filter(
    (word) =>
      word.italian !== "VERBS:" &&
      word.italian !== "VOCAB:" &&
      !correctlyAnsweredWords.has(word.italian)
  );

  if (words.length > 0) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    document.getElementById("testWord").textContent = randomWord.italian;
    document.getElementById("testWord").dataset.answer = randomWord.english;
  } else {
    if (correctlyAnsweredWords.size > 0) {
      // All words have been answered correctly
      alert("Congratulations! You have completed all words in this category!");
      document.getElementById("testWordsModal").style.display = "none";
    } else {
      document.getElementById(
        "testWord"
      ).textContent = `No ${currentTestCategory} available for testing`;
    }
  }
}

// Initialize vocabulary from localStorage or create new
let vocabulary = JSON.parse(localStorage.getItem("vocabulary")) || {
  verbs: [],
  general: [],
};

window.addEventListener("load", () => {
  // Initial table update blazor
  //document.addEventListener('DOMContentLoaded', () => {
  updateTable("verbs");
  updateTable("general");
});

function openAddWordModal() {
  document.getElementById("addWordModal").style.display = "block";
}

// Close modals when clicking outside
window.onclick = function (event) {
  if (event.target.className === "modal") {
    event.target.style.display = "none";
  }
};

async function addWord(category) {
  const italian = document.getElementById("italianWord").value.trim();
  const english = document.getElementById("englishWord").value.trim();

  if (italian && english) {
    // Validate verb endings if adding to verbs category
    // if (category === 'verbs' && !/[aei]re$/.test(italian)
    // ) {
    //     alert('Verbs must end with "are", "ere", or "ire"');
    //     return;
    // }

    // Check for duplicates in both tables
    const isDuplicate = ["verbs", "general"].some((cat) =>
      vocabulary[cat].some(
        (word) =>
          word.italian.toLowerCase() === italian.toLowerCase() ||
          word.english.toLowerCase() === english.toLowerCase()
      )
    );

    if (isDuplicate) {
      alert("This word already exists in the vocabulary!");
      return;
    }

    // Add new word to the appropriate category
    const newWord = { italian, english };

    if (category === "VERBS") {
      // If verbs array is empty, add header first
      if (vocabulary.verbs.length === 0) {
        vocabulary.verbs.push({ italian: "VERBS:", english: "" });
      }
      // Insert new word after the header
      vocabulary.verbs.splice(1, 0, newWord);
    } else {
      // If general array is empty, add header first
      if (vocabulary.general.length === 0) {
        vocabulary.general.push({ italian: "VOCAB:", english: "" });
      }
      // Insert new word after the header
      vocabulary.general.splice(1, 0, newWord);
    }

    updateTable(category);

    // Clear inputs and close modal
    document.getElementById("italianWord").value = "";
    document.getElementById("englishWord").value = "";
    document.getElementById("addWordModal").style.display = "none";
  }
}

function updateTable(category) {
  const table = document.getElementById(category + "Table");
  const words = vocabulary[category];
  const tbody = table.getElementsByTagName("tbody")[0];

  // Clear existing rows
  tbody.innerHTML = "";

  // Add header row if no words exist
  if (words.length === 0) {
    const headerRow = tbody.insertRow();
    const italianCell = headerRow.insertCell(0);
    const englishCell = headerRow.insertCell(1);
    const deleteCell = headerRow.insertCell(2);
    italianCell.textContent = "Other language";
    englishCell.textContent = "English";
    deleteCell.textContent = "Actions";
    italianCell.style.color = "#888";
    englishCell.style.color = "#888";
    deleteCell.style.color = "#888";
  }

  // Add rows for each word
  words.forEach((word, index) => {
    const row = tbody.insertRow();
    const italian_cell = row.insertCell(0);
    const english_cell = row.insertCell(1);
    const deleteCell = row.insertCell(2);
    const deleteButton = document.createElement("button");
    deleteCell.className = "delete-btn-cell";
    deleteButton.className = "delete-btn";
    italian_cell.textContent = word.italian;
    english_cell.textContent = word.english;
    deleteButton.textContent = "✖️";
    deleteButton.onclick = () => deleteRow(category, index);
    deleteCell.appendChild(deleteButton);
  });

  // Update localStorage
  localStorage.setItem("vocabulary", JSON.stringify(vocabulary));
}

function checkAnswer() {
  const userAnswer = document.getElementById("answer").value.toLowerCase();
  const correctAnswer = document
    .getElementById("testWord")
    .dataset.answer.toLowerCase();
  const currentWord = document.getElementById("testWord").textContent;

  if (userAnswer === correctAnswer) {
    alert("Correct!");
    correctlyAnsweredWords.add(currentWord);
  } else {
    alert(`Incorrect. The correct answer is: ${correctAnswer}`);
  }

  // Clear input and display new word
  document.getElementById("answer").value = "";
  displayRandomWord();
}

async function importCSV() {
  document.getElementById("fileInput").click();
}

async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split("\n");

    let hasError = false;
    let currentCategory = "general"; // Default category

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return; // Skip empty lines

      // Check for category headers
      if (trimmedLine.toUpperCase().includes("VERBS:")) {
        currentCategory = "verbs";
        return;
      } else if (trimmedLine.toUpperCase().includes("VOCAB:")) {
        currentCategory = "general";
        return;
      }

      // Process word pairs
      const [italian, english] = trimmedLine
        .split(",")
        .map((field) => field?.trim() || "");
      if (!italian || !english) {
        return; // Skip invalid lines silently
      }

      const isDuplicate = ["verbs", "general"].some((cat) =>
        vocabulary[cat].some(
          (existingWord) =>
            existingWord.italian.toLowerCase() === italian.toLowerCase() ||
            existingWord.english.toLowerCase() === english.toLowerCase()
        )
      );

      console.log(trimmedLine);
      if (!isDuplicate) {
        vocabulary[currentCategory].push({ italian, english });
      }
    });

    if (!hasError) {
      updateTable("verbs");
      updateTable("general");
      alert("Import completed successfully!");
    }
  };
  reader.readAsText(file);
}

async function exportCSV() {
  let csvContent = "";

  // Add verbs section if there are any verbs
  if (vocabulary.verbs.length > 0) {
    csvContent += "VERBS:\n";
    vocabulary.verbs.forEach((word) => {
      if (word.italian !== "VERBS:") {
        // Skip the header row
        csvContent += `${word.italian},${word.english}\n`;
      }
    });
  }

  // Add general vocabulary section if there are any words
  if (vocabulary.general.length > 0) {
    csvContent += "VOCAB:\n";
    vocabulary.general.forEach((word) => {
      if (word.italian !== "VOCAB:") {
        // Skip the header row
        csvContent += `${word.italian},${word.english}\n`;
      }
    });
  }

  const blob = new Blob([csvContent], { type: "text/csv" });

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: "vocabulary.csv",
      types: [
        {
          description: "CSV Files",
          accept: { "text/csv": [".csv"] },
        },
      ],
    });

    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    alert("Export completed successfully!");
  } catch (err) {
    console.error("Error exporting CSV:", err);
    alert("Error exporting to CSV file. Please try again.");
  }
}

function clearVocabulary() {
  if (
    confirm(
      "Are you sure you want to clear all vocabulary? This cannot be undone."
    )
  ) {
    vocabulary = {
      verbs: [],
      general: [],
    };

    localStorage.removeItem("vocabulary");

    updateTable("verbs");
    updateTable("general");
  }
}

function deleteRow(category, index) {
  if (confirm("Are you sure you want to delete this word?")) {
    vocabulary[category].splice(index, 1);
    updateTable(category);
  }
}
