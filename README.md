# SauceDemo Automation Framework

An end-to-end UI test automation framework for [SauceDemo](https://www.saucedemo.com/), built with Playwright, TypeScript, and the Page Object Model (POM). The suite covers authentication, inventory browsing, cart management, checkout, and full purchase workflows across Chromium, Firefox, and WebKit.

## Tech Stack

- [Playwright](https://playwright.dev/) — browser automation and test runner
- TypeScript
- Node.js
- Page Object Model (POM) architecture
- GitHub Actions — CI pipeline

## Project Structure

```
pages/                        # Page Object classes — one per application page
  LoginPage.ts
  InventoryPage.ts
  ProductDetailsPage.ts
  CartPage.ts
  CheckoutInformationPage.ts
  CheckoutOverviewPage.ts
  CheckoutCompletePage.ts

tests/                        # Specs grouped by feature module
  auth/                        # Login, validation, locked-out user
  inventory/                   # Product listing, sorting, product details
  cart/                        # Add/remove products, cart navigation
  checkout/                    # Customer info, order overview, order completion
  e2e/                         # Full purchase workflow + regression scenarios

.github/workflows/            # GitHub Actions CI pipeline
playwright.config.ts          # Playwright configuration (reporters, tracing, browsers)
```

Each Page Object encapsulates the locators and actions for a single page; test specs call into these objects rather than touching selectors directly, keeping the suite maintainable as the UI evolves.

## Test Coverage

| Module | Scenarios |
|---|---|
| Authentication | Valid login, invalid credentials, empty-field validation, locked-out user |
| Inventory | Product listing, sorting (price low-high / high-low), product details navigation |
| Shopping Cart | Add/remove products, cart badge accuracy, cart navigation and content integrity |
| Checkout | Customer information validation, order overview (subtotal/tax/total), order completion |
| End-to-End | Full purchase workflow (login → checkout → confirmation), logout/session regression |

The suite currently runs **39 tests** across 3 browser engines (Chromium, Firefox, WebKit).

## Getting Started

### Prerequisites

- Node.js (LTS)
- npm

### Installation

```bash
npm install
npx playwright install --with-deps
```

### Running the tests

```bash
npm test                        # run the full suite across all configured browsers
npx playwright test --project=chromium   # run against a single browser
npx playwright test tests/auth           # run a single module
npm run test:headed             # run with a visible browser
npx playwright test --ui        # interactive UI mode (step through execution)
```

### Viewing the report

Every run generates an HTML report with screenshots and traces captured automatically on failure:

```bash
npm run report
```

To inspect a failing test's trace directly:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Continuous Integration

Tests run automatically on every push and pull request to `main`/`master` via GitHub Actions (`.github/workflows/playwright.yml`). The pipeline installs dependencies, installs browser binaries, runs the full suite, and uploads the HTML report as a build artifact for review.

## Design Notes

- **Page Object Model**: each page exposes stable, typed locators and higher-level action methods (e.g. `login()`, `addProductToCart()`, `sortBy()`), keeping test specs readable and resilient to UI changes.
- **Stable locators**: `data-test` attributes are preferred where available; otherwise scoped CSS classes are used.
- **Reliability**: form-fill and data-read helpers include explicit wait/verification steps to avoid cross-browser timing flakiness (notably on WebKit).
