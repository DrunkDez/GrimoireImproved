-- Create Wonder table
CREATE TABLE "Wonder" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "backgroundCost" TEXT,
  "arete" INTEGER,
  "quintessence" INTEGER,
  "spheres" JSONB,
  "pageRef" TEXT,
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "Wonder_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create CharacterWonder junction table
CREATE TABLE "CharacterWonder" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "characterId" TEXT NOT NULL,
  "wonderId" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "CharacterWonder_characterId_fkey" FOREIGN KEY ("characterId") 
    REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CharacterWonder_wonderId_fkey" FOREIGN KEY ("wonderId") 
    REFERENCES "Wonder"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX "Wonder_category_idx" ON "Wonder"("category");
CREATE INDEX "Wonder_userId_idx" ON "Wonder"("userId");
CREATE INDEX "Wonder_name_idx" ON "Wonder"("name");
CREATE INDEX "CharacterWonder_characterId_idx" ON "CharacterWonder"("characterId");
CREATE INDEX "CharacterWonder_wonderId_idx" ON "CharacterWonder"("wonderId");

-- Create unique constraint
CREATE UNIQUE INDEX "CharacterWonder_characterId_wonderId_key" 
  ON "CharacterWonder"("characterId", "wonderId");