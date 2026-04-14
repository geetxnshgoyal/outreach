"use server";

import { db, admin } from "@/lib/firebase-admin";
import { auth } from "@/auth";
import Papa from "papaparse";
import { sendOutreachEmail } from "./mail";

const PARTICIPANTS_COLLECTION = "participants";
const EVENTS_COLLECTION = "events";

// Helper to convert Firebase Timestamps to serializable strings/objects
function serialize(data: any) {
  if (!data) return data;
  const serialized = { ...data };
  for (const key in serialized) {
    if (serialized[key] && typeof serialized[key].toDate === "function") {
      serialized[key] = serialized[key].toDate().toISOString();
    } else if (typeof serialized[key] === "object" && serialized[key] !== null) {
      serialized[key] = serialize(serialized[key]);
    }
  }
  return serialized;
}

export async function processCSV(eventId: string, filename: string, csvContent: string) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Get event details for verification
  const eventDoc = await db.collection(EVENTS_COLLECTION).doc(eventId).get();
  if (!eventDoc.exists) throw new Error("Event not found");
  const eventData = eventDoc.data();

  // Extract code from filename
  const match = filename.match(/(\d{7})/);
  const fileCode = match ? match[1] : null;

  if (eventData?.eventCode && fileCode !== eventData.eventCode) {
    throw new Error(`File verification failed: Code in filename (${fileCode || "None"}) does not match event code (${eventData.eventCode}).`);
  }

  // Parse CSV
  const { data, errors } = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    throw new Error("Failed to parse CSV file");
  }

  let addedCount = 0;
  const batch = db.batch();

  for (const row of data as any[]) {
    const email = row["Candidate's Email"];
    const name = row["Candidate's Name"];

    if (!email || !name) continue;

    // Firestore uniqueness check: CollectionGroup or specific composite ID
    // We'll use doc ID as email_eventId
    const participantId = `${email}_${eventId}`.replace(/[./#$\[\]]/g, "_");
    const participantRef = db.collection(PARTICIPANTS_COLLECTION).doc(participantId);

    batch.set(participantRef, {
      email,
      name,
      eventId,
      teamId: row["Team ID"] || null,
      teamName: row["Team Name"] || null,
      candidateRole: row["Candidate role"] || null,
      mobile: row["Candidate's Mobile"] || null,
      gender: row["Candidate's Gender"] || null,
      location: row["Candidate's Location"] || null,
      userType: row["User type"] || null,
      domain: row["Domain"] || null,
      course: row["Course"] || null,
      specialization: row["Specialization"] || null,
      courseType: row["Course Type"] || null,
      courseDuration: row["Course Duration"] || null,
      classGrade: row["Class/Grade"] || null,
      graduationYear: row["Year of Graduation"] || null,
      organization: row["Candidate's Organisation"] || null,
      registrationTime: row["Registration Time"] || null,
      differentlyAbled: row["Differently Abled"] || null,
      workExperience: row["Work Experience"] || null,
      regStatus: row["Reg. Status"] || null,
      refCode: row["Ref Code"] || null,
      resume: row["Resume"] || null,
      paymentStatus: row["Payment Status"] || null,
      referralCode: row["Referral Code (If Any)"] || null,
      highestQualification: row["Highest Qualification"] || null,
      portfolio: row["Portfolio/Work Samples"] || null,
      coverLetter: row["Cover Letter"] || null,
      outreachStatus: "PENDING",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    addedCount++;
  }

  await batch.commit();

  if (addedCount > 0 && eventData) {
    await sendOutreachEmail(addedCount, eventData.name);
  }

  return { addedCount, skippedCount: 0 };
}

export async function getEvents() {
  const snapshot = await db.collection(EVENTS_COLLECTION).orderBy("name").get();
  return snapshot.docs.map(doc => serialize({ id: doc.id, ...doc.data() }));
}

export async function getParticipants(filters: { eventId?: string; status?: string; search?: string }) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  let query: admin.firestore.Query = db.collection(PARTICIPANTS_COLLECTION);

  if (filters.eventId) {
    query = query.where("eventId", "==", filters.eventId);
  }
  if (filters.status) {
    query = query.where("outreachStatus", "==", filters.status);
  }

  const snapshot = await query.orderBy("createdAt", "desc").get();
  let participants = snapshot.docs.map(doc => serialize({ id: doc.id, ...doc.data() }));

  // Firestore doesn't support complex OR / string contain queries easily without external indexing
  // We'll filter in memory for simplicity given the small-ish scale
  if (filters.search) {
    const search = filters.search.toLowerCase();
    participants = participants.filter((p: any) => 
      p.name?.toLowerCase().includes(search) || 
      p.email?.toLowerCase().includes(search)
    );
  }

  // Join with event names
  const eventSnapshot = await db.collection(EVENTS_COLLECTION).get();
  const eventsMap = Object.fromEntries(eventSnapshot.docs.map(d => [d.id, d.data().name]));
  
  return participants.map((p: any) => ({
    ...p,
    event: { name: eventsMap[p.eventId] || "Unknown Event" }
  }));
}

export async function updateParticipantStatus(id: string, status: string, notes?: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const updateData: any = {
    outreachStatus: status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    lastContactedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  await db.collection(PARTICIPANTS_COLLECTION).doc(id).update(updateData);
  return { success: true };
}
