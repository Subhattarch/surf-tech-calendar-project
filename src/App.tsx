import React, { useEffect, useRef } from "react";
import { get, post } from "jquery";
import useState from "./UseState";
import "./App.css";
import Calendar from "./calendar";
import { DefaultArray, getDaysInMonth } from "./smallFunctions";
import { State, Event, defaultArray, AllEvents } from "./types";
import Events from "./Event";
import CreateEvent from "./CreateEvent";
import SummaryOfEvents from "./SummaryOfEvents";
import Header from "./header";
import SignIn from "./SignIn";
import Message from "./message";

function App(): JSX.Element {
    const [message, setMessage]: State<{
        text: string;
        error?: boolean;
    }> = useState<{
        text: string;
        error?: boolean;
    }>({
        text: "",
        error: false,
    });
    const [year, setYear]: State<number> = useState<number>(
        new Date().getFullYear()
    );
    const [isSigningIn, setSignIn]: State<boolean> = useState<boolean>(false);
    const [month, setMonth]: State<number> = useState<number>(
        new Date().getMonth()
    );
    const [selectedDate, setDate]: State<number> = useState<number>(
        new Date().getDate()
    );

    if (getDaysInMonth(month, year) < selectedDate)
        setDate(getDaysInMonth(month, year));

    const [ShowedEvents, setShowedEvents]: State<defaultArray<number>> =
        useState<defaultArray<number>>(() => DefaultArray<number>(0));
    const [FocusedEvent, setFocused]: State<Array<number>> = useState<
        Array<number>
    >([-1, -1]);

    const [user, setUser]: State<string> = useState<string>(
        ((): string => {
            let String = "unonymous";
            get("/calendar/user", (data: string): void => {
                String = data;
                setUser(String);
            });
            return String;
        })()
    );

    const EventsRef = useRef<Array<Event> | null>(null);

    const events = EventsRef.current;

    const [allEvents, setAllEvents]: State<AllEvents> = useState<AllEvents>({});

    const [isCreatingEvent, toggleCreation]: State<boolean> =
        useState<boolean>(false);

    const createEvent = (): void => toggleCreation(true);

    const dateStartAt = new Date(year, month, 1).getDay();
    useEffect((): void => {
        if (user === "unonymous") return;
        post(
            "/calendar/users/save",
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
    }, [user, allEvents, setMessage]);
    return (
        <div id='App'>
            <Message message={message} setMessage={setMessage} />
            <Header
                setSignIn={setSignIn}
                user={user}
                setUser={setUser}
                allEvents={allEvents}
                setMessage={setMessage}
            />
            <Calendar
                year={year}
                month={month}
                dateRange={getDaysInMonth(month, year)}
                lastDateRange={getDaysInMonth(
                    month === 0 ? 11 : month - 1,
                    month === 0 ? year - 1 : year
                )}
                dateStartAt={dateStartAt}
                selectedDate={selectedDate}
                setDate={setDate}
                setMonth={setMonth}
                setYear={setYear}
                setFocused={setFocused}
            />
            <Events
                year={year}
                month={month}
                date={selectedDate}
                user={user}
                Ref={EventsRef}
                CreateEvent={createEvent}
                ShowEvents={ShowedEvents}
                allEvents={allEvents}
                setAllEvents={setAllEvents}
                setFocused={setFocused}
                Focused={FocusedEvent}
            />
            <SummaryOfEvents
                Events={events}
                changeEventShowed={setShowedEvents}
                setFocus={setFocused}
            />
            {isCreatingEvent && (
                <CreateEvent
                    Ref={EventsRef}
                    toggleCreation={toggleCreation}
                    changeEventShowed={setShowedEvents}
                    setFocus={setFocused}
                />
            )}
            {isSigningIn && <SignIn setUser={setUser} setSignIn={setSignIn} />}
        </div>
    );
}

export default App;
