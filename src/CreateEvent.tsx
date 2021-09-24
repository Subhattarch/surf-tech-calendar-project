import $ from "jquery";
import React, {
    ChangeEvent,
    FormEvent,
    MouseEvent,
    MutableRefObject,
    SetStateAction,
} from "react";
import { DefaultArray } from "./smallFunctions";
import { defaultArray, Event, EventBase, SetState, State } from "./types";
import useState from "./UseState";
import "./CreateEvent.css";

interface CreateEventProps {
    Ref: MutableRefObject<Event[] | null>;
    changeEventShowed: SetState<defaultArray<number>>;
    setFocus: SetState<Array<number>>;
    toggleCreation: (value: SetStateAction<boolean>) => void;
}

const CreateEvent = ({
    Ref,
    toggleCreation,
    changeEventShowed,
    setFocus,
}: CreateEventProps): JSX.Element => {
    const [StartHour, setStartHour]: State<number> = useState<number>(0);
    const [StartMinute, setStartMinute]: State<number> = useState<number>(0);
    const [EndHour, setEndHour]: State<number> = useState<number>(0);
    const [EndMinute, setEndMinute]: State<number> = useState<number>(0);
    const [AMPMStart, setAMPMStart]: State<string> = useState<string>("am");
    const [AMPMEnd, setAMPMEnd]: State<string> = useState<string>("am");

    return (
        <div
            id='create-event'
            onClick={(): void => {
                toggleCreation(false);
            }}
        >
            <form
                onClick={(e: MouseEvent<HTMLFormElement>) => {
                    e.stopPropagation();
                }}
                onSubmit={(e: FormEvent): void => {
                    e.preventDefault();
                    const form = $(e.target);
                    const startTime: number =
                        parseInt(form.find("#startMinute").val() as string) +
                        (parseInt(form.find("#startHour").val() as string) +
                            ((form.find("#AMPMStart").val() as string) === "am"
                                ? 0
                                : 12)) *
                            60;
                    const endTime: number =
                        parseInt(form.find("#endMinute").val() as string) +
                        (parseInt(form.find("#endHour").val() as string) +
                            ((form.find("#AMPMEnd").val() as string) === "am"
                                ? 0
                                : 12)) *
                            60;
                    const title: string = form.find("#title").val() as string;
                    const description: string = form
                        .find("#description")
                        .val() as string;

                    const EventData: EventBase = {
                        title,
                        description,
                        startTime,
                        endTime,
                    };

                    if (!Array.isArray(Ref.current)) Ref.current = [];
                    const EventsAtSameStart = Ref.current.find(
                        (eventsAtOneTime: Event): boolean =>
                            eventsAtOneTime[0]?.startTime ===
                            EventData.startTime
                    );
                    const indexOfEventsAtSameStart = Ref.current.indexOf(
                        EventsAtSameStart as Event
                    );
                    toggleCreation(false);
                    setFocus([-1, -1]);
                    changeEventShowed(
                        (): defaultArray<number> => DefaultArray<number>(0)
                    );
                    if (EventsAtSameStart == null) {
                        Ref.current = [...Ref.current, [EventData]].sort(
                            (prevEvents: Event, nextEvents: Event) =>
                                prevEvents[0]?.startTime -
                                nextEvents[0]?.endTime
                        );
                        return;
                    }
                    Ref.current[indexOfEventsAtSameStart] = [
                        ...(EventsAtSameStart as Event),
                        EventData,
                    ].sort(
                        (prevEvent: EventBase, nextEvent: EventBase): number =>
                            -prevEvent.endTime +
                            nextEvent.endTime -
                            nextEvent.startTime +
                            prevEvent.startTime
                    );
                }}
            >
                <h2>Create Event</h2>
                <div>
                    <label htmlFor='title'>Title</label>
                    <input
                        type='text'
                        name='title'
                        id='title'
                        required={true}
                    />
                </div>
                <div>
                    <label htmlFor='dscription'>Description</label>
                    <textarea
                        name='description'
                        id='description'
                        cols={60}
                        rows={20}
                        required={true}
                    ></textarea>
                </div>
                <label>
                    Start Time
                    <input
                        type='number'
                        name='startHour'
                        id='startHour'
                        className='number'
                        value={StartHour}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            setStartHour(parseInt(e.target.value));
                        }}
                        max={12}
                        min={0}
                        required={true}
                    />
                    :
                    <input
                        type='number'
                        name='startMinute'
                        id='startMinute'
                        className='number'
                        value={StartMinute}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            setStartMinute(parseInt(e.target.value));
                        }}
                        max={StartHour === 12 ? 0 : 59}
                        min={0}
                        required={true}
                    />
                    <select
                        name='ampmStart'
                        id='AMPMStart'
                        value={AMPMStart}
                        onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
                            setAMPMStart(e.target.value);
                            if (e.target.value === "pm") setAMPMEnd("pm");
                        }}
                        required={true}
                    >
                        <option value='am'>am</option>
                        <option value='pm'>pm</option>
                    </select>
                </label>
                <label>
                    <br />
                    End Time
                    <input
                        type='number'
                        name='endHour'
                        id='endHour'
                        className='number'
                        value={EndHour}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            setEndHour(parseInt(e.target.value));
                        }}
                        min={
                            AMPMEnd === "am" || AMPMEnd === AMPMStart
                                ? StartHour
                                : 0
                        }
                        max={12}
                        required={true}
                    />
                    :
                    <input
                        type='number'
                        name='endMinute'
                        id='endMinute'
                        className='number'
                        value={EndMinute}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            setEndMinute(parseInt(e.target.value));
                        }}
                        min={
                            (AMPMEnd === "am" || AMPMEnd === AMPMStart) &&
                            EndHour === StartHour
                                ? StartMinute
                                : 0
                        }
                        max={EndHour === 12 ? 0 : 59}
                        required={true}
                    />
                    <select
                        name='ampmEnd'
                        id='AMPMEnd'
                        value={AMPMEnd}
                        onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
                            if (AMPMStart === "am")
                                return setAMPMEnd(e.target.value);
                            setAMPMEnd("pm");
                        }}
                        required={true}
                    >
                        <option value='am'>am</option>
                        <option value='pm'>pm</option>
                    </select>
                </label>
                <div>
                    <button type='submit'>Create</button>
                    <button
                        onClick={(e: MouseEvent<HTMLButtonElement>): void => {
                            e.preventDefault();
                            toggleCreation(false);
                            setFocus([-1, -1]);
                        }}
                    >
                        cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
