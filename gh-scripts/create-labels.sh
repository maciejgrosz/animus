#!/bin/bash

# Create GitHub Labels for Animus Project
# Run this BEFORE creating issues

echo "🏷️  Creating GitHub labels..."

# Bug and performance
gh label create "bug" --color "d73a4a" --description "Something isn't working" --force
gh label create "performance" --color "ff6b6b" --description "Performance issues" --force
gh label create "critical" --color "b60205" --description "Urgent fixes needed" --force

# Refactoring and architecture
gh label create "refactor" --color "fbca04" --description "Code restructuring" --force
gh label create "architecture" --color "fef2c0" --description "System design changes" --force

# Priority levels
gh label create "high-priority" --color "d93f0b" --description "Important tasks" --force
gh label create "medium-priority" --color "fbca04" --description "Regular priority" --force

# Features and enhancements
gh label create "enhancement" --color "a2eeef" --description "New features" --force
gh label create "ux" --color "1d76db" --description "User experience improvements" --force
gh label create "feature" --color "0e8a16" --description "New feature request" --force

# Quality and testing
gh label create "testing" --color "bfd4f2" --description "Test-related tasks" --force
gh label create "quality" --color "d4c5f9" --description "Code quality improvements" --force
gh label create "type-safety" --color "c5def5" --description "TypeScript and type improvements" --force

# Maintenance
gh label create "documentation" --color "0075ca" --description "Documentation updates" --force
gh label create "cleanup" --color "fef2c0" --description "Code cleanup" --force
gh label create "technical-debt" --color "e99695" --description "Technical debt items" --force
gh label create "tooling" --color "bfdadc" --description "Development tools" --force
gh label create "optimization" --color "1d76db" --description "Performance optimization" --force
gh label create "maintainability" --color "c2e0c6" --description "Code maintainability" --force

echo ""
echo "✅ All labels created!"
echo ""
echo "Now you can run: ./gh-scripts/manage-issues.sh"
