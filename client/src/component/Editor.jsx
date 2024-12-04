import React, { useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Box from '@mui/material/Box';
import styled from '@emotion/styled';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom'; // To extract documentId from URL

const Component = styled.div`
    background: #F5F5F5;
`;

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'] // remove formatting button
];

const Editor = () => {
    const [socket, setSocket] = useState(null);
    const [quill, setQuill] = useState(null);
    const { id } = useParams();  // Extract documentId from the URL

    useEffect(() => {
        // Initialize Quill editor
        const quillInstance = new Quill('#container', { theme: 'snow', modules: { toolbar: toolbarOptions } });
        quillInstance.disable();
        quillInstance.setText('Loading the document...');
        setQuill(quillInstance);
    }, []);

    useEffect(() => {
        // Connect to the server
        const socketInstance = io('http://localhost:9000');
        setSocket(socketInstance);

        // Emit 'join-room' event when the component mounts
        socketInstance.emit('join-room', id);  // Joining the document room

        return () => {
            socketInstance.disconnect();
        };
    }, [id]);  // The socket connection will be re-established if 'id' changes

    useEffect(() => {
        if (socket === null || quill === null) return;

        // Handle text changes in Quill and emit to the server
        const handleChange = (delta, oldData, source) => {
            if (source !== 'user') return;  // Ignore changes made programmatically
            socket.emit('send-changes', delta);
        };

        quill.on('text-change', handleChange);

        return () => {
            quill.off('text-change', handleChange);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (socket === null || quill === null) return;

        // Listen for changes from other clients and update the Quill editor
        const handleReceiveChanges = (delta) => {
            quill.updateContents(delta);
        };

        socket.on('receive-changes', handleReceiveChanges);

        return () => {
            socket.off('receive-changes', handleReceiveChanges);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (socket === null || quill === null) return;

        // Listen for the document to load when the client joins the room
        socket.once('load-document', (document) => {
            quill.setContents(document);
            quill.enable();  // Enable the editor after the document has been loaded
        });
    }, [socket, quill]);

    useEffect(() => {
        if (socket === null || quill === null) return;

        // Periodically save the document on the server
        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents());
        }, 2000);  // Save every 2 seconds

        return () => {
            clearInterval(interval);
        };
    }, [socket, quill]);

    return (
        <Component>
            <Box className='container' id='container'></Box>
        </Component>
    );
};

export default Editor;
