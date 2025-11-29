#!/bin/bash

# Usage: ./scripts/post_report_to_github.sh <ISSUE_NUMBER> <REPORT_PATH>
# Example: ./scripts/post_report_to_github.sh 84 test-results/issue-84/REPORT.md

ISSUE_NUMBER=$1
REPORT_PATH=$2

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check arguments
if [ -z "$ISSUE_NUMBER" ] || [ -z "$REPORT_PATH" ]; then
    echo -e "${RED}Error: Missing arguments.${NC}"
    echo "Usage: $0 <ISSUE_NUMBER> <REPORT_PATH>"
    exit 1
fi

# Check if file exists
if [ ! -f "$REPORT_PATH" ]; then
    echo -e "${RED}Error: Report file not found at $REPORT_PATH${NC}"
    exit 1
fi

# Check for GitHub CLI
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed.${NC}"
    echo "Please install it using: brew install gh"
    echo "Then authenticate using: gh auth login"
    exit 1
fi

echo "Posting report to Issue #$ISSUE_NUMBER..."

# Post the report as a comment
# We wrap it in a details block to keep the issue clean, or just post it directly.
# Let's post directly but maybe add a header.
gh issue comment "$ISSUE_NUMBER" --body-file "$REPORT_PATH"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Successfully posted report to Issue #$ISSUE_NUMBER${NC}"
else
    echo -e "${RED}Failed to post report.${NC}"
    exit 1
fi

echo "Tagging Issue #$ISSUE_NUMBER as FIXED..."

# Add FIXED label (ensure it exists or just add it, gh handles it usually if it exists in repo)
gh issue edit "$ISSUE_NUMBER" --add-label "FIXED"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Successfully labeled Issue #$ISSUE_NUMBER as FIXED${NC}"
else
    echo -e "${RED}Failed to label issue.${NC}"
    exit 1
fi

echo -e "${GREEN}Done!${NC}"
