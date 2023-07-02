import { CollectionReference } from "firebase-admin/firestore";
import { db } from "./firebase";
import { UserSecretDocumentData } from "../shared/types/userSecrets";

export const userSecretRef = db.collection(
	'userSecrets'
) as CollectionReference<UserSecretDocumentData>;