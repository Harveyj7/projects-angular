import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PROJECTS } from '../../../constants/projects';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VocabularyWord {
  italian: string;
  english: string;
}

interface VocabularyData {
  verbs: VocabularyWord[];
  general: VocabularyWord[];
}

@Component({
  selector: 'app-nglanguages',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './nglanguages.html',
  styleUrl: './nglanguages.scss',
})
export class Languages {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  projects = PROJECTS;

  // Modal visibility state
  showAddWordModal = false;
  showTestWordsModal = false;

  // Form data
  italianWord = '';
  englishWord = '';
  answerInput = '';

  // Test state
  currentTestCategory: string | null = null;
  currentTestWord: VocabularyWord | null = null;
  testDisplayText = 'Select a category to start testing';
  correctlyAnsweredWords = new Set<string>();

  // Vocabulary data
  vocabulary: VocabularyData = {
    verbs: [],
    general: [],
  };

  ngOnInit() {
    this.initializeVocabulary();
  }

  initializeVocabulary() {
    const storedVocabulary = localStorage.getItem('vocabulary');
    this.vocabulary = storedVocabulary
      ? JSON.parse(storedVocabulary)
      : {
          verbs: [],
          general: [],
        };
  }

  openAddWordModal() {
    this.showAddWordModal = true;
  }

  closeAddWordModal() {
    this.showAddWordModal = false;
    this.resetAddWordForm();
  }

  openTestWordsModal() {
    this.showTestWordsModal = true;
    this.testDisplayText = 'Select a category to start testing';
    this.answerInput = '';
  }

  closeTestWordsModal() {
    this.showTestWordsModal = false;
    this.currentTestCategory = null;
    this.currentTestWord = null;
  }

  // Form management
  resetAddWordForm() {
    this.italianWord = '';
    this.englishWord = '';
  }

  startTest(category: string) {
    this.currentTestCategory = category;
    this.correctlyAnsweredWords.clear();
    this.displayRandomWord();
  }

  displayRandomWord() {
    if (!this.currentTestCategory) return;

    const categoryWords =
      this.currentTestCategory === 'verbs'
        ? this.vocabulary.verbs
        : this.vocabulary.general;

    const words = categoryWords.filter(
      (word) =>
        word.italian !== 'VERBS:' &&
        word.italian !== 'VOCAB:' &&
        !this.correctlyAnsweredWords.has(word.italian)
    );

    if (words.length > 0) {
      this.currentTestWord = words[Math.floor(Math.random() * words.length)];
      this.testDisplayText = this.currentTestWord.italian;
    } else {
      if (this.correctlyAnsweredWords.size > 0) {
        alert(
          'Congratulations! You have completed all words in this category!'
        );
        this.closeTestWordsModal();
      } else {
        this.testDisplayText = `No ${this.currentTestCategory} available for testing`;
      }
    }
  }

