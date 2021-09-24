import React, { useEffect, useRef } from "react";
import $ from "jquery";
import { SetState } from "./types";

const Message = ({
    message: { text, error },
    setMessage,
}: {
    message: {
        text: string;
        error?: boolean;
    };
    setMessage: SetState<{
        text: string;
        error?: boolean;
    }>;
}): JSX.Element => {
    const pRef = useRef<HTMLParagraphElement>(null);
    useEffect((): void => {
        if (pRef.current == null || !text) return;
        const p = $(pRef.current as HTMLParagraphElement);
        p.css("transform", "translate(50%, -200%)");
        setTimeout((): void => {
            p.css("transform", "translate(50%)");
            setTimeout((): void => {
                p.css("transform", "translate(50%, -200%)");
                setTimeout((): void => {
                    setMessage({
                        text: "",
                        error: false,
                    });
                }, 1000);
            }, 4000);
        }, 100);
    }, [pRef, text, setMessage]);
    return (
        <p
            id='message'
            style={{
                transform: "translate(50%, -200%)",
                position: "fixed",
                top: "0.1em",
                right: "50%",
                transition: "transform 500ms ease-in-out",
                backgroundColor: error ? "red" : "var(--primary-light-color)",
                border: "0.1em solid var(--tertiary-dark-color)",
                color: "var(--primary-dark-color)",
                zIndex: 100000,
                padding: "0 1em",
                borderRadius: "1em",
                fontSize: "1.2rem",
            }}
            ref={pRef}
        >
            {text}
        </p>
    );
};

export default Message;
