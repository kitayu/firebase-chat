// @vitest-environment node
import {
	initializeTestEnvironment,
	getTestEnv,
} from '@/../test/utils';
import { messageTest } from '@/../test/rules/storage/messages';

describe('storage.rules', () => {
	beforeAll(async () => {
		await initializeTestEnvironment(
			'firebase-chat-storage-rules-test'
		);
	});

	afterAll(async () => {
		await getTestEnv().cleanup();
	});

	afterEach(async() => {
		await getTestEnv().clearStorage();
	});

	messageTest();
});