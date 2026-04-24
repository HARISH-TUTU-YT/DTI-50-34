# Security Specification: VetVoice AI

## 1. Data Invariants
- A case must always be associated with the `userId` of the creator.
- Users can only read and write their own cases.
- Vet locations are read-only for standard users and can only be managed by admins.
- User profiles are only readable by the user themselves (PII isolation).

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Identity Spoofing**: Attempt to create a case with someone else's `userId`.
2. **Access Violation**: Attempt to read another user's case by guessing the `caseId`.
3. **Privilege Escalation**: A standard user attempting to create/update a `vet_location`.
4. **Data Poisoning**: Injecting 1MB of "junk" into the `symptoms` or `animalType` field.
5. **ID Injection**: Using a 1.5KB string as a document ID.
6. **State Jumping**: Attempting to set a "severity" to "EMERGENCY" for a case the user didn't create.
7. **Immutability Breach**: Attempting to change the `userId` or `createdAt` of an existing case.
8. **PII Leak**: Attempting to list all users in the `/users` collection.
9. **Relational Orphan**: Creating a case with a non-existent `userId` reference.
10. **Timestamp Fraud**: Sending a client-side timestamp instead of a server-side timestamp for `createdAt`.
11. **Shadow Fields**: Adding an `isAdmin: true` field to a user profile update.
12. **Malformed Types**: Sending a boolean for `symptoms` which expects a string.

## 3. Test Runner Scenario (Conceptual)
All the above payloads MUST return `PERMISSION_DENIED`.
