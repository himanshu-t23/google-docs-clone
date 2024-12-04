import { Server } from 'socket.io';
import Connection from './database/db.js';
import { getDocument, updateDocument } from './controller/document-controller.js';

const PORT = process.env.PORT || 9000;
Connection();
const io = new Server(PORT, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('join-room', async (documentId) => {
        console.log(`Client joined room: ${documentId}`);
        socket.join(documentId);

        try {
            // Fetch or initialize document
            let document = await getDocument(documentId);
            if (!document) {
                document = await updateDocument(documentId, ""); // Create a new document
            }

            socket.emit('load-document', document.data);

            socket.on('send-changes', (delta) => {
                socket.broadcast.to(documentId).emit('receive-changes', delta);
            });

            socket.on('save-document', async (data) => {
                await updateDocument(documentId, data);
            });
        } catch (error) {
            console.error("Error handling join-room:", error);
            socket.emit('load-document', "Error loading document.");
        }
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});
