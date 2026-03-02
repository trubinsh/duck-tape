# DuckTape - Tools for Developers

DuckTape is a comprehensive, client-side application designed to provide essential data transformation, generation, and validation tools for developers. Built with a focus on speed and privacy, all processing is performed locally in your browser—no data is ever sent to a server.

## 🛠️ Supported Tools

### 🏗️ Structure Formatter
Easily format and minify structured data with adjustable indentation.
- **Supported Formats:** JSON, XML, HTML.
- **Features:** Instant formatting/minification, syntax highlighting, and copy-to-clipboard.

### 🔐 Encoder / Decoder
Quickly convert data between different encoding formats.
- **Base64:** Encode and decode text to/from Base64.
- **URL:** Safe URL encoding and decoding for parameters.
- **JWT Decoder:** Inspect the header and payload of JSON Web Tokens.

### 📄 Diff Viewer
Compare two pieces of text or code side-by-side.
- **Features:** Syntax highlighting for JSON, XML, and HTML, and clear visual change markers.

### 🧪 Regex Tester
Test and debug regular expressions in real-time.
- **Features:** Instant matching, visual highlighting of matches in test strings, and error reporting for invalid patterns.

### 🕒 Timestamp Converter
Convert between Unix Epoch timestamps and human-readable dates.
- **Epoch to Date:** Get local and UTC representations of a timestamp.
- **Date to Epoch:** Select a date and time to get its corresponding Unix timestamp.

### 🔑 Password Generator
Generate secure, random passwords.
- **Customizable:** Adjust length and include/exclude lowercase, uppercase, numbers, and special characters.

### 🆔 UUID Generator
Generate unique identifiers for your projects.
- **Versions:** Support for v1, v3, v4, v5, v6, and v7.
- **Bulk Generation:** Generate multiple UUIDs at once.

## 🚀 Tech Stack
- **Framework:** [React 19+](https://react.dev/) (Vite)
- **Component Library:** [Mantine 8.3](https://mantine.dev/)
- **Icons:** [Tabler Icons](https://tabler.io/icons)
- **Editor:** [CodeMirror 6](https://codemirror.net/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/trubinsh/duck-tape.git
   cd duck-tape
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```

### Build
Build the application for production:
```bash
npm run build
```

## 📂 Project Structure
- `src/pages/`: Individual tool implementations.
- `src/components/`: Reusable UI components.
- `src/lib/`: Shared utility functions and worker logic.
- `src/test/`: Unit and integration tests.

## ⚖️ License
This project is licensed under the Apache V2.0 License - see the `LICENSE` file for details.
