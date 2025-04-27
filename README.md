# TimeForge Frontend

🚀 **TimeForge** is a time management and productivity application built with **Angular** and **PrimeNG** to provide a modern and efficient user experience.

## 📌 Main Features
✅ Task and project management 📋  
✅ Real-time collaboration 🧑‍🤝‍🧑  
✅ Workflow automation ⚡  
✅ Cloud synchronization ☁️  
✅ Advanced statistics and analytics 📊  

---

## 🛠️ Technologies Used
- **Angular** - Frontend framework
- **TypeScript** - Programming language
- **PrimeNG** - UI components
- **Bootstrap** - Responsive design
- **RxJS** - Asynchronous event handling

---

## 📥 Installation & Setup

### 1️⃣ Prerequisites
Make sure you have **Node.js** and **Angular CLI** installed:
```sh
node -v  # Check Node.js
npm install -g @angular/cli  # Install Angular CLI
```

### 2️⃣ Clone the Project
```sh
git clone https://github.com/your-repo/timeforge-frontend.git
cd timeforge-frontend
```

### 3️⃣ Install Dependencies
```sh
npm install
```

### 4️⃣ Run the Application
```sh
ng serve
```
Then, open **http://localhost:4200/** in your browser.

---

## 🔧 Configuration

🔹 Edit environment variables in **src/environments/**:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
};
```

🔹 Replace `apiUrl` with your backend URL.

---

## 📁 Project Structure
```
timeforge-frontend/
│── src/
│   ├── app/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Main pages
│   │   ├── services/    # API services
│   │   ├── models/      # Data models
│   ├── assets/          # Images, styles
│   ├── environments/    # Configuration
│── angular.json         # Angular configuration
│── package.json         # Dependencies
│── README.md            # Documentation
```

---

## 🚀 Deployment
To build the application for production:
```sh
ng build --prod
```
The files will be generated in `dist/timeforge-frontend/`.

---

## 👥 Contributors
👤 **Houssem Ellouze** -
👤 **Hassene Mansouri** -
👤 **Med Mansour Taleb** -
👤 **Mohamed Wassim Bahriya Lasghar** -
👤 **Mahdi Mzoughi**  
-
💡 Contributions, ideas, or improvements? Open an **issue** or submit a **pull request**!

---

## 📜 License
This project is licensed under the **MIT** License. You are free to use and modify it.

🔹 **Made with ❤️ by the TimeForge Team** 🚀

