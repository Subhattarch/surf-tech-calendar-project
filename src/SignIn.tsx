import React, { FormEvent, MouseEvent, useRef } from "react";
import $, { get } from "jquery";
import { SetState, State } from "./types";
import UseState from "./UseState";
import "./SignIn.css";

const SignIn = ({
    setUser,
    setSignIn,
}: {
    setUser: SetState<string>;
    setSignIn: SetState<boolean>;
}): JSX.Element => {
    const errorRef = useRef(false);
    const serverFault = useRef(false);
    const [haveAcount, setHaveAcount]: State<boolean> = UseState<boolean>(true);
    return (
        <div id='sign-in-container' onClick={(): void => setSignIn(false)}>
            <div
                id='sign-in'
                onClick={(e: MouseEvent<HTMLDivElement>): void => {
                    e.stopPropagation();
                }}
            >
                <h2>{haveAcount ? "Sign In" : "Sign Up"}</h2>
                <form
                    id='sign-in-form'
                    onSubmit={(e: FormEvent<HTMLFormElement>): void =>
                        e.preventDefault()
                    }
                >
                    <div>
                        <label htmlFor='name'>name</label>
                        <input
                            id='name'
                            onChange={(
                                e: FormEvent<HTMLInputElement>
                            ): void => {
                                $("#name").attr({
                                    pattern: "^\\w*$",
                                });
                                (
                                    $("#name")[0] as HTMLInputElement
                                ).setCustomValidity("");
                            }}
                            onInvalid={(
                                e: FormEvent<HTMLInputElement>
                            ): void => {
                                const target = $(
                                    "#name"
                                )[0] as HTMLInputElement;
                                if (errorRef.current) {
                                    errorRef.current = false;
                                    target.setCustomValidity(
                                        `name ${
                                            haveAcount
                                                ? "doesn't exists"
                                                : "exists"
                                        }`
                                    );
                                    return;
                                }
                                if (!serverFault.current)
                                    target.setCustomValidity(
                                        "name must be filled and have alpha numeric"
                                    );
                            }}
                            type='text'
                            required={true}
                        />
                    </div>
                    <div>
                        <label htmlFor='password'>password</label>
                        <input
                            id='password'
                            type='password'
                            pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$'
                            required={true}
                            onChange={(): void => {
                                $("#password").attr(
                                    "pattern",
                                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"
                                );
                                (
                                    $("#password")[0] as HTMLInputElement
                                ).setCustomValidity("");
                            }}
                            onInvalid={(
                                e: FormEvent<HTMLInputElement>
                            ): void => {
                                const target = $(
                                    "#password"
                                )[0] as HTMLInputElement;
                                const value = $("#password").val() as string;
                                if (value?.length < 8) {
                                    target.setCustomValidity(
                                        "must have atleast 8 characters"
                                    );
                                    return;
                                }
                                if (!/^(?=.*[a-z])/u.test(value)) {
                                    target.setCustomValidity(
                                        "must contsin lowercase characters"
                                    );
                                    return;
                                }
                                if (!/^(?=.*[A-Z])/u.test(value)) {
                                    target.setCustomValidity(
                                        "must contain uppercase alphabet"
                                    );
                                    return;
                                }
                                if (!/^(?=.*[0-9])/u.test(value)) {
                                    target.setCustomValidity(
                                        "must contain numbers"
                                    );
                                    return;
                                }
                                if (!/^(?=.*[!@#$%^&*_=+-])/u.test(value)) {
                                    target.setCustomValidity(
                                        "must contain special characters"
                                    );
                                    return;
                                }
                                target.setCustomValidity("");
                            }}
                        />
                    </div>
                    <input
                        type='submit'
                        onClick={async (e: MouseEvent<HTMLInputElement>) => {
                            if (
                                !(
                                    (
                                        $("#name")[0] as HTMLInputElement
                                    ).checkValidity() &&
                                    (
                                        $("#password")[0] as HTMLInputElement
                                    ).checkValidity()
                                )
                            )
                                return;
                            try {
                                const o = await get(
                                    "/calendar/sign-in-up",
                                    {
                                        name: "none",
                                        password: "none",
                                        haveAcount,
                                    },
                                    data => {
                                        console.log(data);
                                    },
                                    "json"
                                ).promise();
                                if (!o?.isValid && !o?.name) {
                                    errorRef.current = true;
                                    $("#name").attr("pattern", "");
                                    e.preventDefault();
                                    return;
                                }
                                if (!o?.isValidPassword) {
                                    $("#password").attr("pattern", "");
                                    (
                                        $("#password")[0] as HTMLInputElement
                                    ).setCustomValidity("wrong password");
                                    return;
                                }
                                setUser(o?.name);
                            } catch (err) {
                                $("#name").attr({
                                    pattern: "",
                                });
                                (
                                    $("#name")[0] as HTMLInputElement
                                ).setCustomValidity("server error");
                                e.preventDefault();
                                serverFault.current = true;
                                return;
                            }
                        }}
                        value={haveAcount ? "log in" : "create account"}
                    />
                </form>
                {haveAcount ? (
                    <p>
                        Don&rsquo;t have account?{" "}
                        <button
                            className='change-method'
                            onClick={(): void => setHaveAcount(false)}
                        >
                            sign up
                        </button>
                    </p>
                ) : (
                    <p>
                        Have account?{" "}
                        <button
                            className='change-method'
                            onClick={(): void => setHaveAcount(true)}
                        >
                            sign in
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default SignIn;
