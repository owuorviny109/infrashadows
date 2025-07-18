# GitHub Repository Setup for InfraShadows

This guide will help you set up a GitHub repository for the InfraShadows project with proper structure and CI/CD workflows.

## Step 1: Create a New GitHub Repository

1. Go to GitHub and sign in to your account
2. Click on the "+" icon in the top right corner and select "New repository"
3. Name the repository "infrashadows"
4. Add a description: "A civic-intelligence system for visualizing infrastructure impacts of urban development"
5. Choose "Public" or "Private" visibility as needed
6. Check "Add a README file"
7. Add a .gitignore for Node.js
8. Choose a license (e.g., MIT License)
9. Click "Create repository"

## Step 2: Clone the Repository Locally

```bash
git clone https://github.com/yourusername/infrashadows.git
cd infrashadows
```

## Step 3: Set Up Repository Structure

Create the basic directory structure:

```bash
mkdir -p frontend/src backend/src docs
```

## Step 4: Add Initial Files

1. Copy the project files into the appropriate directories
2. Create a .gitignore file with appropriate entries for Node.js projects

## Step 5: Set Up GitHub Actions for CI/CD

Create a GitHub Actions workflow file for continuous integration:

1. Create a directory for GitHub Actions workflows:

```bash
mkdir -p .github/workflows
```

2. Create a CI workflow file:

```bash
touch .github/workflows/ci.yml
```

3. Add the following content to the CI workflow file:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run frontend tests
      run: |
        cd frontend
        npm test -- --watchAll=false
    
    - name: Install backend dependencies
      run: |
        cd backend
        npm ci
    
    - name: Run backend tests
      run: |
        cd backend
        npm test

  deploy:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Build and deploy frontend
      run: |
        cd frontend
        npm ci
        npm run build
        aws s3 sync build/ s3://infrashadows-storage-dev --delete
    
    - name: Deploy backend
      run: |
        cd backend
        npm ci
        npx serverless deploy --stage dev
```

## Step 6: Set Up Branch Protection Rules

1. Go to your GitHub repository
2. Click on "Settings" > "Branches"
3. Click on "Add rule" under "Branch protection rules"
4. Enter "main" as the branch name pattern
5. Check the following options:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
6. Click "Create"

## Step 7: Add GitHub Secrets for AWS Deployment

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets" > "Actions"
3. Click "New repository secret"
4. Add the following secrets:
   - Name: AWS_ACCESS_KEY_ID
     Value: [Your AWS Access Key]
   - Name: AWS_SECRET_ACCESS_KEY
     Value: [Your AWS Secret Key]

## Step 8: Set Up Issue Templates

1. Create a directory for issue templates:

```bash
mkdir -p .github/ISSUE_TEMPLATE
```

2. Create a bug report template:

```bash
touch .github/ISSUE_TEMPLATE/bug_report.md
```

3. Add the following content:

```markdown
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows, macOS]
 - Browser: [e.g. Chrome, Safari]
 - Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

4. Create a feature request template:

```bash
touch .github/ISSUE_TEMPLATE/feature_request.md
```

5. Add the following content:

```markdown
---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''

---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## Step 9: Add a Pull Request Template

1. Create a pull request template:

```bash
touch .github/pull_request_template.md
```

2. Add the following content:

```markdown
## Description
Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context.

Fixes # (issue)

## Type of change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce.

## Checklist:
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## Step 10: Initial Commit and Push

```bash
git add .
git commit -m "Initial project setup"
git push origin main
```

## Step 11: Set Up Project Board (Optional)

1. Go to your GitHub repository
2. Click on "Projects" > "Create a project"
3. Choose "Board" as the template
4. Name it "InfraShadows Development"
5. Add columns for:
   - To Do
   - In Progress
   - Review
   - Done
6. Click "Create project"

## Step 12: Add Collaborators (Optional)

1. Go to your GitHub repository
2. Click on "Settings" > "Manage access"
3. Click "Invite a collaborator"
4. Enter the GitHub username or email address of your collaborator
5. Choose their permission level
6. Click "Add [username] to this repository"