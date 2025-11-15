# Contributing to AI Coding Tools Manager

Thank you for your interest in contributing to ACTM! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help maintain a positive environment

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check if the bug has already been reported
2. Collect information about the bug:
   - Your OS and version
   - Node.js and npm versions
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

Create an issue with the "bug" label and include all relevant information.

### Suggesting Features

Feature suggestions are welcome! Please:
1. Check if the feature has been suggested
2. Explain the use case
3. Describe the desired behavior
4. Consider how it fits with existing features

### Pull Requests

#### Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/AI-Coding-Auto-Update.git
cd AI-Coding-Auto-Update

# Add upstream remote
git remote add upstream https://github.com/softctwo/AI-Coding-Auto-Update.git

# Install dependencies
npm install

# Create a branch
git checkout -b feature/my-feature
```

#### Development Workflow

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Build
npm run build
```

#### Code Guidelines

**TypeScript**
- Use TypeScript for all code
- Define proper types/interfaces
- Avoid `any` when possible
- Document complex logic

**Code Style**
- Follow ESLint rules
- Use meaningful variable names
- Keep functions focused and small
- Add comments for complex logic

**Testing**
- Write tests for new features
- Ensure existing tests pass
- Aim for high coverage
- Test edge cases

**Commits**
- Use clear, descriptive messages
- Follow conventional commits format:
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` documentation
  - `refactor:` code refactoring
  - `test:` tests
  - `chore:` maintenance

Example:
```
feat: add support for new AI tool
fix: resolve version detection issue
docs: update installation instructions
```

#### Submitting Pull Request

1. Ensure all tests pass: `npm test`
2. Update documentation if needed
3. Commit your changes
4. Push to your fork
5. Open a Pull Request

**PR Description should include:**
- What changes were made
- Why the changes were necessary
- How to test the changes
- Screenshots (if UI changes)
- Related issue number

### Adding a New Tool

To add support for a new AI coding tool:

1. Edit `src/shared/tool-definitions.ts`
2. Add tool definition:

```typescript
{
  name: 'mytool',
  displayName: 'My AI Tool',
  command: 'mytool',
  versionFlag: '--version',
  versionRegex: /(\d+\.\d+\.\d+)/,
  installMethods: {
    npm: 'mytool-cli',
    pip: 'mytool',
    brew: 'mytool',
    github: {
      owner: 'myorg',
      repo: 'mytool',
    },
  },
  configPaths: ['~/.mytool/config.json'],
  homepage: 'https://mytool.dev',
}
```

3. Test detection:
```bash
npm run dev
# Verify tool appears in the dashboard
```

4. Add tests in `src/main/services/__tests__/detector.test.ts`

5. Update README.md to include the new tool

6. Submit PR with:
   - Tool definition
   - Tests
   - Documentation update
   - Screenshot showing detection

## Project Structure

```
src/
├── main/              # Electron main process
│   ├── index.ts       # Entry point
│   ├── preload.ts     # IPC bridge
│   └── services/      # Backend services
├── renderer/          # React frontend
│   ├── App.tsx        # Main component
│   └── components/    # UI components
└── shared/            # Shared code
    ├── types.ts       # TypeScript types
    └── tool-definitions.ts  # Tool configs
```

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run specific test
npm test detector.test.ts

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Manual Testing

1. Build the app: `npm run build`
2. Package for your OS: `npm run package`
3. Install and test the packaged app
4. Test on different platforms if possible

### Test Checklist

- [ ] Tool detection works
- [ ] Version checking works
- [ ] Update functionality works
- [ ] Settings persist correctly
- [ ] UI is responsive
- [ ] Error handling works
- [ ] Cross-platform compatibility

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. GitHub Actions will build and release

## Getting Help

- **Discord**: [Join our Discord](https://discord.gg/actm)
- **Discussions**: Use GitHub Discussions
- **Email**: dev@actm.dev

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Added to CONTRIBUTORS.md

Thank you for contributing! 🎉
