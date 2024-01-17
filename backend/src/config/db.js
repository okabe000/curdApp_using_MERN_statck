const mongoose = require('mongoose');
const debug = require('debug')('app:database');

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_curd_app', {
        });
        debug('Database connected successfully');
    } catch (error) {
        debug('Database connection error:', error);
        throw error;
    }
};

module.exports = connectDatabase;
