student-api/
│
├── src/
│ │
│ ├── controllers/
│ │ └── student.controller.js
│ │
│ ├── routes/
│ │ └── student.routes.js
│ │
│ ├── middleware/
│ │ └── logger.middleware.js
│ │
│ └── app.js
│
├── server.js
└── package.json

```let students = [
  {
    id: 1,
    name: "A",
    course: "BCA"
  },
  {
    id: 2,
    name: "B",
    course: "BBA"
  }
];
```

GET /api/v1/students
GET /api/v1/students/:id
POST /api/v1/students
PATCH /api/v1/students/:id
DELETE /api/v1/students/:id

Use :
student.routes.js
→ Routes only

student.controller.js
→ CRUD logic

logger.middleware.js
→ Log HTTP method + URL

app.js
→ Configure Express

server.js
→ Start server
