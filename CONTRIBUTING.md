# Contributing to Idara

Thank you for your interest in contributing to Idara! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/idara-mvp.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test your changes: `npm run dev`
7. Commit: `git commit -m "feat: description of your change"`
8. Push: `git push origin feature/your-feature-name`
9. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- A Google Gemini API key ([Get one free](https://aistudio.google.com/apikey))

### Environment

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

### Running Locally

```bash
npm run dev
```

## Code Style

- We use ESLint for linting — run `npm run lint` before submitting
- Follow existing code patterns and naming conventions
- Use functional React components with hooks
- Keep components focused and single-responsibility

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

## Areas for Contribution

- Multi-language transcription support
- UI/UX improvements
- Accessibility enhancements
- Performance optimization
- Documentation
- Testing
- New export formats (PDF, DOCX)
- Flashcard generation feature

## Questions?

Open an issue or reach out to the team. We're happy to help!
