# API Service Template

Template for creating API services with best practices.

---

## Structure

```
api-service/
├── README.md              # API documentation
├── package.json           # Node.js dependencies
├── src/
│   ├── index.js          # Entry point
│   ├── routes/           # API routes
│   │   └── index.js
│   ├── controllers/      # Route controllers
│   │   └── example.js
│   ├── middleware/       # Express middleware
│   │   ├── error.js
│   │   └── validation.js
│   └── utils/            # Utility functions
│       └── logger.js
├── tests/                # Test files
│   └── api.test.js
├── .env.example          # Environment variables template
├── .gitignore
└── .claude/
    └── CLAUDE.md         # Context for Claude
```

---

## Setup

1. Create API folder:
```bash
cp -r templates/api-service services/my-api
cd services/my-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Start development server:
```bash
npm run dev
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with hot reload |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |

---

## API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### GET /api/v1/example
Example endpoint.

**Response:**
```json
{
  "message": "Hello World",
  "data": []
}
```

---

## Best Practices

- Use environment variables for configuration
- Implement proper error handling middleware
- Add input validation
- Include request logging
- Write tests for all endpoints
- Document all routes
