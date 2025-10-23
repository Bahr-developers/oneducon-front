
const Statistics = () => {
    const data = [
        {
            name: 'Jami tan narx',
            summa: 12125,
            valyute: '$'
        },
        {
            name: 'Jami sotuv narx',
            summa: 88129515,
            valyute: 'UZS'
        },
        {
            name: 'Kassadagi pul',
            summa: 27371008,
            valyute: 'UZS'
        },
    ]
    return (
        <div className='flex justify-between items-center w-full gap-4 mt-2'>
            {data.map(el => (
                <div className="w-full border p-4 rounded-xl" key={el.summa}>
                    <h4>{el.name}</h4>
                    <p className='text-3xl font-medium mt-3'>{el.summa.toLocaleString()} {el.valyute}</p>
                </div>
            ))}
        </div>
    );
};

export default Statistics;