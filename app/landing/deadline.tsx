'use client';

import { useEffect, useState } from "react";

export type props = {
    deadline: Date;
    onDeadline: () => void;
};

export default function Deadline(props: props) {
    // count left time in day, hour, minute, second
    // if deadline is passed, call onDeadline
    // return the left time in a formatted string
    
    const [leftTime, setLeftTime] = useState({
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
    })

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = props.deadline.getTime() - now.getTime();
            if (diff <= 0) {
                props.onDeadline();
                clearInterval(interval);
            }
            const day = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minute = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const second = Math.floor((diff % (1000 * 60)) / 1000);
            setLeftTime({ day, hour, minute, second });
        }, 500);
        return () => clearInterval(interval);
    }, [props.deadline]);
    
    return (
        <div className="flex flex-row">
            <div className="flex flex-row">
                <div className="text-2xl font-bold">{leftTime.day}</div>
                <div>일</div>
            </div>
            <div className="flex flex-row">
                <div className="text-2xl font-bold">{leftTime.hour}</div>
                <div>시간</div>
            </div>
            <div className="flex flex-row">
                <div className="text-2xl font-bold">{leftTime.minute}</div>
                <div>분</div>
            </div>
            <div className="flex flex-row">
                <div className="text-2xl font-bold">{leftTime.second}</div>
                <div>초</div>
            </div>
        </div>

    )
}
