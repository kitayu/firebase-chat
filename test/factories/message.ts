import { Message } from '@/shared/types/message';
import { Timestamp } from 'firebase/firestore';
import { Factory } from 'fishery';

export const messageFactory = Factory.define<Message>(
	({ sequence }) => ({
		id: sequence.toString(),
		createdAt: Timestamp.fromDate(new Date()),
		content: '',
		imagePath: null,
		senderId: '',
	})
);