# Amazon Seller Integration Platform

A full-stack application that allows users to connect their Amazon Seller accounts through OAuth 2.0 authentication. This platform enables secure integration with Amazon's Selling Partner API, providing a seamless experience for managing seller accounts across different marketplaces.

## Features

- OAuth 2.0 integration with Amazon Seller Central
- Support for multiple Amazon marketplaces:
  - North America
  - Europe
  - Far East
  - India
- Secure token management and automatic refresh
- Modern, responsive UI built with React and Ant Design
- RESTful API architecture with Express.js
- MongoDB for persistent storage
- Environment-based configuration

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Project Structure

```
├── backend/                 # Backend server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── index.js        # Server entry point
│   └── package.json
│
└── frontend/               # Frontend application
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/         # Page components
    │   └── App.js         # Main application component
    └── package.json
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:

```env
# Amazon OAuth Configuration
AMAZON_CLIENT_ID=your_client_id_here
AMAZON_CLIENT_SECRET=your_client_secret_here
AMAZON_REDIRECT_URI=http://localhost:5000/api/amazon/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/your_database_name

# Server Configuration
PORT=5000
NODE_ENV=development
```

4. Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:

```bash
npm start
```

## Amazon Seller Central Setup

To use this application, you need to register it in Amazon Seller Central:

1. Go to [Amazon Seller Central Developer Console](https://sellercentral.amazon.com/apps/develop)
2. Click "Create New App"
3. Fill in the required information:
   - App Name: Your application name
   - App Description: Brief description of your application
   - App Logo: Your application logo
4. Under "OAuth Configuration":
   - Add your redirect URI: `http://localhost:5000/api/amazon/callback`
   - Select the required scopes for your application
5. Save the Client ID and Client Secret for your `.env` file

## Environment Variables

### Backend (.env)

| Variable             | Description                           | Example                                          |
| -------------------- | ------------------------------------- | ------------------------------------------------ |
| AMAZON_CLIENT_ID     | Your Amazon application client ID     | amzn1.application-oa2-client.1234567890abcdef    |
| AMAZON_CLIENT_SECRET | Your Amazon application client secret | abcdef1234567890abcdef1234567890abcdef1234567890 |
| AMAZON_REDIRECT_URI  | OAuth callback URL                    | http://localhost:5000/api/amazon/callback        |
| FRONTEND_URL         | URL of your frontend application      | http://localhost:3000                            |
| MONGODB_URI          | MongoDB connection string             | mongodb://localhost:27017/your_database_name     |
| PORT                 | Backend server port                   | 5000                                             |
| NODE_ENV             | Environment mode                      | development                                      |

### Frontend (.env)

| Variable          | Description     | Example                   |
| ----------------- | --------------- | ------------------------- |
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

## API Endpoints

### Amazon OAuth

- `GET /api/amazon/auth-url`: Get Amazon authorization URL

  - Query Parameters:
    - `region`: Marketplace region (na, eu, fe, in)
  - Response: `{ authUrl: string }`

- `GET /api/amazon/callback`: OAuth callback endpoint

  - Query Parameters:
    - `code`: Authorization code
    - `selling_partner_id`: Amazon seller ID
    - `marketplace_id`: Amazon marketplace ID

- `POST /api/amazon/refresh-token/:sellerId`: Refresh access token
  - URL Parameters:
    - `sellerId`: Amazon seller ID
  - Response: `{ success: boolean }`

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Style

The project uses ESLint and Prettier for code formatting. To check your code:

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Security Considerations

1. Never commit `.env` files to version control
2. Keep your Amazon OAuth credentials secure
3. Use HTTPS in production
4. Implement rate limiting for API endpoints
5. Validate and sanitize all user inputs
6. Use secure session management
7. Implement proper error handling

## Production Deployment

For production deployment:

1. Update environment variables with production values
2. Set up a production MongoDB instance
3. Configure proper CORS settings
4. Set up SSL/TLS certificates
5. Use a process manager (e.g., PM2)
6. Set up proper logging and monitoring
7. Configure backup strategies

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure CORS is properly configured in the backend
   - Check that frontend and backend URLs match

2. **MongoDB Connection Issues**

   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure network access is allowed

3. **OAuth Errors**
   - Verify client ID and secret
   - Check redirect URI matches Amazon configuration
   - Ensure proper scopes are requested

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact me 918057607415.
