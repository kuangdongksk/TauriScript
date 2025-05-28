import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Welcome to Tauri + React</h1>

      <div className="flex justify-center items-center gap-8 mb-8">
        <a href="https://vitejs.dev" target="_blank" className="hover:scale-110 transition-transform">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank" className="hover:scale-110 transition-transform">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" className="hover:scale-110 transition-transform">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Click on the Tauri, Vite, and React logos to learn more.
      </p>

      <form
        className="flex gap-4 mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors"
        >
          Greet
        </button>
      </form>
      <p className="text-gray-600 dark:text-gray-300">{greetMsg}</p>
    </main>
  );
}

export default App;