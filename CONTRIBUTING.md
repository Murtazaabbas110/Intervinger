# Intervinger - Contributing Guide

## Welcome Contributors!

Thank you for your interest in contributing to Intervinger! This guide will help you get started.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Submitting Changes](#submitting-changes)
6. [Coding Standards](#coding-standards)
7. [Testing](#testing)
8. [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be:

- **Respectful**: Treat all community members with respect
- **Inclusive**: Welcome people of all backgrounds and experiences
- **Professional**: Keep discussions productive and on-topic
- **Positive**: Encourage and support fellow contributors

### Expected Behavior

- Be kind and constructive in code reviews
- Accept criticism gracefully
- Focus on the code, not the person
- Help others learn and grow
- Report violations to maintainers

---

## Getting Started

### Fork & Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/Intervinger.git
cd Intervinger
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/Murtazaabbas110/Intervinger.git
```

### Find an Issue

- Look at [GitHub Issues](https://github.com/Murtazaabbas110/Intervinger/issues)
- Check for `good-first-issue` label for beginners
- Comment on issue to indicate you're working on it
- Ask questions if unclear

### Types of Contributions

- **Bug Fixes**: Fix reported issues
- **Features**: Implement new functionality
- **Documentation**: Improve or add documentation
- **Performance**: Optimize existing code
- **Tests**: Add test coverage
- **UI/UX**: Improve user interface

---

## Development Setup

### Prerequisites

- Node.js v16+
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

### Step 1: Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend (in separate terminal)
cd backend
npm install
```

### Step 2: Configure Environment

Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md) to set up environment variables.

### Step 3: Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 4: Verify Setup

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Try signing in and creating a session

---

## Making Changes

### Create Feature Branch

```bash
git checkout -b feature/my-feature-name
```

### Follow Development Practices

1. **Write Clear Commit Messages**

```bash
git commit -m "feat: Add real-time code suggestions"
```

2. **Keep Commits Atomic**
   - One logical change per commit
   - Easy to revert if needed
   - Easier to review

3. **Test Your Changes**
   - Run linter: `npm run lint`
   - Manually test functionality
   - Check console for errors

4. **Update Documentation**
   - If changing API, update API_DOCUMENTATION.md
   - If changing architecture, update ARCHITECTURE.md
   - Add inline code comments for complex logic

### Commit Message Format

```
Type: Short description (max 50 chars)

Optional detailed explanation of the change.
Explain WHY not just WHAT.

Fixes #123
Related to #456
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting/style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance/dependencies

---

## Submitting Changes

### Push to Your Fork

```bash
git push origin feature/my-feature-name
```

### Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR description:

```markdown
## Description

What does this PR do?

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing

How was this tested?

## Screenshots (if applicable)

Add UI changes screenshots

## Checklist

- [ ] Code follows style guide
- [ ] Self-reviewed code
- [ ] Tested thoroughly
- [ ] Added/updated documentation
- [ ] No new warnings generated
- [ ] Tests added/updated
```

### Code Review Process

1. Maintainers review your code
2. Address any requested changes
3. Re-request review when updated
4. Merge when approved and CI passes

### Common Review Comments

- **"Please add error handling"** → Add try/catch blocks
- **"This could be more performant"** → Optimize query/rendering
- **"Add documentation"** → Add comments/docstrings
- **"Unit tests needed"** → Add test file

---

## Coding Standards

### JavaScript/TypeScript

```javascript
// ✓ Good
async function createSession(sessionData) {
  try {
    const session = await Session.create(sessionData);
    return session;
  } catch (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }
}

// ✗ Bad
function createSession(data) {
  let session = Session.create(data);
  return session;
}
```

### React Components

```javascript
// ✓ Good - Functional component with hooks
export function SessionCard({ session, onJoin }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onJoin(session.id);
    } finally {
      setIsLoading(false);
    }
  };

  return <button onClick={handleClick}>{session.title}</button>;
}

// ✗ Bad - Class component, no error handling
class SessionCard extends Component {
  render() {
    return <button onClick={this.props.onJoin}>{this.props.session}</button>;
  }
}
```

### CSS/Tailwind

```javascript
// ✓ Good - Use Tailwind utilities
className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"

// ✗ Bad - Inline styles
style={{ backgroundColor: 'blue', padding: '8px 16px' }}
```

---

## Testing

### Unit Tests

For new functions/components, add tests:

```javascript
// __tests__/utils/helper.test.js
import { formatTime } from "../lib/utils";

describe("formatTime", () => {
  it("formats time correctly", () => {
    expect(formatTime(3661)).toBe("1h 1m 1s");
  });

  it("handles zero seconds", () => {
    expect(formatTime(0)).toBe("0s");
  });
});
```

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # Coverage report
```

### Test Coverage

- Aim for >80% code coverage
- Test happy path and error cases
- Test edge cases
- Mock external dependencies

---

## Documentation

### Update Relevant Docs

When making changes, update corresponding documentation:

- **API Changes** → `API_DOCUMENTATION.md`
- **Architecture Changes** → `ARCHITECTURE.md`
- **Feature Changes** → `FEATURES_GUIDE.md`
- **Setup Changes** → `SETUP_GUIDE.md`
- **Development Info** → `DEVELOPER_GUIDE.md`

### Code Comments

```javascript
/**
 * Validates if user is authorized for session
 * @param {string} userId - User's Clerk ID
 * @param {string} sessionId - Session ID
 * @returns {boolean} True if authorized
 */
function isAuthorized(userId, sessionId) {
  // Implementation
}
```

### README Quality

- Keep README.md up-to-date
- Add badges for build status
- Include feature screenshots
- Provide quick start guide

---

## Troubleshooting

### Common Issues

#### "My changes don't appear"

```bash
# Clear cache and restart
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### "Linter errors"

```bash
npm run lint -- --fix  # Auto-fix most issues
```

#### "Tests failing"

```bash
npm test -- --verbose  # See detailed output
# Fix failing tests before pushing
```

#### "Merge conflicts"

```bash
git fetch upstream
git rebase upstream/main
# Resolve conflicts in editor
git add .
git rebase --continue
```

---

## Release Process

### Version Numbers

Follow [Semantic Versioning](https://semver.org/):

- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes

### Release Checklist

- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Release notes written

---

## Getting Help

### Resources

- **Documentation**: Check README.md and SETUP_GUIDE.md
- **Issues**: Search existing GitHub issues
- **Discussions**: Start a GitHub discussion
- **Slack**: Join our community Slack (if available)

### Asking for Help

When stuck:

1. Check existing documentation
2. Search closed/open issues
3. Describe problem clearly
4. Share error messages
5. Provide reproducible steps

---

## Rewards & Recognition

### Contributors are recognized by:

- Mention in CONTRIBUTORS.md
- GitHub contributor badge
- Shout-out in release notes
- Special badges for significant contributions

### Types of Contributions

All contributions count:

- Code
- Documentation
- Testing
- Bug reports
- Feature suggestions
- Community support

---

## FAQ

**Q: How do I get my PR merged faster?**
A: Keep it small and focused. Add tests. Update docs. Respond to review comments quickly.

**Q: Can I work on multiple features?**
A: Yes, use separate branches: `feature/feature1` and `feature/feature2`

**Q: What if my PR gets rejected?**
A: Learn from feedback. Reopen discussion if you disagree. All feedback aims to improve the project.

**Q: How often are releases made?**
A: We aim for a release every 2-4 weeks depending on contributions.

**Q: Can I request a feature?**
A: Yes! Open an issue with the `feature-request` label and describe what you'd like.

---

## License

By contributing to Intervinger, you agree that your contributions will be licensed under the ISC License.

---

## Thank You!

Thank you for considering contributing to Intervinger. Your efforts help make this project better for everyone!

Happy coding! 🚀
