const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

async function seed() {
  const data = [
    { event: 'RC Racing', manager: 'Lay', code: '1667510' },
    { event: 'CP Blindfold', manager: 'Jai', code: '1667199' },
    { event: 'She Builds', manager: 'Shrija', code: '1667183' },
    { event: 'Cad Modeling', manager: 'Atul', code: '1662293' },
    { event: 'Maze Solver', manager: 'Shaaz', code: '1662290' },
    { event: 'Bgmi', manager: 'Anant', code: '1662088' },
    { event: 'Free Fire', manager: 'Pranav', code: '1661948' },
    { event: 'Fast & Furry Workshop', manager: 'Jaidev', code: '1661911' },
    { event: 'FPV Drone', manager: 'Prashant', code: '1661904' },
    { event: 'Robo Soccer', manager: 'Izaz', code: '1661801' },
    { event: 'Next Turning', manager: 'Aryan', code: '1661493' },
    { event: 'Scripted Timeline', manager: 'Raaj', code: '1661017' },
    { event: 'Bugbash', manager: 'Nayan Raj', code: '1658793' }
  ];

  // 1. Seed Events
  for (const item of data) {
    const id = item.event.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    await db.collection('events').doc(id).set({
      name: item.event,
      eventCode: item.code,
      managerName: item.manager,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log('Seeded event:', item.event);

    // 2. Seed Manager Users
    const nameClean = item.manager.split(' ')[0].toLowerCase();
    const email = `${nameClean}@aayamfest.com`;
    const password = `${item.manager.split(' ')[0]}@123`;

    await db.collection('users').doc(email).set({
      email: email,
      password: password,
      role: 'OUTREACH',
      name: item.manager,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`Seeded user: ${email} | Password: ${password}`);
  }

  // 3. Ensure Default outreach team from .env is also in DB if needed (optional, keeping it in auth logic)
}

seed().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
