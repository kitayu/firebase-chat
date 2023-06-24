import { WithId, getConverter } from '@/lib/firebase';
import { RulesTestEnvironment, initializeTestEnvironment as _initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { CollectionReference, DocumentData, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';


let testEnv: RulesTestEnvironment;

export const initializeTestEnvironment = async (projectId: string) => {
	process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
	process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';

	testEnv = await _initializeTestEnvironment({
		projectId: projectId,
		firestore: {
			rules: readFileSync('firestore.rules', 'utf8'),
		},
		storage: {
			rules: readFileSync('storage.rules', 'utf8'),
		},
	});	
};

export const getTestEnv = () => testEnv;

export const setCollection = <T extends DocumentData>(
	ref: CollectionReference<T>,
	instances: WithId<T>[],
) => {
	return Promise.all(
		instances.map((_) => setDoc(doc(ref, _.id), getConverter<T>().toFirestore(_)))
	);
}