  // Close modals when clicking outside
  onModalBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      if (target.id === 'addWordModal') {
        this.closeAddWordModal();
      } else if (target.id === 'testWordsModal') {
        this.closeTestWordsModal();
      }
    }
  }

  addWord(category: string) {
    const italian = this.italianWord.trim();
    const english = this.englishWord.trim();

    if (!italian || !english) {
      alert('Please fill in both fields');
      return;
    }

    // Check for duplicates in both tables
    const isDuplicate = Object.values(this.vocabulary).some((words) =>
      words.some(
        (word: VocabularyWord) =>
          word.italian.toLowerCase() === italian.toLowerCase() ||
          word.english.toLowerCase() === english.toLowerCase()
      )
    );

    if (isDuplicate) {
      alert('This word already exists in the vocabulary!');
      return;
    }

    // Add new word to the appropriate category
    const newWord: VocabularyWord = { italian, english };

    if (category === 'verbs') {
      // If verbs array is empty, add header first
      if (this.vocabulary.verbs.length === 0) {
        this.vocabulary.verbs.push({ italian: 'VERBS:', english: '' });
      }
      // Insert new word after the header
      this.vocabulary.verbs.splice(1, 0, newWord);
    } else {
      // If general array is empty, add header first
      if (this.vocabulary.general.length === 0) {
        this.vocabulary.general.push({ italian: 'VOCAB:', english: '' });
      }
      // Insert new word after the header
      this.vocabulary.general.splice(1, 0, newWord);
    }

    this.saveVocabulary();
    this.closeAddWordModal();
  }

  checkAnswer() {
    if (!this.currentTestWord) return;

    const userAnswer = this.answerInput.toLowerCase().trim();
    const correctAnswer = this.currentTestWord.english.toLowerCase();

    if (userAnswer === correctAnswer) {
      alert('Correct!');
      this.correctlyAnsweredWords.add(this.currentTestWord.italian);
    } else {
      alert(
        `Incorrect. The correct answer is: ${this.currentTestWord.english}`
      );
    }

    // Clear input and display new word
    this.answerInput = '';
    this.displayRandomWord();
  }

  importCSV() {
    this.fileInput.nativeElement.click();
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
      let currentCategory = 'general';

      lines.forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        if (trimmedLine.toUpperCase().includes('VERBS:')) {
          currentCategory = 'verbs';
          return;
        } else if (trimmedLine.toUpperCase().includes('VOCAB:')) {
          currentCategory = 'general';
          return;
        }

        const [italian, english] = trimmedLine
          .split(',')
          .map((field: string) => field?.trim() || '');
        if (!italian || !english) return;

        const isDuplicate = Object.values(this.vocabulary).some((words) =>
          words.some(
            (existingWord: VocabularyWord) =>
              existingWord.italian.toLowerCase() === italian.toLowerCase() ||
              existingWord.english.toLowerCase() === english.toLowerCase()
          )
        );

        if (!isDuplicate) {
          this.vocabulary[currentCategory as keyof VocabularyData].push({
            italian,
            english,
          });
        }
      });

      this.saveVocabulary();
      alert('Import completed successfully!');
    };
    reader.readAsText(file);
  }

  async exportCSV() {
    let csvContent = '';

    if (this.vocabulary.verbs.length > 0) {
      csvContent += 'VERBS:\n';
      this.vocabulary.verbs.forEach((word) => {
        if (word.italian !== 'VERBS:') {
          csvContent += `${word.italian},${word.english}\n`;
        }
      });
    }

    if (this.vocabulary.general.length > 0) {
      csvContent += 'VOCAB:\n';
      this.vocabulary.general.forEach((word) => {
        if (word.italian !== 'VOCAB:') {
          csvContent += `${word.italian},${word.english}\n`;
        }
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });

    try {
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
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export was cancelled or failed.');
    }
  }

  clearVocabulary() {
    if (
      confirm(
        'Are you sure you want to clear all vocabulary? This cannot be undone.'
      )
    ) {
      this.vocabulary = { verbs: [], general: [] };
      this.saveVocabulary();
      alert('All vocabulary has been cleared.');
    }
  }

  deleteRow(category: string, index: number) {
    if (confirm('Are you sure you want to delete this word?')) {
      this.vocabulary[category as keyof VocabularyData].splice(index, 1);
      this.saveVocabulary();
    }
  }

  private saveVocabulary() {
    localStorage.setItem('vocabulary', JSON.stringify(this.vocabulary));
  }

  // Helper methods for template
  getFilteredWords(category: string): VocabularyWord[] {
    return this.vocabulary[category as keyof VocabularyData] || [];
  }

  isHeaderRow(word: VocabularyWord): boolean {
    return word.italian === 'VERBS:' || word.italian === 'VOCAB:';
  }

  hasWords(category: string): boolean {
    return (
      this.vocabulary[category as keyof VocabularyData] &&
      this.vocabulary[category as keyof VocabularyData].length > 0
    );
  }
}
