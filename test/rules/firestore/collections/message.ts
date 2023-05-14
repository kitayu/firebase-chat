import { messageFactory } from "@/../test/factories/message";
import { userFactory } from "@/../test/factories/user";
import { getTestEnv, setCollection } from "@/../test/firestore/utils";
import {
	RulesTestEnvironment,
	assertFails,
	assertSucceeds
} from "@firebase/rules-unit-testing";
import {
	Firestore,
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc
} from "firebase/firestore";

const user = userFactory.build({ id: 'user-id' });
const other = userFactory.build({ id: 'other-id' });
const users = [ user, other ];

const userMessage = messageFactory.build({
	id: 'user-message-id',
	senderId: user.id,
});
const otherMessage = messageFactory.build({
	id: 'other-message-id',
	senderId: other.id,
});

const messages = [ userMessage, otherMessage ];

export const messagesTest = () => {
	let env: RulesTestEnvironment;

	beforeEach(async () => {
		env = getTestEnv();
		await env.withSecurityRulesDisabled(async(context) => {
			const db = context.firestore();
			await setCollection(collection(db, 'users'), users);
			await setCollection(collection(db, 'messages'), messages);
		});
	});

	describe('未認証の場合', () => {
		let db: Firestore;

		beforeEach(() => {
			db = env.unauthenticatedContext().firestore();
		});

		it('読み込みできない(list)', async () => {
			const ref = collection(db, 'messages');
			await assertFails(getDocs(ref));
		});

		it('読み込みできない(get)', async () => {
			const ref = doc(db, 'messages', otherMessage.id);
			await assertFails(getDoc(ref));
		});

		it('作成できない', async () => {
			const newMessage = messageFactory.build();
			const ref = collection(db, 'messages')
			await assertFails(addDoc(ref, newMessage));
		});

		it('更新できない', async () => {
			const ref = doc(db, 'messages', otherMessage.id);
			await assertFails(updateDoc(ref, {content: '違う内容'}));
		});

		it('削除できない', async () => {
			const ref = doc(db, 'messages', otherMessage.id);
			await assertFails(deleteDoc(ref));
		});
	});

	describe('認証済の場合', () => {
		it('一覧を読み込みできる(list)', async () => {
			const db = env.authenticatedContext(user.id).firestore();
			const ref = collection(db, 'messages');
			await assertSucceeds(getDocs(ref));
		});

		describe('自分のデータの場合', () => {
			let db: Firestore;

			beforeEach(() => {
				db = env.authenticatedContext(user.id).firestore();
			});

			it('読み込みできる(get)', async () => {
				const ref = doc(db, 'messages', userMessage.id);
				await assertSucceeds(getDoc(ref));
			});
	
			it('作成できる', async () => {
				const newMessage = messageFactory.build({
					senderId: user.id,
				});
				const ref = doc(db, 'messages', newMessage.id)
				await assertSucceeds(setDoc(ref, newMessage));
			});
	
			it('更新できる', async () => {
				const ref = doc(db, 'messages', userMessage.id);
				await assertSucceeds(updateDoc(ref, {content: '違う内容'}));
			});
	
			it('削除できる', async () => {
				const ref = doc(db, 'messages', userMessage.id);
				await assertSucceeds(deleteDoc(ref));
			});
		});

		describe('自分以外のデータの場合', () => {
			let db: Firestore;

			beforeEach(() => {
				db = env.authenticatedContext(user.id).firestore();
			});

			it('読み込みできる(get)', async () => {
				const ref = doc(db, 'messages', otherMessage.id);
				await assertSucceeds(getDoc(ref));
			});
	
			it('作成できない', async () => {
				const newMessage = messageFactory.build({
					senderId: other.id,
				});
				const ref = doc(db, 'messages', newMessage.id)
				await assertFails(setDoc(ref, newMessage));
			});
	
			it('更新できない', async () => {
				const ref = doc(db, 'messages', otherMessage.id);
				await assertFails(updateDoc(ref, {content: '違う内容'}));
			});
	
			it('削除できない', async () => {
				const ref = doc(db, 'messages', otherMessage.id);
				await assertFails(deleteDoc(ref));
			});
		});
	});
}