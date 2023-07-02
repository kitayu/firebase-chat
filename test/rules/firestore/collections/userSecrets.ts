import {
	assertSucceeds,
	assertFails,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { getTestEnv, setCollection } from '@/../test/utils';
import { userSecretFactory } from '@/../test/factories/userSecret';
import {
	Firestore,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc
} from 'firebase/firestore';

const userSecret = userSecretFactory.build({ id: 'user-id' });
const otherSecret = userSecretFactory.build({ id: 'other-id' });
const userSecrets = [ userSecret, otherSecret];

export const userSecretsTest = () => {
	describe('userSecrets', () => {
		let env: RulesTestEnvironment;

		beforeEach(async() => {
			env = getTestEnv();
			await env.withSecurityRulesDisabled(async (context) => {
				const adminDb = context.firestore();
				await setCollection(collection(adminDb, 'userSecrets'), userSecrets);
			});
		});

		describe('未認証の場合', () => {
			let db: Firestore;

			beforeEach(() => {
				db = env.unauthenticatedContext().firestore();
			});

			it('読み込みできない(get)', async () => {
				const ref = doc(db, 'userSecrets', otherSecret.id);
				await assertFails(getDoc(ref));
			});

			it('読み込みできない(list)', async () => {
				const ref = collection(db, 'userSecrets');
				await assertFails(getDocs(ref));
			});

			it('作成できない', async () => {
				const newUserSecret = userSecretFactory.build();
				const ref = doc(db, 'userSecrets', newUserSecret.id);
				await assertFails(setDoc(ref, newUserSecret));
			})

			it('更新できない', async () => {
				const ref = doc(db, 'userSecrets', otherSecret.id);
				await assertFails(updateDoc(ref, {fcmToken: '違うトークン'}));
			});

			it('削除できない', async () => {
				const ref = doc(db, 'userSecrets', otherSecret.id);
				await assertFails(deleteDoc(ref));
			});
		});

		describe('認証済みの場合', () => {
			it('一覧を読み込みできない(list)', async () => {
				const db = env.authenticatedContext(userSecret.id).firestore();
				const ref = collection(db, 'userSecrets');
				await assertFails(getDocs(ref));
			});

			describe('自分のデータの場合', () => {
				let db: Firestore;

				beforeEach(() => {
					db = env.authenticatedContext(userSecret.id).firestore();
				});

				it('読み込みできる(get)', async () => {
					const ref = doc(db, 'userSecrets', userSecret.id);
					await assertSucceeds(getDoc(ref));
				});

				it('作成できる', async () => {
					const newUserSecret = userSecretFactory.build({ id: 'new-user-id'});
					const db = env.authenticatedContext(newUserSecret.id).firestore();
					const ref = doc(db, 'userSecrets', newUserSecret.id);
					await assertSucceeds(setDoc(ref, newUserSecret));
				});

				it('更新できる', async () => {
					const ref = doc(db, 'userSecrets', userSecret.id);
					await assertSucceeds(updateDoc(ref, { fcmToken: '違うトークン' }));
				});

				it('削除できる', async () => {
					const ref = doc(db, 'userSecrets', userSecret.id);
					await assertSucceeds(deleteDoc(ref));
				});
			});
		});

		describe('自分以外のデータの場合', async () => {
			let db: Firestore;

			beforeEach(() => {
				db = env.authenticatedContext(userSecret.id).firestore();
			});

			it('読み込みできない(get)', async () => {
				const ref = doc(db, 'userSecrets', otherSecret.id);
				await assertFails(getDoc(ref));
			});

			it('作成できない', async () => {
				const newUserSecret = userSecretFactory.build({
					id: 'new-user-id',
				});
				const ref = doc(db, 'userSecrets', newUserSecret.id);
				await assertFails(setDoc(ref, newUserSecret));
			})

			it('更新できない', async () => {
				const ref = doc(db, 'userSecrets', otherSecret.id);
				await assertFails(updateDoc(ref, {fcmToken: '違うトークン'}));
			});

			it('削除できない', async () => {
				const ref = doc(db, 'userSecrets', otherSecret.id);
				await assertFails(deleteDoc(ref));
			});
		});
	});
}