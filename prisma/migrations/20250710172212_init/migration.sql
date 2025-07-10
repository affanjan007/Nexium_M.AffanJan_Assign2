-- CreateTable
CREATE TABLE "Summary" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "urdu" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);
