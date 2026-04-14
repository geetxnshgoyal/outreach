const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function run() {
  const events = [
    { name: 'RC Racing', manager: 'Lay', code: '1667510' },
    { name: 'CP Blindfold', manager: 'Jai', code: '1667199' },
    { name: 'She Builds', manager: 'Shrija', code: '1667183' },
    { name: 'Cad Modeling', manager: 'Atul', code: '1662293' },
    { name: 'Maze Solver', manager: 'Shaaz', code: '1662290' },
    { name: 'Bgmi', manager: 'Anant', code: '1662088' },
    { name: 'Free Fire', manager: 'Pranav', code: '1661948' },
    { name: 'Fast & Furry Workshop', manager: 'Jaidev', code: '1661911' },
    { name: 'FPV Drone', manager: 'Prashant', code: '1661904' },
    { name: 'Robo Soccer', manager: 'Izaz', code: '1661801' },
    { name: 'Next Turning', manager: 'Aryan', code: '1661493' },
    { name: 'Scripted Timeline', manager: 'Raaj', code: '1661017' },
    { name: 'Bugbash', manager: 'Nayan Raj', code: '1658793' }
  ];

  // 1. Clear old events and users
  const eventsSnap = await db.collection('events').get();
  for (const doc of eventsSnap.docs) await doc.ref.delete();
  
  const usersSnap = await db.collection('users').get();
  for (const doc of usersSnap.docs) await doc.ref.delete();

  console.log('Cleared existing events and users.');

  // 2. Re-seed only the 13 events and their managers
  for (const item of events) {
    const eventId = item.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    const nameClean = item.manager.split(' ')[0].toLowerCase();
    const email = `${nameClean}@aayamfest.com`;
    const password = `${item.manager.split(' ')[0]}@123`;

    await db.collection('events').doc(eventId).set({
      name: item.name,
      eventCode: item.code,
      managerName: item.manager,
      managerEmail: email, // Linked for filtering
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await db.collection('users').doc(email).set({
      email: email,
      password: password,
      role: 'OUTREACH',
      name: item.manager,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Seeded: ${item.name} | Manager: ${item.manager}`);
  }
}

run().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
