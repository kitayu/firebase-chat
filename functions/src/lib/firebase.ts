import { firestore } from 'firebase-admin';
import { WithId } from '../shared/types/firebase';

export const db = firestore();
export const FieldPath = firestore.FieldPath;
export type Timestamp = firestore.Timestamp;
export type CollectionReference<T> = firestore.CollectionReference<T>;
export type DocumentReference<T> = firestore.DocumentReference<T>;
export type DocumentData = firestore.DocumentData;
export type Query<T> = firestore.Query<T>;

export const getCollectionData = async <T>(
	query: CollectionReference<T> | Query<T>
): Promise<WithId<T>[]> => query.get().then(
	({ docs }) => docs.map(doc => ({ id: doc.id, ...doc.data()}))
);

export const getDocumentData = async <T>(
	ref: DocumentReference<T>
): Promise<WithId<T>> => ref.get().then((doc) => ({ id: ref.id, ...(doc.data() as T)}));