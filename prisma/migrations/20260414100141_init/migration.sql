-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OUTREACH',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT,
    "teamName" TEXT,
    "candidateRole" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT,
    "gender" TEXT,
    "location" TEXT,
    "userType" TEXT,
    "domain" TEXT,
    "course" TEXT,
    "specialization" TEXT,
    "courseType" TEXT,
    "courseDuration" TEXT,
    "classGrade" TEXT,
    "graduationYear" TEXT,
    "organization" TEXT,
    "registrationTime" TEXT,
    "differentlyAbled" TEXT,
    "workExperience" TEXT,
    "regStatus" TEXT,
    "refCode" TEXT,
    "resume" TEXT,
    "paymentStatus" TEXT,
    "referralCode" TEXT,
    "highestQualification" TEXT,
    "portfolio" TEXT,
    "coverLetter" TEXT,
    "outreachStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "lastContactedAt" DATETIME,
    "eventId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_eventId_key" ON "Participant"("email", "eventId");
