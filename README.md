# 🌌 Aurora - Elevating Task Management & Collaboration

Aurora is a modern, minimalist task management and team hangout web application designed to bring spatial depth and elegance to your daily workflow. Featuring a stunning 3D glassmorphism UI, seamless team collaboration, and a built-in AI assistant, Aurora transforms the way you organize tasks and interact with your team.

---

## ✨ Key Features

- **🎨 Minimalist 3D Glassmorphism UI**: Immerse yourself in a premium full-screen Bento Box layout with dark mode support, dynamic micro-animations, and a 3D parallax hero section.
- **📊 Smart Dashboard Analytics**: Stay organized with an intuitive dashboard that tracks total tasks, in-progress items, upcoming deadlines, and recent activity.
- **🤖 Built-In AI Assistant**: Seamlessly integrated AI chatbox (powered by OpenAI & Ollama) to help brainstorm ideas and assist with your workflow without leaving the app.
- **👥 Team Collaboration & Availability**: View real-time team availability, manage role-based invites, and explore the group gallery carousel for a social, interconnected experience.
- **⚙️ Deep Customization**: Fully personalize your workspace, update your pixel-art avatar, and manage appearance settings such as themes directly from your profile.
- **🔒 Secure Authentication**: Robust security powered by JWT and bcrypt password hashing.

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3 (Vanilla CSS with a custom Glassmorphism design system)
- JavaScript (ES6+)
- EJS (Embedded JavaScript templating)

**Backend:**
- Node.js & Express.js
- RESTful API architecture

**Database & Auth:**
- MySQL (with `mysql2` and connection pooling)
- JWT (JSON Web Tokens) for stateless authentication
- bcryptjs for secure password hashing

**AI Integrations:**
- OpenAI API
- Ollama (Local AI models)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL](https://www.mysql.com/) server running locally or remotely

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/aurora.git
   cd aurora
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following context (adjust values to match your environment):
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=aurora
   JWT_SECRET=your_super_secret_key
   OLLAMA_API_KEY=your_ollama_key
   # OPENAI_API_KEY=your_openai_key
   ```

4. **Initialize the Database:**
   Ensure you create a MySQL database named `aurora` and run the necessary SQL migrations to create the `users`, `tasks`, and `invitations` tables.

5. **Start the application:**
   - **Development mode** (requires nodemon):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```

6. **Open in Browser:**
   Navigate to `http://localhost:3000` to start exploring Aurora!

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/aurora/issues) if you have any ideas on how to improve Aurora.

## 📝 License
This project is licensed under the [ISC License](LICENSE).

---
*Crafted with precision for a seamless team experience.*
