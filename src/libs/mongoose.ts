import mongoose from 'mongoose';
import { env } from '../env';

export async function connectMongoDB() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(env.db.host);
}
