import { User } from "firebase/auth"
import { ReactNode, createContext, useCallback, useContext } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { signInGoogleWithPopup, signOut } from "@/lib/firebase";
import { addUser, getUser } from "@/lib/user";
import { LoginScreen } from "@/components/LoginScreen";
import { LoadingScreen } from "@/components/LoadingScreen";

type AuthContextValue ={
	currentUser: User | null;
};

export const AuthContext = createContext<AuthContextValue>({
	currentUser: null,
});

export const AuthProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [currentUser, loading] = useAuthState();

	if (loading) return <LoadingScreen />;
	if (!currentUser) return <LoginScreen />;

	return (
		<AuthContext.Provider value={{ currentUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const { currentUser } = useContext(AuthContext);
	const signInWithGoogle = useCallback(async () => {
		try {
			const { user } = await signInGoogleWithPopup();
			const { isExist } = await getUser(user.uid);
			if ( !isExist ) await addUser(user);
		} catch (e) {
			console.error(e);
			await signOut();
		}
	}, []);
	return { currentUser, signInWithGoogle, signOut };
};