import admin from 'firebase-admin';
admin.initializeApp();
admin.firestore().settings({ timestampsInputSnapshot: true});

export { onCreateMessage } from './onCreateMessage';