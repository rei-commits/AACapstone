import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import axios from 'axios';

export default function SignUp() {
    const [error, setError] = useState('');
    const [showReactivateOption, setShowReactivateOption] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const auth = getAuth();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            // Signup successful
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Signup error:', error);
            
            if (error.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists. Please log in instead.');
            } else {
                setError('Failed to create account. Please try again.');
            }
        }
    };

    const handleReactivate = async () => {
        try {
            console.log('Sending reactivation request for email:', formData.email);
            
            const response = await axios.post('http://localhost:8080/api/users/reactivate-request', {
                email: formData.email
            });
            
            console.log('Reactivation response:', response.data);
            alert('A reactivation link has been sent to your email. Please check your inbox.');
            window.location.href = '/login';
            
        } catch (error) {
            console.error('Full reactivation error:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                setError(error.response.data.error || 'Failed to send reactivation request');
            } else {
                setError('Network error. Please try again.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F111E]">
            <div className="w-full max-w-md p-6 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-gray-400">Join Tally and start splitting bills with ease</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 bg-[#2A2C4E] rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 bg-[#2A2C4E] rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 bg-[#2A2C4E] rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 bg-[#2A2C4E] rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 bg-[#2A2C4E] rounded-lg"
                            required
                        />
                    </div>
                    
                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                    
                    {showReactivateOption ? (
                        <div className="mt-4 p-4 bg-[#2A2C4E] rounded-lg border border-yellow-500">
                            <p className="text-sm text-yellow-500 mb-2">
                                This email belongs to a deactivated account. Would you like to reactivate it?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleReactivate}
                                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                >
                                    Reactivate Account
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReactivateOption(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                        >
                            Create Account
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
} 