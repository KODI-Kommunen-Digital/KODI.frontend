import React, { useEffect } from 'react';

const LogoutSuccessPage = () => {

    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            window.location.href = '/';
        }, 5000);
        return () => clearTimeout(redirectTimer);
    }, []);

    return (
        <section className="bg-white body-font relative">

            <main className="bg-white h-full items-center mt-20 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
                <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white shadow-md rounded-md p-6 text-center">
                            <h1 className="text-2xl font-bold mb-4">Logout Success!</h1>
                            <p>You have been successfully logged out.</p>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    );
}

export default LogoutSuccessPage;