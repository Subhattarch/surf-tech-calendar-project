import $, { get } from "jquery";
import React, { MutableRefObject, useEffect } from "react";
import { State, Event, defaultArray, AllEvents, SetState } from "./types";
import UseState from "./UseState";
import "./Event.css";
import { ArrayInRange } from "./smallFunctions";

interface EventsProps {
    year: number;
    month: number;
    date: number;
    user: string;
    ShowEvents: defaultArray<number>;
    Ref: MutableRefObject<Event[] | (Event | undefined)[] | null>;
    CreateEvent(): void;
    allEvents: AllEvents;
    setAllEvents: SetState<AllEvents>;
    setFocused: SetState<Array<number>>;
    Focused: Array<number>;
}

const Events = ({
    year,
    month,
    date,
    user,
    Ref,
    CreateEvent,
    ShowEvents,
    allEvents,
    setAllEvents,
    setFocused,
    Focused,
}: EventsProps): JSX.Element => {
    const dataName = `${date}-${month}-${year}`;
    const [events, setEvents]: State<Array<Event | undefined> | null> =
        UseState<Array<Event | undefined> | null>(
            ((): Array<Event> => {
                if (allEvents[dataName] != null) {
                    return allEvents[dataName];
                }
                get(
                    `./calendar/${user}-${dataName}.json`,
                    (data: Array<Event>): void => {
                        const Data: AllEvents = {};
                        Data[dataName] = data;
                        setAllEvents(Data);
                        setEvents(data);
                    },
                    "json"
                );
                return [];
            })()
        );

    const current = Ref.current;
    useEffect((): void => {
        const Data: AllEvents = {};
        Data[dataName] = current as Event[];
        setAllEvents(Data);
        setEvents(current);
    }, [Ref, current, dataName, setAllEvents, setEvents]);

    useEffect((): void => {
        get(
            `./calendar/${user}-${dataName}.json`,
            (data: Array<Event>): void => {
                Ref.current = data;
                const Data: AllEvents = {};
                Data[dataName] = data;
                setAllEvents(Data);
                setEvents(data);
            },
            "json"
        ).fail((): void => {
            console.log("no previous data");
            if (
                allEvents[dataName] != null &&
                (allEvents[dataName] as Event[])?.length === 0
            ) {
                Ref.current = allEvents[dataName];
                setEvents(allEvents[dataName]);
                return;
            }
        });
        Ref.current = [];
        setEvents([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataName, user]);

    if (!Ref.current) Ref.current = events;
    return (
        <div id='Events'>
            {(events?.length || events?.length !== 0) && <h2>Events</h2>}
            {!events?.length || events?.length === 0 ? (
                <h1>No Events Today</h1>
            ) : (
                <div
                    className='event-container'
                    style={{
                        position: "relative",
                        overflowY: "auto",
                    }}
                    ref={(ref: HTMLDivElement): void => {
                        const rem = parseInt($("html").css("font-size"));
                        if (Focused[0] > -1 && Focused[1] > -1)
                            $(ref)?.scrollTop(
                                (events as Event[])?.[Focused[0]]?.[Focused[1]]
                                    .startTime *
                                    rem *
                                    0.3
                            );
                    }}
                >
                    {events?.map((event, index): JSX.Element => {
                        const Index = ShowEvents(index);

                        const Event = [...(event as Event)][Index];
                        const StartHour =
                            Event?.startTime < 60
                                ? 0
                                : Math.floor(Event?.startTime / 60) % 12 || 12;
                        const StartMinute = Event?.startTime % 60;
                        const EndHour =
                            Event?.endTime < 60
                                ? 0
                                : Math.floor(Event?.endTime / 60) % 12 || 12;
                        const EndMinute = Event?.endTime % 60;
                        return (
                            <div
                                key={index}
                                onClick={(): void => {
                                    setFocused([index, Index]);
                                }}
                                style={{
                                    position: "absolute",
                                    top: `${Event?.startTime * 0.3}rem`,
                                    minHeight:
                                        index === Focused[0] &&
                                        Index === Focused[1]
                                            ? `${
                                                  (Event?.endTime -
                                                      Event?.startTime) *
                                                  0.3
                                              }rem`
                                            : "3rem",
                                    height:
                                        index === Focused[0] &&
                                        Index === Focused[1]
                                            ? "auto"
                                            : `${
                                                  (Event?.endTime -
                                                      Event?.startTime) *
                                                  0.3
                                              }rem`,
                                    overflow: "hidden",
                                }}
                                className={`event ${
                                    index === Focused[0] && Index === Focused[1]
                                        ? "focus"
                                        : ""
                                }`}
                            >
                                <p className='time'>
                                    From {StartHour}:{StartMinute}{" "}
                                    {Event?.startTime <= 12 * 60 ? "am" : "pm"}{" "}
                                    to {EndHour}:{EndMinute}{" "}
                                    {Event?.endTime <= 12 * 60 ? "am" : "pm"}
                                </p>
                                <h3>{Event?.title}</h3>
                                <p>{Event?.description}</p>
                            </div>
                        );
                    })}
                    {ArrayInRange(0, 49).map((number: number): JSX.Element => {
                        if (number % 2 === 0)
                            return (
                                <p
                                    key={number}
                                    style={{
                                        position: "absolute",
                                        top: `${number * 9}rem`,
                                        left: "0",
                                        width: "100%",
                                        borderTop: "0.05em solid",
                                        pointerEvents: "none",
                                    }}
                                >
                                    {number === 0 ? 0 : (number / 2) % 12 || 12}{" "}
                                    {number / 2 > 12 ? "pm" : "am"}
                                </p>
                            );

                        return (
                            <p
                                key={number}
                                style={{
                                    position: "absolute",
                                    top: `${number * 9}rem`,
                                    width: "100%",
                                    borderTop: "0.01em solid",
                                    left: "0",
                                    pointerEvents: "none",
                                }}
                            >
                                30
                            </p>
                        );
                    })}
                </div>
            )}
            <button onClick={CreateEvent}>Create new Event</button>
        </div>
    );
};

export default Events;
