'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import { useRouter } from '@tanstack/react-router';

export interface TopLoaderProps {
    color?: string;
    initialPosition?: number;
    crawlSpeed?: number;
    height?: number;
    crawl?: boolean;
    showSpinner?: boolean;
    easing?: string;
    speed?: number;
    shadow?: string | false;
    zIndex?: number;
    showAtBottom?: boolean;
}

const TopLoader = ({
    color = '#29D',
    initialPosition = 0.08,
    crawlSpeed = 200,
    height = 3,
    crawl = true,
    showSpinner = true,
    easing = 'ease',
    speed = 200,
    shadow = '0 0 10px ' + color + ',0 0 5px ' + color,
    zIndex = 1600,
    showAtBottom = false,
}:  TopLoaderProps): JSX.Element => {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimers = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const startLoading = () => {
        clearTimers();
        setProgress(initialPosition * 100);
        setIsLoading(true);

        if (crawl) {
            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    const increment = (100 - prev) * 0.05;
                    const next = prev + increment;
                    
                    return next >= 94 ? 94 : next;
                });
            }, crawlSpeed);
        }
    };

    const completeLoading = () => {
        clearTimers();
        setProgress(100);

        timeoutRef.current = setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
        }, speed + 100);
    };

    useEffect(() => {
        // Subscribe to router navigation events (for SPA navigations)
        const unsubscribeBeforeLoad = router.subscribe('onBeforeLoad', () => {
            startLoading();
        });

        const unsubscribeLoad = router.subscribe('onLoad', () => {
            completeLoading();
        });

        const handleBeforeUnload = () => {
            startLoading();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            unsubscribeBeforeLoad();
            unsubscribeLoad();
            window.removeEventListener('beforeunload', handleBeforeUnload);
            clearTimers();
        };
    }, [router, initialPosition, crawlSpeed, crawl, speed]);

    if (!isLoading && progress === 0) {
        return <></>;
    }

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    [showAtBottom ? 'bottom' : 'top']: 0,
                    left: 0,
                    width: '100%',
                    height: `${height}px`,
                    zIndex,
                    pointerEvents: 'none',
                }}
            >
                {/* Progress Bar */}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        [showAtBottom ? 'bottom' : 'top']: 0,
                        width: `${progress}%`,
                        height: '100%',
                        background: color,
                        transition: `width ${speed}ms ${easing}, opacity ${speed}ms linear`,
                        opacity: isLoading ? 1 : 0,
                    }}
                >
                    {/* Peg/Glow Effect */}
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            width: '100px',
                            height: '100%',
                            boxShadow: shadow === false ? 'none' : shadow,
                            opacity: progress > 0 ? 1 : 0,
                            transform: 'rotate(3deg) translate(0px, -4px)',
                        }}
                    />
                </div>
            </div>

            {/* Spinner */}
            {showSpinner && isLoading && (
                <div
                    style={{
                        position: 'fixed',
                        [showAtBottom ? 'bottom' : 'top']: '15px',
                        right: '15px',
                        zIndex,
                        pointerEvents: 'none',
                    }}
                >
                    <div
                        style={{
                            width: '18px',
                            height: '18px',
                            boxSizing: 'border-box',
                            border: 'solid 2px transparent',
                            borderTopColor: color,
                            borderLeftColor: color,
                            borderRadius: '50%',
                            animation: 'toploader-spinner 400ms linear infinite',
                        }}
                    />
                </div>
            )}

            {/* Keyframe Animation */}
            <style>{`
                @keyframes toploader-spinner {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};

export default TopLoader;