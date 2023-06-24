import { MessageForm } from "@/components/MessageForm";
import { Messages } from "@/components/Messages";

export const App = () => {
	return (
		<div>
			<h1>Sample Chat App</h1>
			<div>
				<Messages />
				<MessageForm />
			</div>
		</div>
	);
};