# Odin Shopping Cart

A shopping cart application built with React and Vite as part of The Odin Project curriculum.

## Installation

1. Scaffold the project with Vite:

   ```bash
   npm create vite@latest odin-shopping-cart -- --template react
   ```

2. Install Vitest:

   ```bash
   npm install vitest --save-dev
   ```

3. Install jsdom to provide a browser environment for testing:

   ```bash
   npm install jsdom --save-dev
   ```

4. Install React Testing Library and jest-dom matchers:

   ```bash
   npm install @testing-library/react @testing-library/jest-dom --save-dev
   ```

5. Install Testing Library DOM utilities:

   ```bash
   npm install @testing-library/dom --save-dev
   ```

6. Install user-event for simulating user interactions in tests:

   ```bash
   npm install @testing-library/user-event --save-dev
   ```

## Configuration

### vite.config.js

Added the `test` configuration block to enable Vitest with jsdom and global test functions:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
  },
});
```

### tests/setup.js

Created a test setup file that registers jest-dom matchers and runs cleanup after each test:

```js
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### package.json

Added the test script:

```json
"scripts": {
  "test": "vitest"
}
```

## Project Structure

```
odin-shopping-cart/
├── public/
├── src/
│   ├── components/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── assets/
│   ├── index.css
│   └── main.jsx
├── tests/
│   ├── setup.js
│   └── components/
│       └── App.test.jsx
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on the project |
| `npm run test` | Run tests with Vitest |
