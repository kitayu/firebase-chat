import {
	cleanup,
	render,
	screen,
	waitFor,
} from '@testing-library/react'
import { userFactory } from "@/../test/factories/user";
import { messageFactory } from '@/../test/factories/message';
import { Timestamp } from 'firebase/firestore';

const sender = userFactory.build({
	id: 'user-id',
	name: 'テストユーザー',
	photoUrl: 'user-photo-url',
});
vi.mock('@/context/UsersContext', () => {
	return {
		useUsers: { usersById: { 'user-id': [sender] }},
	};
});
const useBlobMock = vi.fn();
vi.mock('@/hooks/useBlob', () => {
	return {
		useBlob: useBlobMock,
	};
});

describe('Message', async () => {
	const { Message } = await import('@/components/Message');

	beforeEach(() => {
		useBlobMock.mockReturnValue({});
	});

	afterEach(() => cleanup());

	const message = messageFactory.build({
		content: 'テストのメッセージ',
		senderId: 'user-id',
		imagePath: null,
		createdAt: Timestamp.fromDate(
			new Date('2022-07-01 00:00:00+9:00')
		),
	});

	it('loading中はloadingメッセージが表示される', () => {
		render(<Message message={message} />);
		expect(screen.getByText('loading...')).toBeTruthy();
	});

	it('アイコン画像が表示される', () => {
		render(<Message message={message} />);
		waitFor(() =>
			expect(screen.getByRole('img').getAttribute('src')).toBe(
				'user-photo-url',
			)
		);
	});

	it('送信者の名前が表示される', () => {
		render(<Message message={message} />);
		waitFor(() =>
			expect(screen.getByText('テストユーザー')).toBeTruthy()
		);
	})

	it('送信時間が表示される', () => {
		render(<Message message={message} />);
		waitFor(() =>
			expect(screen.getByText('2022-07-01 00:00')).toBeTruthy()
		);
	});

	it('メッセージが表示される', () => {
		render(<Message message={message} />);
		waitFor(() =>
			expect(screen.getByText('テストのメッセージ')).toBeTruthy()
		);
	});

	it('画像が表示される', () => {
		render(<Message message={message} />);
		waitFor(() =>
			expect(screen.getByText('message-image')).toHaveAttribute(
				'src',
				'message-image-url'
			)
		);
	});
});