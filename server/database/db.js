import mongoose  from 'mongoose';

const Connection = async (username = 'himanshu23', password = 'qwerty%40123') => {
    const URL = `mongodb+srv://${username}:${password}@google-docs-clone.czwbw.mongodb.net/?retryWrites=true&w=majority&appName=google-docs-clone`;

    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('Database connected successfully');
    } catch (error) {   
        console.log('Error while connecting with the database ', error);
    }
}

export default Connection;