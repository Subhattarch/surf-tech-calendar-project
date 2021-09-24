import { Dispatch, SetStateAction } from "react";

type StateAssigner<type> =
    | type
    | Partial<type>
    | ((state: type) => type)
    | ((state: type) => Partial<type>);

type SetState<type> =
    | Dispatch<SetStateAction<type>>
    | Dispatch<SetStateAction<Partial<type>>>
    | ((newState: StateAssigner<type>) => void);

interface State<type>
    extends Array<
        type | Partial<type> | SetState<type> | SetState<Partial<type>>
    > {
    0: type;
    1: SetState<type>;
}

interface EventBase {
    title: string;
    description: string;
    startTime: number;
    endTime: number;
}

type Event = Array<EventBase>;

interface AllEvents {
    [index: string]: Event[];
}

type defaultArray<type> = {
    (): Array<type>;
    (index?: number): type;
    (index?: number, value?: type): Array<type>;
    (index?: number, value?: type): Array<type> | type;
};

export type {
    State,
    SetState,
    StateAssigner,
    Event,
    EventBase,
    defaultArray,
    AllEvents,
};
