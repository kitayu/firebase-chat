import {
	initializeTestEnvironment,
	getTestEnv,
} from '@/../test/firestore/utils';
import {
	messagesTest
} from '@/../test/queries/firestore/collections/messages';

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080'

describe('firestore.rules', () => {
	beforeAll(async () => {
		await initializeTestEnvironment(
			'testable-firebase-chat-queries-test'
		);
	});

	afterAll(async () => {
		await getTestEnv().cleanup();
	});

	afterEach(async () => {
		await getTestEnv().clearFirestore();
	});

	messagesTest();
});