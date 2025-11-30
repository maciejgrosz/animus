# Quick Start: Create GitHub Issues

## Step 1: Authenticate with GitHub

```bash
gh auth login
```

Follow the prompts:
1. Select: **GitHub.com**
2. Protocol: **HTTPS**
3. Authenticate: **Login with a web browser** (recommended)
4. Copy the one-time code and paste it in your browser

## Step 2: Verify Authentication

```bash
gh auth status
```

You should see: `✓ Logged in to github.com`

## Step 3: Create All 20 Issues

```bash
./scripts/create-github-issues.sh
```

This will create all 20 tasks as GitHub issues in about 30 seconds.

## Step 4: View Your Issues

```bash
# List all issues
gh issue list

# Or open in browser
open https://github.com/maciejgrosz/animus/issues
```

## Alternative: Create Issues One by One

If you prefer manual control:

```bash
# Create just the first critical issue
gh issue create \
  --title "🚨 Fix Three.js Memory Leaks & Cleanup" \
  --label "bug,performance,critical" \
  --body "$(cat <<'EOF'
## Problem
Memory leaks when switching Three.js presets.

## Files to Fix
- src/core/three_presets/zippyZaps.js (creates own renderer)
- src/core/engine/init.js
- src/core/VisualCanvas.jsx

## Tasks
- [ ] Standardize to singleton renderer
- [ ] Fix cleanup in all presets
- [ ] Add memory profiling

**Effort**: 2-3 days
**Priority**: Critical

See ROADMAP.md for full details.
EOF
)"
```

## Copilot Integration

Once issues are created, you can work with Copilot:

1. **Reference issues in commits**:
   ```bash
   git commit -m "fix: dispose materials properly (#1)"
   ```

2. **Ask Copilot to help with specific issues**:
   - "Help me fix issue #1"
   - "Show me the code for issue #5"
   - "Create a PR for issue #3"

3. **Auto-close issues**:
   ```bash
   git commit -m "fix: memory leak resolved
   
   Closes #1"
   ```

## Troubleshooting

**If authentication fails:**
```bash
# Clear existing auth
gh auth logout

# Login again
gh auth login
```

**If script fails:**
```bash
# Check you're in the right directory
pwd  # Should show: /Users/maciejgroszyk/repos/animus

# Check script is executable
ls -l scripts/create-github-issues.sh

# Make executable if needed
chmod +x scripts/create-github-issues.sh
```

---

## Ready to Start?

Run this now:
```bash
gh auth login
```

Then come back and run:
```bash
./scripts/create-github-issues.sh
```
