import { firestore, region } from "firebase-functions";
import { getCollectionData, getDocumentData } from "./lib/firebase";
import { UserDocumentData } from "./shared/types/user";
import { userRef } from "./lib/user";
import { UserSecretDocumentData } from "./shared/types/userSecrets";
import { userSecretRef } from "./lib/userSecret";
import { messaging } from "firebase-admin";

export const onCreateMessage = region('asia-northeast1').firestore.document('message/{messageId}')
	.onCreate(
		async (snapshot: firestore.QueryDocumentSnapshot) => {
			const { senderId, content } = snapshot.data();
			const sender = await getDocumentData<UserDocumentData>(
				userRef(senderId)
			);
			const notification = {
				title: `${sender.name}さんからメッセージが届きました`,
				body: content,
			};
			const secrets = await getCollectionData<UserSecretDocumentData>(
				userSecretRef
			);
			await Promise.allSettled(
				// NOTE: queryでsenderId以外に絞れるがfunctionのテストを書くためにここでfilterする 
				secrets.filter(({ id }) => id !== senderId).map(({fcmToken}) => messaging().send({ token: fcmToken, notification}))	
			);
		}
	);