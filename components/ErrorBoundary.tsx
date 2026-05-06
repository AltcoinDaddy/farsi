'use client';

import React from 'react';

type ErrorBoundaryProps = {
    children: React.ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
    error: unknown;
};

export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            const errorMessage =
                this.state.error instanceof Error
                    ? this.state.error.toString()
                    : String(this.state.error);

            return (
                <div style={{ padding: '20px', background: 'red', color: 'white' }}>
                    <h1>Something went wrong.</h1>
                    <pre>{errorMessage}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}
