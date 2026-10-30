import React, { StrictMode, useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'Чистый код',
    author: 'Роберт Мартин',
    year: 2008,
    genre: 'Программирование',
    price: 1850,
    rating: 4.8,
    snippet: 'Создание, анализ и рефакторинг чистого и поддерживаемого программного кода.',
    description: 'Даже плохой программный код может работать. Однако если код не является «чистым», это неизменно приведет к деградации структуры проекта. Эта книга полна реальных примеров того, как писать красивый, надежный и расширяемый код.',
    icon: '💻',
  },
  {
    id: 2,
    title: 'Паттерны объектно-ориентированного проектирования',
    author: 'Банда четырех (GoF)',
    year: 1994,
    genre: 'Архитектура ПО',
    price: 2400,
    rating: 4.9,
    snippet: 'Классический каталог 23 фундаментальных шаблонов проектирования программных систем.',
    description: 'В книге описаны простые и элегантные решения типовых задач, возникающих в объектно-ориентированном программировании. Паттерны разделены на порождающие, структурные и поведенческие.',
    icon: '🏛️',
  },
  {
    id: 3,
    title: 'JavaScript: Исчерпывающее руководство',
    author: 'Дэвид Флэнаган',
    year: 2021,
    genre: 'Веб-разработка',
    price: 3100,
    rating: 4.7,
    snippet: 'Седьмое издание «Библии JavaScript» с глубоким разбором современного стандарта ES2020+.',
    description: 'Исчерпывающее руководство по языку JavaScript и платформам веб-браузеров. Охватывает синтаксис, структуры данных, замыкания, прототипы, асинхронное программирование и работу с DOM.',
    icon: '⚡',
  },
  {
    id: 4,
    title: 'Выразительный JavaScript',
    author: 'Марейн Хавербеке',
    year: 2018,
    genre: 'Веб-разработка',
    price: 1600,
    rating: 4.6,
    snippet: 'Погружение в язык программирования и современное веб-окружение.',
    description: 'Книга учит мыслить как программист, структурировать код, работать с функциональными конструкциями и браузерными API на наглядных практических проектах.',
    icon: '🚀',
  },
];

function BookCard({ book, onSelect }) {
  return (
    <article
      data-testid="book-card"
      className="book-card"
      onClick={() => onSelect(book)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(book);
        }
      }}
    >
      <div className="book-cover">{book.icon}</div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <span className="book-author">{book.author}</span>
        <p className="book-snippet">{book.snippet}</p>
        <div className="book-footer">
          <span className="book-price">{book.price} ₽</span>
          <span className="book-rating">★ {book.rating}</span>
        </div>
      </div>
    </article>
  );
}

function BookModal({ isOpen, book, onClose }) {
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const activeBook = book || INITIAL_BOOKS[0];

  return (
    <div
      data-testid="book-modal"
      className={isOpen ? 'modal-backdrop book-modal-visible' : 'book-modal-hidden'}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div className="modal-dialog">
        <header className="modal-header">
          <h2 className="modal-title">{activeBook.title}</h2>
          <button
            type="button"
            data-testid="modal-close"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </header>

        <div className="modal-body">
          <div className="modal-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Автор:</span>
              <span className="meta-value">{activeBook.author}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Жанр:</span>
              <span className="meta-value">{activeBook.genre}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Год издания:</span>
              <span className="meta-value">{activeBook.year}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Рейтинг:</span>
              <span className="meta-value">★ {activeBook.rating} / 5.0</span>
            </div>
          </div>

          <p className="modal-description">{activeBook.description}</p>

          <div className="modal-actions">
            <button type="button" className="button-primary" onClick={onClose}>
              Купить за {activeBook.price} ₽
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenBook = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <h1 className="catalog-title">Книжный интернет-магазин</h1>
        <p className="catalog-subtitle">
          Выберите книгу из каталога для просмотра подробной информации
        </p>
      </header>

      <section className="books-grid">
        {INITIAL_BOOKS.map((book) => (
          <BookCard key={book.id} book={book} onSelect={handleOpenBook} />
        ))}
      </section>

      <BookModal
        isOpen={isModalOpen}
        book={selectedBook}
        onClose={handleCloseModal}
      />
    </div>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
