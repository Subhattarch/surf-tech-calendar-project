import React, { Fragment } from "react";
import { DefaultArray } from "./smallFunctions";
import { defaultArray, Event, EventBase, SetState } from "./types";
import "./SummaryOfEvents.css";

interface SummaryProps {
    Events: Array<Event> | null;
    changeEventShowed: SetState<defaultArray<number>>;
    setFocus: SetState<Array<number>>;
}

const SummaryOfEvents = ({
    Events,
    changeEventShowed,
    setFocus,
}: SummaryProps): JSX.Element => {
    return (
        <div id='SummaryOfEvents'>
            {Events?.map(
                (Event: Event, index: number): JSX.Element => (
                    <Fragment key={index}>
                        {Event.map(
                            (event: EventBase, Index: number): JSX.Element => {
                                const StartHour =
                                    event?.startTime < 60
                                        ? 0
                                        : Math.floor(event?.startTime / 60) %
                                              12 || 12;
                                const StartMinute = event?.startTime % 60;
                                const EndHour =
                                    event?.endTime < 60
                                        ? 0
                                        : Math.floor(event?.endTime / 60) %
                                              12 || 12;
                                const EndMinute = event?.endTime % 60;
                                return (
                                    <button
                                        className='SummarisedEvents'
                                        key={Index}
                                        onClick={(): void => {
                                            changeEventShowed(
                                                (
                                                    EventShowed: defaultArray<number>
                                                ): defaultArray<number> =>
                                                    DefaultArray<number>(
                                                        0,
                                                        EventShowed(
                                                            index,
                                                            Index
                                                        )
                                                    )
                                            );
                                            setFocus([index, Index]);
                                        }}
                                    >
                                        <h3>{event?.title}</h3>
                                        <p>
                                            From {StartHour}:{StartMinute}{" "}
                                            {event?.startTime <= 12 * 60
                                                ? "am"
                                                : "pm"}{" "}
                                            to {EndHour}:{EndMinute}{" "}
                                            {event?.endTime <= 12 * 60
                                                ? "am"
                                                : "pm"}
                                        </p>
                                    </button>
                                );
                            }
                        )}
                    </Fragment>
                )
            )}
        </div>
    );
};

export default SummaryOfEvents;
