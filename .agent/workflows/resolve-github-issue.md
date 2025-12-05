---
description: Resolve GitHub issues with automated testing and PR creation
---

# Workflow: Resolve GitHub Issue

This workflow guides you through the complete process of resolving a GitHub issue, from retrieval to pull request creation.

## Prerequisites
- GitHub CLI (`gh`) installed and authenticated
- Maestro installed for E2E testing
- Git configured with proper credentials
- Access to the repository

## Steps

### 1. Retrieve Issue Information
```bash
gh issue view <ISSUE_NUMBER> --json title,body,labels,assignees,comments
```
Review the issue details to understand:
- What needs to be fixed/implemented
- Any specific requirements or constraints
- Related discussions in comments

### 2. Create Feature Branch from Release
```bash
git fetch origin
git checkout release
git pull origin release
git checkout -b issue-<ISSUE_NUMBER>
```

### 3. Review Current Code
Examine the relevant files mentioned in the issue:
- Understand the current implementation
- Identify the root cause (for bugs)
- Determine the scope of changes needed

### 4. Create Implementation Plan
Document your approach:
- Files that need to be modified
- New files to be created
- Testing strategy
- Potential risks or breaking changes

### 5. Execute the Plan
Make the necessary code changes:
- Implement the fix or feature
- Follow existing code patterns and conventions
- Add comments for complex logic
- Ensure code quality and readability

### 6. Test with Maestro
Create or update Maestro test flows for the issue:

```bash
# Create test flow if needed
mkdir -p .maestro/flows
# Edit .maestro/flows/issue-<ISSUE_NUMBER>.yaml
```

Run Maestro tests in a loop until all pass:
```bash
# Start the app first (in separate terminal)
npm start

# Build and install on device
npm run android  # or npm run ios

# Run Maestro test with continuous monitoring
maestro test .maestro/flows/issue-<ISSUE_NUMBER>.yaml --format junit --output test-results/issue-<ISSUE_NUMBER>
```

Review the test results and logs:
- Check for any failures
- Verify all acceptance criteria are met
- If tests fail, debug and fix issues, then re-test

### 7. Generate Test Report
Create a comprehensive test report:
```bash
mkdir -p test-results/issue-<ISSUE_NUMBER>
# Generate report with screenshots
```

The report should include:
- Test execution summary
- Screenshots of key flows
- Any issues encountered and resolved
- Confirmation of fix

### 8. Commit Changes
```bash
git add .
git commit -m "Fix issue #<ISSUE_NUMBER>: <brief description>

- <detail 1>
- <detail 2>
- <detail 3>

Tested with Maestro E2E tests.
Closes #<ISSUE_NUMBER>"
```

### 9. Push Branch
```bash
git push origin issue-<ISSUE_NUMBER>
```

### 10. Create Pull Request
```bash
gh pr create \
  --base release \
  --head issue-<ISSUE_NUMBER> \
  --title "Fix issue #<ISSUE_NUMBER>: <brief description>" \
  --body "## Description
Fixes #<ISSUE_NUMBER>

## Changes Made
- <change 1>
- <change 2>

## Testing
- [x] Maestro E2E tests pass
- [x] Manual testing completed

## Test Results
See test-results/issue-<ISSUE_NUMBER>/REPORT.md for detailed test report.

## Screenshots
<attach relevant screenshots>"
```

### 11. Post Test Report to Issue
```bash
gh issue comment <ISSUE_NUMBER> --body "## Test Results

E2E testing completed successfully. See full report in PR #<PR_NUMBER>.

### Summary
- ✅ All test cases passed
- ✅ Fix verified on <device/platform>

<attach key screenshots or summary>"
```

### 12. Apply Labels
```bash
gh issue edit <ISSUE_NUMBER> --add-label "FIXED"
gh pr edit <PR_NUMBER> --add-label "ready-for-review"
```

## Notes

- **Continuous Testing**: Keep Maestro running and monitoring during development to catch issues early
- **Test-Driven**: Write or update Maestro tests before implementing the fix when possible
- **Documentation**: Update relevant documentation if the changes affect user-facing features or APIs
- **Breaking Changes**: If the fix introduces breaking changes, clearly document them in the PR
- **Rollback Plan**: Consider and document how to rollback if issues are discovered after merge

## Common Issues

**Issue**: Maestro tests fail intermittently
- **Solution**: Add appropriate wait times, check for element visibility, ensure app is in correct state

**Issue**: Merge conflicts with release branch
- **Solution**: Rebase on latest release: `git fetch origin && git rebase origin/release`

**Issue**: Cannot push to remote
- **Solution**: Check git credentials and network connection

**Issue**: PR creation fails
- **Solution**: Ensure GitHub CLI is authenticated: `gh auth status`
