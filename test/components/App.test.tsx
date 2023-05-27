import { App } from '@/components/App';
import { cleanup, render, screen } from '@testing-library/react';

describe('App', () => {
	afterEach(() => cleanup());

	it('タイトル文字列が表示される', async () => {
		render(<App />)
		expect(screen.getByText('Sample Chat App')).toBeTruthy();
	});
});