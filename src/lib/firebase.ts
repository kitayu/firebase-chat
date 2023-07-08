import { initializeApp } from 'firebase/app'
import {
	getAuth,
	signInWithPopup,
	signOut as _signOut,
	User,
	GoogleAuthProvider,
	connectAuthEmulator,
} from 'firebase/auth';
import {
	DocumentData,
	FirestoreDataConverter,
	PartialWithFieldValue,
	QueryDocumentSnapshot,
	SnapshotOptions,
	Timestamp,
	serverTimestamp as _serverTimestamp,
	initializeFirestore,
	connectFirestoreEmulator,
} from 'firebase/firestore';
import { omit } from 'lodash-es';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messageingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
if (import.meta.env.VITE_EMULATORS === 'true') {
	console.info('USE EMULATORS...');
	connectAuthEmulator(getAuth(), 'http://127.0.0.1:9099');
	const firestore = initializeFirestore(app, {
		experimentalForceLongPolling: true,
	});
	connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
}

type WithId<T> = T & { id: string };

const getConverter = <T extends DocumentData>(): FirestoreDataConverter<WithId<T>> => ({
	toFirestore: (
		data: PartialWithFieldValue<WithId<T>>
	): DocumentData => {
		return omit(data, ['id'])
	},
	fromFirestore: (
		snapshot: QueryDocumentSnapshot<T>,
		options: SnapshotOptions,
	): WithId<T> => {
		return { id: snapshot.id, ...snapshot.data(options) };
	}
});

const signInGoogleWithPopup = async() => {
	const provider = new GoogleAuthProvider();
	return signInWithPopup(getAuth(), provider);
};

const signOut = async () => _signOut(getAuth());

const serverTimestamp = _serverTimestamp as unknown as () => Timestamp;

const getFcmToken = async () => getToken(getMessaging(), {
	vapidKey: import.meta.env.VITE_FIREBAE_MESSAGING_VAPID_KEY,
});

export type {
	User,
	WithId,
}

export {
	Timestamp,
	getConverter,
	signInGoogleWithPopup,
	signOut,
	serverTimestamp,
	getFcmToken,
};