# ✨ Decentralized AI Content Summarizer

A modern, responsive web application that leverages the Google Gemini API to generate concise summaries of articles and text. Users can input text directly, provide a URL for content fetching, and choose from various summary formats. The application also simulates saving the result to a decentralized storage network like IPFS or Arweave, making it a great portfolio piece for Web3 and AI enthusiasts.

![Screenshot of the Summarizer](https://i.ibb.co/bjKHKxbH/image.png)

---

## 🔥 Features

*   **Dual Input Modes:** Summarize content by either pasting raw text or providing a direct URL.
*   **Customizable Summary Formats:**
    *   **Standard Summary:** A concise, well-structured paragraph.
    *   **Bulleted Key Points:** Get the most important takeaways as a clean list.
    *   **Explain Like I'm 5 (ELI5):** Simplify complex topics into easy-to-understand language.
*   **URL Content Fetching:** Automatically extracts the main content from a webpage, intelligently ignoring boilerplate like navbars and footers (powered by Gemini's RAG capabilities).
*   **Simulated Decentralized Storage:** "Save" summaries to generate a unique content hash, simulating an interaction with IPFS or Arweave.
*   **Sleek, Responsive UI:** A clean and modern interface built with Tailwind CSS, ensuring a great experience on any device.
*   **Robust User Feedback:** Features clear loading states, helpful error messages (including CORS policy explanations), and copy-to-clipboard functionality.

---

## 🛠️ Tech Stack

*   **Frontend:** React (with Hooks), TypeScript
*   **AI:** Google Gemini API (`gemini-2.5-flash-preview-04-17`) via `@google/genai` SDK
*   **Styling:** Tailwind CSS
*   **Bundling/Dev Environment:** Vite (as simulated in this environment)

---

## 🚀 Running the Project Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/iamaanahmad/D-AI-Content-Summarizer.git
    cd D-AI-Content-Summarizer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your Environment Variable:**
    *   You will need a Google Gemini API key.
    *   Create a file named `.env` in the root of the project.
    *   Add your API key to the `.env` file like this:
        ```
        API_KEY=your_google_gemini_api_key_here
        ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

The application should now be running on your local server!