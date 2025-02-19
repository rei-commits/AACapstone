import { useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import axios from 'axios';

export default function Login() {
    const [error, setError] = useState('');
    const [showReactivateOption, setShowReactivateOption] = useState(false);
    const auth = getAuth();

    const handleLogin = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Login successful
        } catch (error) {
            if (error.code === 'auth/user-disabled') {
                setError('This account has been deactivated.');
                setShowReactivateOption(true);
            } else {
                setError('Failed to log in. Please try again.');
            }
        }
    };

    const handleReactivate = async () => {
        try {
            // First try to sign in to get the token
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // Call reactivate endpoint
            await axios.post('http://localhost:8080/api/users/reactivate', null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('Your account has been reactivated! You can now log in.');
            setShowReactivateOption(false);
            setError('');
            
        } catch (error) {
            console.error('Reactivation error:', error);
            setError('Failed to reactivate account. Please try again or contact support.');
        }
    };

    return (
        <div>
            {/* ... existing login form ... */}
            
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            {showReactivateOption && (
                <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        Would you like to reactivate your account?
                    </p>
                    <button
                        onClick={handleReactivate}
                        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                        Reactivate Account
                    </button>
                </div>
            )}
        </div>
    );
} 