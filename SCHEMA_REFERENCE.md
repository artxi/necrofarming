# Database Schemas Reference (Not for production, for dev reference only)

## Employee
- name: string (unique, required)
- active: boolean (default: true)
- departureDate: Date (optional)
- departureCause: string (enum: 'voluntary', 'fired', optional)
- createdAt: Date (auto, required)
- updatedAt: Date (auto, required)

## Player
- code: string (unique, required)
- nickname: string (optional)
- anonymous: boolean (default: false)
- picks: [Pick] (array of embedded Pick objects)
- lockedAt: Date (optional)
- createdAt: Date (auto, required)
- updatedAt: Date (auto, required)

## Pick (Embedded in Player)
- employee: ObjectId (ref: 'Employee', required)
- cause: string (enum: 'voluntary', 'fired', required)
- date: Date (required)

## Code (Invite)
- code: string (unique, required)
- used: boolean (default: false)
- usedBy: ObjectId (ref: 'Player', optional)
- createdAt: Date (auto, required)
- usedAt: Date (optional)
