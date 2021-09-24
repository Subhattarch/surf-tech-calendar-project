import { useCallback, useState } from "react";
import { isObject } from "./smallFunctions";
import { SetState, State, StateAssigner } from "./types";

function UseState<type>(state: type | (() => type)): State<type> {
    const [State, setState]: State<Partial<type>> =
        useState<Partial<type>>(state);
    const StateIsObject = isObject(State);

    const SetStateFnc = useCallback(
        (newState: StateAssigner<Partial<type>>): void => {
            setState((state: Partial<type>): Partial<type> => {
                return StateIsObject
                    ? {
                          ...state,
                          ...(typeof newState === "function"
                              ? newState(state)
                              : newState),
                      }
                    : typeof newState === "function"
                    ? newState(state)
                    : newState;
            });
        },
        [setState, StateIsObject]
    );
    return [State as type, SetStateFnc as SetState<type>];
}

export default UseState;
