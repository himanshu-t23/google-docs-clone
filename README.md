Google Docs Clone
This project is a real-time collaborative text editor, just like Google Docs, where multiple users can edit a document simultaneously and see updates in real-time. It uses the following technologies to bring everything together:

React (Frontend):
The user interface (UI) is built using React. It provides a sleek and responsive text editor for users to type and edit their content.

Node.js (Backend):
The server is powered by Node.js, which handles all the requests from the frontend, processes them, and communicates with the database and other users.

Socket.IO (Real-Time Communication):
Socket.IO enables real-time collaboration. When one user makes changes to a document, those changes are instantly reflected for all other users editing the same document.

MongoDB (Database):
All the documents and their content are stored in a MongoDB database. This ensures that users' data is saved and can be accessed or edited later.

How It Works:
A user opens the app and selects or creates a new document.
If multiple users open the same document, they can edit it at the same time. Changes made by one user appear in real-time for others.
The backend server syncs all updates to ensure everyone is always working with the latest version of the document.
Documents are saved in MongoDB, so users can revisit and continue editing anytime.
