"use client";

import { useEffect, useRef, useState } from "react";

export function EyeMascot() {
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    const [blink, setBlink] = useState(false);

    // Cursor tracking
    useEffect(() => {
        function update(e: MouseEvent) {
            [leftRef.current, rightRef.current].forEach((eye) => {
                if (!eye) return;

                const rect = eye.parentElement!.getBoundingClientRect();

                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;

                const angle = Math.atan2(
                    e.clientY - cy,
                    e.clientX - cx
                );

                const distance = 6;

                eye.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance
                    }px)`;
            });
        }

        window.addEventListener("mousemove", update);

        return () => window.removeEventListener("mousemove", update);
    }, []);

    // Random blink
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const scheduleBlink = () => {
            const delay = 1000;

            timeout = setTimeout(() => {
                setBlink(true);

                setTimeout(() => {
                    setBlink(false);
                    scheduleBlink();
                }, 140); // blink duration
            }, delay);
        };

        scheduleBlink();

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="group relative flex h-28 w-36 items-center justify-center rounded-[32px] border border-[#e4e4e7] bg-[#fafafa] transition-transform duration-300 hover:-translate-y-1">
            <div className="flex gap-6">
                {[leftRef, rightRef].map((ref, i) => (
                    <div
                        key={i}
                        className={`relative flex h-14 w-10 items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-100 ${blink ? "scale-y-[0.08]" : "scale-y-100"
                            }`}
                    >
                        <div
                            ref={ref}
                            className={`h-4 w-4 rounded-full bg-black transition-transform duration-75 ${blink ? "opacity-0" : "opacity-100"
                                }`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}