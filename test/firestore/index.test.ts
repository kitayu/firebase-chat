import { messagesTest } from "../rules/firestore/collections/message";
import { usersTest } from "../rules/firestore/collections/user";
import { getTestEnv, initializeTestEnvironment } from "./utils";

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080'

describe('firestore.rules', () => {
	beforeAll(async () => {
		await initializeTestEnvironment();
	});

	afterAll(async () => {
		await getTestEnv().cleanup();
	});

	afterEach(async () => {
		await getTestEnv().clearFirestore();
	});

	usersTest();
	messagesTest();
});
