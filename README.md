ExecuLens - Code Execution Visualizer

ExecuLens is an interactive code visualization tool that helps developers understand program execution step-by-step. It provides real-time visualization of variable states, call stack, and execution flow.

✨ Features
Step-by-step execution with variable tracking

Visual debugging with breakpoint support

Multi-language support (JavaScript, Python)

Execution timeline for navigation

Variable inspector showing current state

Call stack visualization

Output console for program results

Adjustable execution speed

🛠 Tech Stack
Frontend: React.js

Code Editor: Monaco Editor (VS Code's editor)

JavaScript Parsing: Esprima

Python Parsing: Babel Parser

AST Traversal: Babel Traverse

Styling: CSS Modules

Build Tool: Create React App

🚀 Setup Instructions
Prerequisites
Node.js (v14+)

npm or yarn

Installation
Clone the repository:

bash
Copy
git clone https://github.com/anubhavg23/Execulens.git
cd Execulens
Install dependencies:

bash
Copy
npm install
# or
yarn install
Start the development server:

bash
Copy
npm start
# or
yarn start
Open http://localhost:3000 in your browser.

Building for Production
bash
Copy
npm run build
# or
yarn build
📖 How to Use
Write or paste code in the editor

Set breakpoints by clicking in the gutter

Control execution:

▶️ Run: Execute until completion or next breakpoint

⏸ Pause: Stop execution

⏭ Step: Execute next step

🔄 Reset: Clear execution state

Adjust speed with the slider

Navigate execution using the timeline

Inspect variables and call stack in real-time

📂 Project Structure
Copy
ExecuLens/
├── src/
│   ├── components/       # React components
│   ├── App.js            # Main application
│   ├── App.css           # Global styles
│   ├── index.js          # Entry point
│   └── ...               # Other configuration files
├── public/              # Static assets
└── package.json         # Project dependencies
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request
