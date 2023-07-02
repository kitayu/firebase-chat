import { messagesTest } from "@/../test/rules/firestore/collections/message";
import { usersTest } from "./collections/users";
import { getTestEnv, initializeTestEnvironment } from "@/../test/utils";
import { userSecretsTest } from "./collections/userSecrets";

describe('firestore.rules', () => {
	beforeAll(async () => {
		await initializeTestEnvironment('firebase-chat-firestore-rules-test');
	});

	afterAll(async () => {
		await getTestEnv().cleanup();
	});

	afterEach(async () => {
		await getTestEnv().clearFirestore();
	});

	usersTest();
	messagesTest();
	userSecretsTest();
});
