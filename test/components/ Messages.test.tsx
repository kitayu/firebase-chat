import {
	render,
	screen,
	cleanup,
} from '@testing-library/react';
import { messageFactory } from '../factories/message';
import { userFactory } from '../factories/user';

const useCollectionDataMock = vi.fn();
vi.mock('@/hooks/useCollectionData', () => {
	return {
		useCollectionData: useCollectionDataMock,
	};
});
const useUsersMock = vi.fn();
vi.mock('@/contexts/UsersContext', () => {
	return {
		useUsers: useUsersMock,
	};
});

describe('', async() => {
	const { Messages } = await import('@/components/Messages');

	afterEach(async () => {
		vi.resetAllMocks();
		cleanup();
	});

	it('ローディング中の場合、ローディング画面が表示される', async () => {
		useCollectionDataMock.mockReturnValue([[], true, undefined, undefined]);
		render(<Messages />);
		expect(screen.getByText('loading...')).toBeTruthy();
	});

	it('ローディング完了後、メッセージ一覧が表示される', async () => {
		const message1 = messageFactory.build({
			id: 'test-message-id',
			content: 'テストメッセージ1',
			senderId: 'test-user-uid',
		});
		const message2 = messageFactory.build({
			id: 'test-message-id',
			content: 'テストメッセージ2',
			senderId: 'test-user-uid',
		});
		useCollectionDataMock.mockReturnValue([
			[message1, message2],
			false,
			undefined,
			undefined,
		]);
		const user = userFactory.build({
			id: 'test-user-uid',
			name: 'てすたろう',
		});
		useUsersMock.mockReturnValue({
			users: [user],
			usersById: {
				[user.id]: user
			},
			loading: false,
		});
		render(<Messages />);
		expect(screen.getByText('テストメッセージ1')).toBeTruthy();
		expect(screen.getByText('テストメッセージ2')).toBeTruthy();
	});

});