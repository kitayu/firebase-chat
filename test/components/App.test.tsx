import { App } from '@/components/App';
import { cleanup, render, screen } from '@testing-library/react';

vi.mock('@/components/Messages', async () => {
	const messages = await vi.importActual<object>(
		'@/components/Messages'
	);
	return {
		...messages,
		Messages: () => (<div></div>),
	};
});

vi.mock('@/components/MessageForm', async () => {
	const messageForm = await vi.importActual<object>(
		'@/components/MessageForm'
	);

	return {
		...messageForm,
		MessageForm: () => (<div></div>),
	};
});

describe('App', async () => {
	await import('@/components/Messages');
	await import('@/components/MessageForm');

	afterEach(() => cleanup());

	it('タイトル文字列が表示される', async () => {
		render(<App />)
		expect(screen.getByText('Sample Chat App')).toBeTruthy();
	});
});