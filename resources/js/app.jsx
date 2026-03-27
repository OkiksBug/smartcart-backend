import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'SmartCart';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // small explicit mapping for pages that might be missed by the glob resolver
        if (name === 'Users/AdminProfileView') {
            return import('./Pages/Users/AdminProfileView.jsx');
        }
        if (name === 'Users/AdminProfile') {
            return import('./Pages/Users/Adminsettings.jsx');
        }

        return resolvePageComponent(
            `./Pages/${name}.jsx`,
            // include multiple extensions so newly added pages are discovered more robustly
            import.meta.glob('./Pages/**/*.{js,jsx,ts,tsx}'),
        );
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
