# Contributing to CineFindr

Thank you for your interest in contributing to CineFindr! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally

2. **Set up development environment**
   - Follow the instructions in SETUP.md
   - Ensure all tests pass before making changes

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Workflow

### Making Changes

1. **Write clean code**
   - Follow existing code style
   - Use TypeScript types
   - Add comments for complex logic

2. **Test your changes**
   ```bash
   # Run unit tests
   npm run test
   
   # Run E2E tests
   npm run test:e2e
   
   # Run linting
   npm run lint
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Commit message format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

### Pull Request Process

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Requirements**
   - [ ] Tests pass
   - [ ] Code is linted
   - [ ] Documentation updated (if needed)
   - [ ] Changes described in PR

4. **Review Process**
   - Maintainers will review your PR
   - Address any feedback
   - Once approved, it will be merged

## Areas for Contribution

### High Priority
- Additional language support (i18n)
- More streaming provider integrations
- Improved recommendation algorithms
- Performance optimizations
- Accessibility improvements

### Good First Issues
- UI/UX enhancements
- Bug fixes
- Documentation improvements
- Test coverage
- Code comments

### Feature Ideas
- Watchlist functionality
- Social features (share recommendations)
- Advanced filters
- Mobile app
- Browser extension

## Code Style

### TypeScript
- Use explicit types where possible
- Avoid `any` unless absolutely necessary
- Use interfaces for object shapes
- Use enums for fixed sets of values

### React/Next.js
- Use functional components
- Use hooks appropriately
- Keep components small and focused
- Use proper file organization

### Backend/NestJS
- Follow NestJS conventions
- Use DTOs for validation
- Keep services thin
- Use proper error handling

## Testing Guidelines

### Unit Tests
- Test business logic
- Mock external dependencies
- Aim for >80% coverage
- Use descriptive test names

### E2E Tests
- Test critical user flows
- Keep tests independent
- Use proper selectors
- Clean up test data

## Documentation

When adding features:
- Update README.md if needed
- Add JSDoc comments
- Update API documentation
- Add examples if helpful

## Questions?

- Open a GitHub Discussion
- Check existing issues
- Ask in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to CineFindr! 🎉

