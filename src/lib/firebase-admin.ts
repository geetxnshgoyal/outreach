import admin from "firebase-admin";

const initAdmin = () => {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.warn("FIREBASE ENVIRONMENT VARIABLES MISSING - Database will not be available.");
      return null;
    }

    try {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    } catch (error) {
      console.error("FIREBASE INITIALIZATION ERROR:", error);
      return null;
    }
  }
  return admin.app();
};

export const getDb = () => {
  initAdmin();
  return admin.firestore();
};

// For backward compatibility with existing imports
export const db = admin.apps.length ? admin.firestore() : null;

export { admin };
