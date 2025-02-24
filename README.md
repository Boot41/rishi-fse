# Personal Finance Management System with AI Advisor

A comprehensive full-stack application for managing personal finances with AI-powered financial advice. Built with React, Django, and PostgreSQL.

## 🌟 Features

- **User Authentication & Authorization**
  - Secure registration and login
  - JWT-based authentication
  - Role-based access control

- **Financial Profile Management**
  - Basic profile information
  - Risk tolerance assessment
  - Financial goals tracking

- **Financial Management Suite**
  - Income tracking and categorization
  - Expense tracking and budget management
  - Investment portfolio monitoring
  - Performance analytics
  - Transaction history
  - Multi-category support
  - Automated categorization

- **AI Financial Insights**
  - Personalized financial insights
  - Smart financial health analysis
  - Custom strategy recommendations
  - Market trend analysis
  - Risk assessment reports

- **AI Investment Advisor**
  - Smart investment recommendations
  - Similar investment suggestions
  - Portfolio optimization advice
  - Risk-based investment strategies
  - Market opportunity alerts

- **AI Chatbot**
  - Interactive financial advice
  - Real-time query resolution
  - Personalized financial guidance
  - Investment strategy discussions
  - Budget planning assistance

- **Loan Analysis System**
  - AI-powered loan recommendations
  - Loan affordability analysis
  - EMI calculations and planning
  - Loan comparison tools
  - Repayment strategy optimization

- **Dashboard & Analytics**
  - Visual representation of financial data
  - Trend analysis
  - Financial health indicators
  - Custom reports and insights
  - Real-time portfolio tracking

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- TailwindCSS
- React Router
- Axios

### Backend
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Groq AI Integration

### DevOps
- Docker
- Docker Compose

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- Python 3.8+ (for local development)

### Environment Setup
1. Clone the repository
```bash
git clone <repository-url>
cd AIPOC
```

2. Create a `.env` file in the root directory with the following variables:
```env
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=db
DB_PORT=5432
SECRET_KEY=your_django_secret_key
DEBUG=True
GROQ_API_KEY=your_groq_api_key
```

### Running with Docker
1. Build and start the containers:
```bash
docker-compose up --build
```

2. The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Database: localhost:5432

### Local Development Setup

#### Backend (Django)
1. Create a virtual environment:
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```

#### Frontend (React)
1. Install dependencies:
```bash
cd client
npm install
```

2. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── validations/  # Form validation schemas
│   │   └── assets/       # Static assets
│   └── ...
├── server/                # Backend Django application
│   ├── api/
│   │   ├── views/        # API views
│   │   ├── services/     # Business logic
│   │   ├── models.py     # Database models
│   │   └── serializers.py # API serializers
│   └── ...
└── docker-compose.yml    # Docker composition config
```

## 🧪 Testing

### Backend Tests
```bash
cd server
python manage.py test
```

### Frontend Tests
```bash
cd client
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Django REST Framework](https://www.django-rest-framework.org/)
- [React](https://reactjs.org/)
- [Groq AI](https://groq.com/)
- [TailwindCSS](https://tailwindcss.com/)
