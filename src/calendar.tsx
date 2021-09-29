import React from "react";
import { ChangeEvent } from "react";
import { ArrayInRange } from "./smallFunctions";
import { SetState } from "./types";
import months from "./months";
import "./calendar.css";

interface CalendarProps {
    month: number;
    dateRange: number;
    lastDateRange: number;
    dateStartAt: number;
    year: number;
    selectedDate: number;
    setYear: SetState<number>;
    setMonth: SetState<number>;
    setDate: SetState<number>;
    setFocused: SetState<Array<number>>;
}

const Calendar = ({
    month,
    dateRange,
    lastDateRange,
    dateStartAt,
    year,
    selectedDate,
    setYear,
    setMonth,
    setDate,
    setFocused,
}: CalendarProps): JSX.Element => {
    return (
        <div id='calendar'>
            <div id='year-month-wraper'>
                <div id='year-wraper'>
                    <input
                        type='number'
                        id='year'
                        value={year}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            setYear(parseInt(e.target.value));
                        }}
                    />
                    <span id='change-year'>
                        <button
                            className='increament'
                            onClick={(): void => {
                                setYear((year: number): number => ++year);
                            }}
                        ></button>
                        <button
                            className='decreament'
                            onClick={(): void => {
                                setYear((year: number): number => --year);
                            }}
                        ></button>
                    </span>
                </div>
                <select
                    id='month'
                    onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
                        setMonth(months.indexOf(e.target.value));
                    }}
                    value={months[month]}
                >
                    {months.map((Month: string, index: number): JSX.Element => {
                        return (
                            <option key={index} value={Month}>
                                {Month}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div id='calendar-grid'>
                <span
                    className='calendar-cell day'
                    style={{
                        color: "orangered",
                    }}
                >
                    Sun
                </span>
                <span className='calendar-cell day'>Mon</span>
                <span className='calendar-cell day'>Tue</span>
                <span className='calendar-cell day'>Wed</span>
                <span className='calendar-cell day'>Thu</span>
                <span className='calendar-cell day'>Fri</span>
                <span
                    className='calendar-cell day'
                    style={{
                        color: "orange",
                    }}
                >
                    Sat
                </span>
                {ArrayInRange(lastDateRange - dateStartAt + 1, dateStartAt).map(
                    (date: number, index: number): JSX.Element => (
                        <button
                            className='calendar-cell not-current'
                            style={
                                index % 7 === 0
                                    ? {
                                          color: "orangered",
                                      }
                                    : index % 7 === 6
                                    ? {
                                          color: "orange",
                                      }
                                    : {}
                            }
                            onClick={(): void => {
                                setDate(date);
                                setMonth((Month: number): number =>
                                    Month === 0 ? 11 : Month - 1
                                );
                                setYear((Year: number): number =>
                                    month === 0 ? Year - 1 : Year
                                );
                                setFocused([-1, -1]);
                            }}
                            key={date}
                        >
                            {date}
                        </button>
                    )
                )}
                {[...ArrayInRange(1, dateRange)].map(
                    (date: number): JSX.Element => (
                        <button
                            className={`calendar-cell ${
                                date === selectedDate ? "selected" : ""
                            }`}
                            onClick={(): void => {
                                setDate(date);
                                setFocused([-1, -1]);
                            }}
                            style={
                                (date + dateStartAt - 1) % 7 === 0
                                    ? {
                                          color: "orangered",
                                      }
                                    : (date + dateStartAt) % 7 === 0
                                    ? {
                                          color: "orange",
                                      }
                                    : {}
                            }
                            key={date}
                        >
                            {date}
                        </button>
                    )
                )}
                {ArrayInRange(1, 42 - dateStartAt - dateRange).map(
                    (date: number): JSX.Element => (
                        <button
                            className='calendar-cell not-current'
                            style={
                                (date + dateRange + dateStartAt - 1) % 7 === 0
                                    ? {
                                          color: "orangered",
                                      }
                                    : (date + dateRange + dateStartAt) % 7 === 0
                                    ? {
                                          color: "orange",
                                      }
                                    : {}
                            }
                            onClick={(): void => {
                                setDate(date);
                                setMonth((Month: number): number =>
                                    Month === 11 ? 0 : Month + 1
                                );
                                setYear((Year: number): number =>
                                    month === 11 ? Year + 1 : Year
                                );
                                setFocused([-1, -1]);
                            }}
                            key={date}
                        >
                            {date}
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default Calendar;
