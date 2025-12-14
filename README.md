## 🚀 Overview

This repository demonstrates a **production-style Playwright automation framework** built with **TypeScript**, designed to automate **end-to-end and UI testing** for modern web applications.

The framework focuses on **test reliability, scalability, and maintainability**, and reflects **real-world QA automation practices** used in CI-driven Agile environments.

## ⭐ Key Features

- End-to-end automation of critical user workflows
- UI validation using Playwright’s modern locator strategies
- Scalable architecture using Page Object patterns and reusable utilities
- Type-safe test development with TypeScript
- Built-in code quality enforcement using ESLint, Prettier, and Husky
- CI/CD-ready execution for pull requests and scheduled runs

## 🧱 Framework Architecture

- **Page Objects:** Encapsulates UI interactions for better maintainability
- **Fixtures:** Manages test data and reusable setup logic
- **Config-driven execution:** Supports different environments and browsers
- **Reusable utilities:** Reduces duplication and improves readability

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/playwright-automation.git
```

Navigate to the project directory:

```bash
cd playwright-automation
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## 🏃‍♂️ Running Tests

Run all tests in headless mode:

```bash
npm run test
```

Run all tests in headed mode:

```bash
npm run test:headed
```

Run a specific test:

```bash
npx playwright test <path/to/testcase>
```

Run a specific test in headed mode:

```bash
npx playwright test <path/to/testcase> --headed
```

Run multiple tests:

```bash
npx playwright test <path/to/testcase1> <path/to/testcase2>
```

## 🔗 CI/CD Integration

This framework is designed for seamless execution in CI pipelines and can be integrated with:

- GitHub Actions
- GitLab CI
- Jenkins
- Azure DevOps

Tests can be triggered on pull requests or scheduled runs to ensure continuous quality validation.

## 📊 Generating Reports

### HTML Report

Generate an HTML report after running tests:

```bash
npm run html
```

Open the HTML report in your browser:

```bash
npm run serve:html
```

### Allure Report

Run all tests with the Allure reporter (generates `allure-results` directory):

```bash
npm run allure
```

Generate and serve the Allure report:

```bash
npm run serve:allure
```

## 🛡️ Code Quality & Pre-commit Hooks

- **Linting & Formatting:** ESLint and Prettier are enforced on every commit using Husky and lint-staged.
- **Pre-commit Hook:** Staged files are automatically linted and formatted before commit.

## 👤 Author

**Muhammad Bilal**  
**QA Automation Engineer | Web & Mobile Automation**

QA Automation Engineer with **4–5 years of hands-on experience** building and maintaining **scalable automation frameworks** using **Playwright, Cypress, and Appium**. Strong focus on CI/CD integration, code quality, and real-world test reliability.

- GitHub: https://github.com/muhammad-bilaal
- LinkedIn: https://linkedin.com/in/bilaal-rajput-17a465278

### Happy Testing 🚀
