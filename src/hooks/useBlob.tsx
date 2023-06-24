import { getStorage, getBlob, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';

export const useBlob = (path: string | null) => {
	const [blob, setBlob] = useState<Blob>();
	const [url, setUrl] = useState<string>();

	useEffect(() => {
		path && getBlob(ref(getStorage(), path)).then((res) => {
			setBlob(res);
			setUrl(URL.createObjectURL(res));
		});
	}, [path]);	

	return { blob, url };
};