PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS ShareToken;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Quote;

CREATE TABLE Quote (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  clientName TEXT,
  notes TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Product (
  id TEXT PRIMARY KEY,
  quoteId TEXT NOT NULL,
  name TEXT NOT NULL,
  shortDescription TEXT NOT NULL,
  standardizedSummary TEXT NOT NULL,
  imagePath TEXT,
  primaryImagePath TEXT,
  detailImagePaths TEXT,
  pricingTiers TEXT NOT NULL,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quoteId) REFERENCES Quote(id) ON DELETE CASCADE
);

CREATE INDEX Product_quoteId_idx ON Product(quoteId);

CREATE TABLE ShareToken (
  id TEXT PRIMARY KEY,
  quoteId TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  passwordHash TEXT,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revokedAt DATETIME,
  lastViewedAt DATETIME,
  FOREIGN KEY (quoteId) REFERENCES Quote(id) ON DELETE CASCADE
);

CREATE INDEX ShareToken_quoteId_idx ON ShareToken(quoteId);
CREATE INDEX ShareToken_expiresAt_idx ON ShareToken(expiresAt);

PRAGMA foreign_keys = ON;
