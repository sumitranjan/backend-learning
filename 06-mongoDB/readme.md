## Important Mongoose Methods ⭐⭐⭐

// Create
Model.create(data);

// Read all
Model.find();

// Read filtered
Model.find(filter);

// Read one
Model.findOne(filter);

// Read by ID
Model.findById(id);

// Update
Model.findByIdAndUpdate(
id,
data,
{
returnDocument: "after",
runValidators: true
}
);

// Delete
Model.findByIdAndDelete(id);

### Practice

#### Product schema:

name
→ String
→ required
→ trim

price
→ Number
→ required
→ min 0

category
→ String
→ required

inStock
→ Boolean
→ default true

timestamps
→ true

Create these APIs:
POST /api/v1/products
GET /api/v1/products
GET /api/v1/products/:id
PATCH /api/v1/products/:id
DELETE /api/v1/products/:id

Use these Mongoose methods:
POST
→ Product.create()

GET all
→ Product.find()

GET one
→ Product.findById()

PATCH
→ Product.findByIdAndUpdate()

DELETE
→ Product.findByIdAndDelete()

Also handle:
Product not found
→ 404

Successful creation
→ 201

Successful read/update/delete
→ 200

Database/Mongoose error
→ next(error)

## 1-Minute Revision ⭐⭐⭐

MongoDB
→ NoSQL document database

BSON
→ MongoDB document storage format

Mongoose
→ ODM for MongoDB + Node.js

ODM
→ Object Document Mapper

mongoose.connect()
→ Connect application to MongoDB

Schema
→ Document blueprint/rules

Model
→ Interface for CRUD/query operations

Create:
Model.create()

Read:
Model.find()
Model.findOne()
Model.findById()

Update:
Model.findByIdAndUpdate()

Delete:
Model.findByIdAndDelete()

find()
→ Array

findOne()
→ Document or null

findById()
→ Search \_id

timestamps: true
→ createdAt + updatedAt

runValidators: true
→ Run update validators

Typical architecture:

Client
↓
Express
↓
Middleware
↓
Router
↓
Controller
↓
Service
↓
Mongoose Model
↓
MongoDB

Response:

MongoDB
↓
Mongoose
↓
Service
↓
Controller
↓
HTTP Response
↓
Client
