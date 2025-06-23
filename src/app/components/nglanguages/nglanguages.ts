import { Component } from '@angular/core';
import { PROJECTS } from '../../../constants/projects';

@Component({
  selector: 'app-nglanguages',
  imports: [],
  templateUrl: './nglanguages.html',
  styleUrl: './nglanguages.scss',
})
export class Languages {
  projects = PROJECTS;

  private currentTestCategory: any = null;
  private correctlyAnsweredWords = new Set();
  private vocabulary: {
    [key: string]: Array<{ italian: string; english: string }>;
  } = {};

  openAddWordModal() {
    const addWordModal = document.getElementById('addWordModal');
    if (addWordModal) {
      addWordModal.style.display = 'block';
    }
  }

  openTestWordsModal() {
    const modal = document.getElementById('testWordsModal');
    const testWord = document.getElementById('testWord');
    const answer = document.getElementById('answer') as HTMLInputElement;

    if (modal && testWord && answer) {
      modal.style.display = 'block';
      testWord.textContent = 'Select a category to start testing';
      answer.value = '';
    }
  }

  startTest(category: string) {
    this.currentTestCategory = category;
    this.correctlyAnsweredWords.clear();
    this.displayRandomWord();
  }

  displayRandomWord() {
    if (!this.currentTestCategory) return;

    const words = this.vocabulary[this.currentTestCategory].filter(
      (word) =>
        word.italian !== 'VERBS:' &&
        word.italian !== 'VOCAB:' &&
        !this.correctlyAnsweredWords.has(word.italian)
    );

    if (words.length > 0) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      const testWordElement = document.getElementById('testWord');
      if (testWordElement) {
        testWordElement.textContent = randomWord.italian;
        testWordElement.dataset['answer'] = randomWord.english;
      }
    } else {
      if (this.correctlyAnsweredWords.size > 0) {
        // All words have been answered correctly
        alert(
          'Congratulations! You have completed all words in this category!'
        );
        const testWordsModal = document.getElementById('testWordsModal');
        if (testWordsModal) {
          testWordsModal.style.display = 'none';
        }
      } else {
        const testWordElement = document.getElementById('testWord');
        if (testWordElement) {
          testWordElement.textContent = `No ${this.currentTestCategory} available for testing`;
        }
      }
    }
  }

  // Initialize vocabulary from localStorage or create new
  ngOnInit() {
    const storedVocabulary = localStorage.getItem('vocabulary');
    this.vocabulary = storedVocabulary
      ? JSON.parse(storedVocabulary)
      : {
          verbs: [],
          general: [],
        };
  }

  // Close modals when clicking outside
  closeModalOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      target.style.display = 'none';
    }
  }

  addWord(category: string) {
    const italian: string = (
      document.getElementById('italianWord') as HTMLInputElement
    ).value.trim();
    const english: string = (
      document.getElementById('englishWord') as HTMLInputElement
    ).value.trim();

    if (italian && english) {
      // Check for duplicates in both tables
      const isDuplicate = ['verbs', 'general'].some((cat: string) =>
        this.vocabulary[cat].some(
          (word: { italian: string; english: string }) =>
            word.italian.toLowerCase() === italian.toLowerCase() ||
            word.english.toLowerCase() === english.toLowerCase()
        )
      );

      if (isDuplicate) {
        alert('This word already exists in the vocabulary!');
        return;
      }

      // Add new word to the appropriate category
      const newWord = { italian, english };

      if (category === 'VERBS') {
        // If verbs array is empty, add header first
        if (this.vocabulary['verbs'].length === 0) {
          this.vocabulary['verbs'].push({ italian: 'VERBS:', english: '' });
        }
        // Insert new word after the header
        this.vocabulary['verbs'].splice(1, 0, newWord);
      } else {
        // If general array is empty, add header first
        if (this.vocabulary['general'].length === 0) {
          this.vocabulary['general'].push({ italian: 'VOCAB:', english: '' });
        }
        // Insert new word after the header
        this.vocabulary['general'].splice(1, 0, newWord);
      }

      this.updateTable(category);

      // Clear inputs and close modal
      const italianInput = document.getElementById(
        'italianWord'
      ) as HTMLInputElement;
      const englishInput = document.getElementById(
        'englishWord'
      ) as HTMLInputElement;
      const addWordModal = document.getElementById('addWordModal');

      if (italianInput) italianInput.value = '';
      if (englishInput) englishInput.value = '';
      if (addWordModal) addWordModal.style.display = 'none';
    }
  }

  updateTable(category: string) {
    const table = document.getElementById(category + 'Table');
    if (!table) return;

    const words = this.vocabulary[category];
    const tbody = table.getElementsByTagName('tbody')[0];

    // Clear existing rows
    tbody.innerHTML = '';

    // Add header row if no words exist
    if (words.length === 0) {
      const headerRow = tbody.insertRow();
      const italianCell = headerRow.insertCell(0);
      const englishCell = headerRow.insertCell(1);
      const deleteCell = headerRow.insertCell(2);
      italianCell.textContent = 'Other language';
      englishCell.textContent = 'English';
      deleteCell.textContent = 'Actions';
      italianCell.style.color = '#888';
      englishCell.style.color = '#888';
      deleteCell.style.color = '#888';
    }

    // Add rows for each word
    words.forEach(
      (word: { italian: string; english: string }, index: number) => {
        const row = tbody.insertRow();
        const italian_cell = row.insertCell(0);
        const english_cell = row.insertCell(1);
        const deleteCell = row.insertCell(2);
        const deleteButton = document.createElement('button');
        deleteCell.className = 'delete-btn-cell';
        deleteButton.className = 'delete-btn';
        italian_cell.textContent = word.italian;
        english_cell.textContent = word.english;
        deleteButton.textContent = '✖️';
        deleteButton.onclick = () => this.deleteRow(category, index);
        deleteCell.appendChild(deleteButton);
      }
    );

    // Update localStorage
    localStorage.setItem('vocabulary', JSON.stringify(this.vocabulary));
  }

  checkAnswer() {
    const userAnswer =
      (
        document.getElementById('answer') as HTMLInputElement
      )?.value.toLowerCase() ?? '';
    const correctAnswer =
      (document.getElementById('testWord') as HTMLElement)?.dataset?.[
        'answer'
      ]?.toLowerCase() ?? '';
    const currentWord =
      (document.getElementById('testWord') as HTMLElement)?.textContent ?? '';

    if (userAnswer === correctAnswer) {
      alert('Correct!');
      this.correctlyAnsweredWords.add(currentWord);
    } else {
      alert(`Incorrect. The correct answer is: ${correctAnswer}`);
    }

    // Clear input and display new word
    const answer = document.getElementById('answer') as HTMLInputElement;
    if (answer) {
      answer.value = '';
    }
    this.displayRandomWord();
  }

  importCSV() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (!result || typeof result !== 'string') return;

      const lines = result.split('\n');
      let currentCategory = 'general'; // Default category

      lines.forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return; // Skip empty lines

        // Check for category headers
        if (trimmedLine.toUpperCase().includes('VERBS:')) {
          currentCategory = 'verbs';
          return;
        } else if (trimmedLine.toUpperCase().includes('VOCAB:')) {
          currentCategory = 'general';
          return;
        }

        // Process word pairs
        const [italian, english] = trimmedLine
          .split(',')
          .map((field: string) => field?.trim() || '');
        if (!italian || !english) {
          return; // Skip invalid lines silently
        }

        const isDuplicate = ['verbs', 'general'].some((cat: string) =>
          this.vocabulary[cat].some(
            (existingWord: { italian: string; english: string }) =>
              existingWord.italian.toLowerCase() === italian.toLowerCase() ||
              existingWord.english.toLowerCase() === english.toLowerCase()
          )
        );

        if (!isDuplicate) {
          this.vocabulary[currentCategory].push({ italian, english });
        }
      });

      this.updateTable('verbs');
      this.updateTable('general');
      alert('Import completed successfully!');
    };
    reader.readAsText(file);
  }

  async exportCSV() {
    let csvContent = '';

    // Add verbs section if there are any verbs
    if (this.vocabulary['verbs'].length > 0) {
      csvContent += 'VERBS:\n';
      this.vocabulary['verbs'].forEach(
        (word: { italian: string; english: string }) => {
          if (word.italian !== 'VERBS:') {
            // Skip the header row
            csvContent += `${word.italian},${word.english}\n`;
          }
        }
      );
    }

    // Add general vocabulary section if there are any words
    if (this.vocabulary['general'].length > 0) {
      csvContent += 'VOCAB:\n';
      this.vocabulary['general'].forEach(
        (word: { italian: string; english: string }) => {
          if (word.italian !== 'VOCAB:') {
            // Skip the header row
            csvContent += `${word.italian},${word.english}\n`;
          }
        }
      );
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });

    try {
      // Check if File System Access API is supported
      if ('showSaveFilePicker' in window) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: 'vocabulary.csv',
          types: [
            {
              description: 'CSV Files',
              accept: { 'text/csv': ['.csv'] },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        alert('Export completed successfully!');
      } else {
        // Fallback for browsers that don't support File System Access API
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vocabulary.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Export completed successfully!');
      }
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Error exporting to CSV file. Please try again.');
    }
  }

  clearVocabulary() {
    if (
      confirm(
        'Are you sure you want to clear all vocabulary? This cannot be undone.'
      )
    ) {
      this.vocabulary = {
        verbs: [],
        general: [],
      };

      localStorage.removeItem('vocabulary');

      this.updateTable('verbs');
      this.updateTable('general');
    }
  }

  deleteRow(category: string, index: number) {
    if (confirm('Are you sure you want to delete this word?')) {
      this.vocabulary[category].splice(index, 1);
      this.updateTable(category);
    }
  }
}
