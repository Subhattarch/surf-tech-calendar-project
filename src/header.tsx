import { post } from "jquery";
import React from "react";
import "./header.css";
import { AllEvents, SetState } from "./types";

const header = ({
    setSignIn,
    setUser,
    user,
    allEvents,
    setMessage,
}: {
    setSignIn: SetState<boolean>;
    user: string;
    setUser: SetState<string>;
    allEvents: AllEvents;
    setMessage: SetState<{
        text: string;
        error?: boolean;
    }>;
}): JSX.Element => {
    return (
        <header>
            <button
                onClick={(): void => {
                    if (user === "unonymous") {
                        setSignIn(true);
                        return;
                    }
                    post(
                        "/calendar/users/qsave",
                        {
                            user,
                            ...allEvents,
                        },
                        (): void => {
                            setMessage({ text: "saved" });
                        }
                    ).fail((): void => {
                        setMessage({
                            text: "save failed",
                            error: true,
                        });
                    });
                }}
            >
                Save
            </button>
            {user !== "unonymous" && (
                <button
                    onClick={(): void => {
                        setUser("unonymous");
                    }}
                >
                    Sign out
                </button>
            )}
        </header>
    );
};

export default header;
