
export default function SummaryBlock({
    total,
    paid,
    remaining,
}: {
    total: number;
    paid: number;
    remaining: number;
}) {
    function formatUZS(value: number) {
        const s = Math.round(value).toString();
        const spaced = s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return `${spaced} UZS`;
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">Jami</div>
                <div className="font-semibold">{formatUZS(total)}</div>
            </div>
            <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">To‘langan</div>
                <div className="font-semibold">{formatUZS(paid)}</div>
            </div>
            <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">Qoldiq</div>
                <div className="font-semibold">{formatUZS(remaining)}</div>
            </div>
        </div>
    );
}
