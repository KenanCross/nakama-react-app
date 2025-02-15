import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import app from "./app";

admin.initializeApp();


const mongoUri = functions.config().mongodb.uri || process.env.MONGODB_URI;

console.log("✅ Firebase Config Loaded - MONGODB_URI:", mongoUri);

export const api = functions.https.onRequest(app);
