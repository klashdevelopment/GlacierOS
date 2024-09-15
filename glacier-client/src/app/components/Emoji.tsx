export default function Emoji({row, col, size='50px'}: Readonly<{row: number, col: number, size?: string}>) {
    return (
        <div className="emoji" style={{
            backgroundPosition: `calc(-1 * ${col} * ${size}) calc(-1 * ${row} * ${size})`,
            maskPosition: `calc(-1 * ${col} * ${size}) calc(-1 * ${row} * ${size})`,
            width: size,
            height: size,
            backgroundSize: `calc(20 * ${size}) calc(4 * ${size})`,
            maskSize: `calc(20 * ${size}) calc(4 * ${size})`
        }}></div>
    );
}