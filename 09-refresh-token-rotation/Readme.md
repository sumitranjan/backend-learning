RefreshToken
│
├── userId - Who owns this refresh token
├── tokenHash - hash(refreshToken)
├── familyId - Identifies the refresh-token chain.
| Family A : A → B → C → D
├── expiresAt - When the refresh token expires
├── usedAt - When this refresh token was rotated. A : usedAt = 2026-10-21...,
| This lets us detect reuse.
├── revokedAt - If the token or its family has been revoked: revokedAt != null
├── createdAt
└── replacedByTokenHash : Optional but useful for tracing the rotation chain.
A : replacedBy = B
