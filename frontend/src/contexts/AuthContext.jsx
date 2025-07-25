import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [isAuth, setIsAuth] = useState(false);
	const [loading, setLoading] = useState(true);

	// Vérifie l'authentification au chargement (cookie)
	useEffect(() => {
		axios.get('/api/auth/me', { withCredentials: true })
			.then(() => setIsAuth(true))
			.catch(() => setIsAuth(false))
			.finally(() => setLoading(false));
	}, []);

	const login = async (email, password) => {
		await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
		setIsAuth(true);
	};
	const register = async (email, password) => {
		await axios.post('/api/auth/register', { email, password });
		await login(email, password);
	};
	const logout = async () => {
		await axios.post('/api/auth/logout', {}, { withCredentials: true });
		setIsAuth(false);
	};

	return (
		<AuthContext.Provider value={{ isAuth, login, register, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
} 