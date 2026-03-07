"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface HeaderPortalProps {
    children: React.ReactNode;
}

export const HeaderPortal = ({ children }: HeaderPortalProps) => {
    const [mounted, setMounted] = useState(false);
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        const element = document.getElementById("course-editor-header-root");
        if (element) {
            setContainer(element);
        }
        return () => setMounted(false);
    }, []);

    if (!mounted || !container) {
        return null;
    }

    return createPortal(children, container);
};
