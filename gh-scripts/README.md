# Automation Scripts

## Create GitHub Issues

This script automatically creates all 20 tasks from `ROADMAP.md` as GitHub issues.

### Prerequisites

1. **Install GitHub CLI**:
   ```bash
   brew install gh
   ```

2. **Authenticate**:
   ```bash
   gh auth login
   ```
   - Select "GitHub.com"
   - Choose "HTTPS"
   - Authenticate with your browser

### Usage

```bash
# From project root
./scripts/create-github-issues.sh
```

This will create 20 issues with:
- Proper titles with emoji
- Detailed descriptions
- Appropriate labels (bug, performance, feature, etc.)
- Effort estimates
- Implementation checklists

### Manual Alternative

If you prefer to create issues manually, you can use:

```bash
# Create a single issue
gh issue create \
  --title "🚨 Fix Three.js Memory Leaks" \
  --label "bug,performance,critical" \
  --body "See ROADMAP.md for details"
```

### View Issues

```bash
# List all issues
gh issue list

# View specific issue
gh issue view 1
```

### Integration with Copilot

Once issues are created, you can reference them in your commits and PRs:

```bash
# Commit referencing issue
git commit -m "fix: dispose geometries properly (#1)"

# Close issue from commit
git commit -m "fix: standardize renderer lifecycle

Closes #1"
```

### Labels Created

- `bug` - Something isn't working
- `performance` - Performance issues
- `critical` - Urgent fixes needed
- `refactor` - Code restructuring
- `architecture` - System design changes
- `high-priority` - Important tasks
- `medium-priority` - Regular priority
- `enhancement` - New features
- `ux` - User experience improvements
- `testing` - Test-related tasks
- `documentation` - Documentation updates
- `cleanup` - Code cleanup
- `technical-debt` - Technical debt items

### Troubleshooting

**Error: `gh: command not found`**
- Install GitHub CLI: `brew install gh`

**Error: authentication required**
- Run: `gh auth login`

**Error: repository not found**
- Make sure you're in the project directory
- Verify repo exists: `gh repo view`

### Alternative: Manual GitHub Issues

If the script doesn't work, you can:

1. Go to https://github.com/maciejgrosz/animus/issues
2. Click "New Issue"
3. Copy task details from `ROADMAP.md`
4. Add appropriate labels

### Project Management Tips

1. **Start with Critical issues** (#1-4)
2. **Use GitHub Projects** to track progress
3. **Create branches** per issue: `git checkout -b fix/issue-1`
4. **Reference issues** in commits: `git commit -m "fix: memory leak (#1)"`
5. **Use Copilot** to help implement fixes
