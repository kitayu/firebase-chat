import {
	getFirestore,
	collection,
	doc,
	setDoc,
} from 'firebase/firestore';
import { getConverter, serverTimestamp } from '@/lib/firebase';
import type { UserSecretDocumentData } from '@/shared/types/userSecrets';

export const userSecretsRef = () => collection(
	getFirestore(),
	'userSecrets',
).withConverter(getConverter<UserSecretDocumentData>());

export const setUserSecret = async (
	uid: string,
	{ fcmToken }: {fcmToken: string },
) => {
	const userSecret = { fcmToken, createdAt: serverTimestamp() };
	await setDoc(doc(userSecretsRef(), uid), userSecret, { merge: true});
};