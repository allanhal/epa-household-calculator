-- CreateTable
CREATE TABLE "Household" (
    "id" SERIAL NOT NULL,
    "energyId" INTEGER NOT NULL,
    "wasteId" INTEGER NOT NULL,

    CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Energy" (
    "id" SERIAL NOT NULL,
    "electricity" INTEGER NOT NULL DEFAULT 0,
    "naturalGas" INTEGER NOT NULL DEFAULT 0,
    "householdId" INTEGER,

    CONSTRAINT "Energy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waste" (
    "id" SERIAL NOT NULL,
    "people" INTEGER NOT NULL DEFAULT 1,
    "recyclesPaper" BOOLEAN NOT NULL DEFAULT false,
    "recyclesPlastic" BOOLEAN NOT NULL DEFAULT false,
    "recyclesMetal" BOOLEAN NOT NULL DEFAULT false,
    "recyclesGlass" BOOLEAN NOT NULL DEFAULT false,
    "householdId" INTEGER,

    CONSTRAINT "Waste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transportation" (
    "id" SERIAL NOT NULL,
    "miles" INTEGER NOT NULL DEFAULT 0,
    "mpg" INTEGER NOT NULL DEFAULT 0,
    "householdId" INTEGER,

    CONSTRAINT "Transportation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Household_energyId_key" ON "Household"("energyId");

-- CreateIndex
CREATE UNIQUE INDEX "Household_wasteId_key" ON "Household"("wasteId");

-- AddForeignKey
ALTER TABLE "Household" ADD CONSTRAINT "Household_energyId_fkey" FOREIGN KEY ("energyId") REFERENCES "Energy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Household" ADD CONSTRAINT "Household_wasteId_fkey" FOREIGN KEY ("wasteId") REFERENCES "Waste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transportation" ADD CONSTRAINT "Transportation_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;
