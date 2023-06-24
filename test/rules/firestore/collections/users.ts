import { userFactory } from "@/../test/factories/user";
import { getTestEnv, setCollection } from "@/../test/utils";
import { RulesTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { Firestore, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

const user = userFactory.build({ id: 'user-id' });
const other = userFactory.build({ id: 'other-id' });
const users = [ user, other ];

export const usersTest = () => {
	describe('users', () => {
		let env: RulesTestEnvironment;

		beforeEach(async () => {
			env = getTestEnv();
			await env.withSecurityRulesDisabled(async (context) => {
				const db = context.firestore();
				await setCollection(collection(db, 'users'), users);
			});
		});
	
		describe('認証済の場合', () => {
			it('一覧を読み込みできる(list)', async () => {
				const db = env.authenticatedContext(user.id).firestore();
				const ref = collection(db, 'users');
				await assertSucceeds(getDocs(ref));
			});
	
			describe('自分のデータの場合', () => {
				let db: Firestore;
	
				beforeEach(() => {
					db = env.authenticatedContext(user.id).firestore();
				});
	
				it('読み込みできる(get)', async () => {
					const ref = doc(db, 'users', user.id);
					await assertSucceeds(getDoc(ref));
				});
	
				it('作成できる', async () => {
					const newUser = userFactory.build();
					const db = env.authenticatedContext(newUser.id).firestore();
					const ref = doc(db, 'users', newUser.id)
					await assertSucceeds(setDoc(ref, newUser));
				});
	
				it('更新できる', async () => {
					const ref = doc(db, 'users', user.id);
					await assertSucceeds(updateDoc(ref, {name: '違う名前'}));
				});
	
				it('削除できる', async () => {
					const ref = doc(db, 'users', user.id);
					await assertSucceeds(deleteDoc(ref));
				});
			});
	
			describe('自分以外のデータの場合', () => {
				let db: Firestore;
	
				beforeEach(() => {
					db = env.authenticatedContext(user.id).firestore();
				});
	
				it('読み込みできる(get)', async () => {
					const ref = doc(db, 'users', other.id);
					await assertSucceeds(getDoc(ref));
				})
	
				it('作成できない', async () => {
					const newUser = userFactory.build();
					const ref = doc(db, 'users', newUser.id)
					await assertFails(setDoc(ref, newUser));
				});
	
				it('更新できない', async () => {
					const ref = doc(db, 'users', other.id);
					await assertFails(updateDoc(ref, {name: '違う名前'}));
				});
	
				it('削除できない', async () => {
					const ref = doc(db, 'users', other.id);
					await assertFails(deleteDoc(ref));
				});
			});
		});
	});
};