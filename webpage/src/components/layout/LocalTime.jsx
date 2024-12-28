"use client"

export default function LocalTime({ time, locale = 'tr-TR', format = { hour: '2-digit', minute: '2-digit' } }) {
    const options = { ...format };
    console.log(time);
    return (
        <>
            {new Date(time).toLocaleString(locale, options)}
        </>
    );
}